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
			//getLogs(account_id);
			//getNumbers(account_id);
			getUsers(account_id);
			/* setTimeout(() => {
				//console.log("STATE: ", state);
			}, 800); */
		},
	);
};

getToken(process.env.credentials, process.env.account_name, process.env.account_id);

const getUsers = account_id => {
	cb.api.users.get_users(
		{
			url_params: { account_id: process.env.account_id },
		},
		(err, body) => {
			// ASSUMES THAT TOTAL PHONE NUMBERS IS LESS THAN 50
			const users = JSON.parse(body).data;
			users.forEach(user => {
				const currentUser = `${user.first_name} ${user.last_name}`;
				state.push(currentUser);
			});
			//console.log("USERS STATE: ", state);
		},
	);
};

const users = () => {
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

module.exports = { users };
