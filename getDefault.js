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
			cb.set_auth_token(body.auth_token);
			getLogs(account_id);
		},
	);
};

getToken(process.env.credentials, process.env.account_name, process.env.account_id);

const toGregorian = date => {
	let result;
	result = parseInt(date.getTime() / 1000 + 62167219200);
	return result;
};

const getLogs = account_id => {
	const start = new Date();
	start.setHours(0, 0, 0, 0);
	let end = new Date();
	end.setHours(23, 59, 59, 999);

	cb.api.cdrs.get_interaction(
		{
			url_params: { account_id },
			query_string: `?created_from=${toGregorian(start)}&created_to=${toGregorian(end)}`,
			//query_string: "?page_size=1000", // NOT SCALABLE
		},
		(err, body) => {
			const logs = JSON.parse(body);
			state.push(...logs.data);
		},
	);
};

const auto = () => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (state.length) {
				resolve(state);
			} else {
				reject("API DID NOT GET LOGS");
			}
		}, 1000);
	});
};

module.exports = { auto };
