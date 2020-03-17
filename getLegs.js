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

const getLogs = (created_from, created_to) => {
	/* use get_interaction api
	 * only api that sends EXTENSION
	 * call direction will be determined on client
	 */

	cb.api.cdrs.get_interaction(
		{
			url_params: { account_id: process.env.ceda_account_id },
			query_string: `?created_from=${created_from}&created_to=${created_to}&page_size=100`,
		},
		(err, body) => {
			const logs = JSON.parse(body);
			state.next_key = logs.next_start_key;
			state.logs.push(...logs.data);
		},
	);
};

const legs = (created_from, created_to) => {
	getLogs(created_from, created_to);
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (state.logs.length) {
				resolve(state);
			} else {
				reject("GET LEGS API DID NOT GET LOGS");
			}
		}, 2000);
	});
};

module.exports = { legs };
