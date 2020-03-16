require("dotenv").config();
const Crossbar = require("crossbar-nodejs");
const cb = new Crossbar({
	url: process.env.API_URL,
	port: process.env.API_PORT,
	version: process.env.API_VERSION,
});
const state = { logs: [], next_key: "" };

const getToken = (credentials, account_name, account_id) => {
	cb.api.user_auth.create_user_auth(
		{
			data: { credentials, account_name },
		},
		(err, body) => {
			cb.set_auth_token(body.auth_token);
			//console.log(body.auth_token);
		},
	);
};

getToken(process.env.credentials, process.env.account_name, process.env.account_id);

/*const toGregorian = date => {
	let result;
	result = parseInt(date.getTime() / 1000 + 62167219200);
	return result;
};*/

const getLogs = account_id => {
	//const getLogs = (created_from, created_to, account_id) => {
	const start = new Date();
	start.setHours(0, 0, 0, 0);
	let end = new Date();
	end.setHours(23, 59, 59, 999);
	const base = 62167219200;
	const created_from = parseInt(start.getTime() / 1000 + base);
	const created_to = parseInt(end.getTime() / 1000 + base);
	/*console.log("DEFAULT");
	console.log("START", created_from);
	console.log("END", created_to);*/

	cb.api.cdrs.get_interaction(
		{
			url_params: { account_id },
			query_string: `?created_from=${created_from}&created_to=${created_to}&page_size=100`,
			//query_string: `?created_from=${created_from}&created_to=${created_to}&page_size=100`,
		},
		(err, body) => {
			const logs = JSON.parse(body);
			console.log("LOGS.lENGTH", logs.length);
			state.logs.push(...logs.data);
			state.next_key = logs.next_start_key; //TEMP FOR TESTING
			return new Promise((res, rej) => {
				res(state);
			});
		},
	);
};

const auto = (created_from, created_to) => {
	getLogs(process.env.ceda_account_id);
	//getLogs(created_from, created_to, process.env.ceda_account_id);
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (state.logs.length) {
				resolve(state);
			} else {
				reject("DEFAULT API DID NOT GET LOGS", state);
			}
		}, 2500);
	});
};

module.exports = { auto };
