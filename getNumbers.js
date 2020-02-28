require("dotenv").config();
const Crossbar = require("crossbar-nodejs");
const cb = new Crossbar({
	url: process.env.API_URL,
	port: process.env.API_PORT,
	version: process.env.API_VERSION,
});

const state = [];
const getToken = (credentials, account_name, account_id) => {
	cb.api.user_auth.create_user_auth(
		{
			data: { credentials, account_name },
		},
		(err, body) => {
			//console.log("BODY", body);
			cb.set_auth_token(body.auth_token);
			/* WHAT HAPPENS WHEN FILTERED API IS USED */
			getNumbers(account_id);
		},
	);
};

getToken(process.env.credentials, process.env.account_name, process.env.account_id);

const getNumbers = account_id => {
	cb.api.numbers.get_numbers(
		{
			url_params: { account_id: process.env.account_id },
		},
		(err, body) => {
			// ASSUMES THAT TOTAL PHONE NUMBERS IS LESS THAN 50
			const numbers = JSON.parse(body).data;
			// numbers are keys
			const data = Object.keys(numbers.numbers);
			state.push(...data);
			//console.log("PHONE NUMBERS STATE:", state);
		},
	);
};

/*
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
*/

const numbers = () => {
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

module.exports = { numbers };
