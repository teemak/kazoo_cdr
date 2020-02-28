const express = require("express");
const app = express();
const port = 3333;
const { calls } = require("./getLogs");
const { users } = require("./getUsers");
const { numbers } = require("./getNumbers");

app.get("/login", (req, res) => {
	//console.log("REQ", req);
	//const calls = logs();
	res.send("AUTHENTICATED USER");
});

app.get("/calls", (req, res) => {
	const logs = calls();

	logs.then(data => {
		const result = data;
		res.send(result);
	});
});

app.get("/users", (req, res) => {
	const logs = users();

	logs.then(data => {
		const result = data;
		res.send(result);
	});
});

app.get("/numbers", (req, res) => {
	const logs = numbers();

	logs.then(data => {
		const result = data;
		res.send(result);
	});
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
