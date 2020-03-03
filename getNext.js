require("dotenv").config();
const Crossbar = require("crossbar-nodejs");
const cb = new Crossbar({
	url: process.env.API_URL,
	port: process.env.API_PORT,
	version: process.env.API_VERSION,
});
const state = { logs: [], next_key: "" };

const getToken = (credentials, account_name, account_id, created_from, created_to) => {
	cb.api.user_auth.create_user_auth(
		{
			data: { credentials, account_name },
		},
		(err, body) => {
			cb.set_auth_token(body.auth_token);
		},
	);
};
getToken(process.env.credentials, process.env.account_name, process.env.account_id);

const getLogs = (created_from, created_to, next_key) => {
	/*console.log("CREATED FROM:", created_from);
	console.log("CREATED TO:", created_to);*/
	//console.log("GET NEXT KEY", next_key);
	console.log("ORIGINAL KEY:", next_key);
	cb.api.cdrs.get_interaction(
		{
			url_params: { account_id: process.env.account_id },
			//query_string: `?created_from=${created_from}&created_to=${created_to}&next_start_key=${next_key}`,
			query_string: `?created_from=${created_from}&created_to=${created_to}&start_key=${next_key}`,
		},
		(err, body) => {
			const logs = JSON.parse(body);
			//state.next_key = logs.next_start_key;
			//console.log("NEW KEY:     ", logs.next_start_key);
			//console.log("***********");
			/* ERROR HERE */
			//console.log("?? NEXT DATA:", logs);
			//console.log("** API RES DATA:", logs.data.length);
			//console.log("**");
			//console.log("API NEXT_KEY:", state.next_key);
			state.logs.push(...logs.data);
			state.next_key = logs.next_start_key;
			//console.log("STATE SERVER SIDE NEXT FROM NEXT API CALL", state);
		},
	);
};

const next = (created_from, created_to, next_key) => {
	//console.log("**** ", next_key);
	getLogs(created_from, created_to, next_key);

	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (state.logs.length) {
				//console.log("PROMISE RESOLVED");
				resolve(state);
			} else {
				reject("API DID NOT GET LOGS");
				//process.exit(1);
			}
		}, 1500);
	});
};

module.exports = { next };
