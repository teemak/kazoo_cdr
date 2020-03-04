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
			getNumbers(account_id);
		},
	);
};
getToken(process.env.credentials, process.env.account_name, process.env.account_id);

const getNumbers = () => {
	cb.api.numbers.get_numbers(
		{
			url_params: { account_id: process.env.account_id },
		},
		(err, body) => {
			const numbers = JSON.parse(body).data;
			const data = Object.keys(numbers.numbers);
			state.push(...data);
		},
	);
};

const numbers = () => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (state.length) {
				resolve(state);
			} else {
				reject("GET PHONE NUMBERS API DID NOT GET LOGS");
			}
		}, 1000);
	});
};

module.exports = { numbers };
