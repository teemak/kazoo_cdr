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
			getUsers(account_id);
		},
	);
};
getToken(process.env.credentials, process.env.account_name, process.env.account_id);

const getUsers =()  => {
	cb.api.users.get_users(
		{
			url_params: { account_id: process.env.account_id },
		},
		(err, body) => {
			const users = JSON.parse(body).data;
			users.forEach(user => {
				const currentUser = `${user.first_name} ${user.last_name}`;
				state.push(currentUser);
			});
		},
	);
};

const users = () => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (state.length) {
				resolve(state);
			} else {
				reject("GET USERS API DID NOT GET LOGS");
			}
		}, 1000);
	});
};

module.exports = { users };
