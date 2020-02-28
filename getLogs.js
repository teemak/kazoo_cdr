require("dotenv").config();
const Crossbar = require("crossbar-nodejs");
const cb = new Crossbar({
	url: process.env.API_URL,
	port: process.env.API_PORT,
	version: process.env.API_VERSION,
});
const state = [];

const getToken = (credentials, account_name, account_id) => {
	/* THIS SHOULD RUN ON EVERY API CALL */
	/* SO THAT THERE IS NO STALE TOKEN */

	cb.api.user_auth.create_user_auth(
		{
			data: { credentials, account_name },
		},
		(err, body) => {
			//console.log("BODY", body);
			cb.set_auth_token(body.auth_token);
			/* WHAT HAPPENS WHEN FILTERED API IS USED */
			getLogs(account_id);
			/* setTimeout(() => {
				//console.log("STATE: ", state);
			}, 800); */
		},
	);
};

const getLogs = account_id => {
	//console.log("CDRS API CALL");
	//cb.api.cdrs.get_cdrs(
	cb.api.cdrs.get_interaction(
		// only has correct direction
		{
			url_params: { account_id },
			//query_string: "?paginate=true",
			//query_string: "?page_size=10",
			query_string: "?page_size=100",
			//query_string: "?page_size=1000", // NOT SCALABLE
		},
		(err, body) => {
			//console.log("** LOGS:\n", JSON.parse(JSON.stringify(body, null, 4)));
			const logs = JSON.parse(body);
			const next_key = logs.next_start_key;
			state.push(...logs.data);
			//console.log("PUSHING CALLS");
			//console.log("NEXT KEY:", next_key);
		},
	);
};

getToken(process.env.credentials, process.env.account_name, process.env.account_id);

const calls = () => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (state.length) {
				//console.log("PROMISE RESOLVED");
				resolve(state);
			} else {
				reject("API DID NOT GET LOGS");
				//process.exit(1);
			}
		}, 1000);
	});
};

module.exports = { calls };
