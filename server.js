const express = require("express");
const app = express();
const port = 3333;
const { auto } = require("./getDefault");
const { calls } = require("./getLogs");
const { users } = require("./getUsers");
const { numbers } = require("./getNumbers");
const { next } = require("./getNext");
const bodyParser = require("body-parser");

app.use(bodyParser.json());

app.post("/login", (req, res) => {
	console.log("REQUEST FROM CLIENT:", req);
	res.send("AUTHENTICATED USER");
});

app.get("/default", (req, res) => {
	const logs = auto();
	logs.then(data => {
		const result = data;
		res.send(result);
	});
});

app.post("/calls", (req, res) => {
	const { created_from, created_to } = req.body;
	const logs = calls(created_from, created_to);
	logs.then(data => {
		const result = data;
		//console.log("1", data); //CORRECT
		//console.log("* END 1 *");
		res.send(result);
	});
});

app.post("/next", (req, res) => {
	const { created_from, created_to, next_key } = req.body;
	/*console.log("RAW:", req.body);
	console.log("START:", created_from);
	console.log("END:", created_to);*/
	console.log("START KEY:   ", next_key);

	/* getNext.js */
	const logs = next(created_from, created_to, next_key);

	logs.then(data => {
		// THIS SHOULD BE NEW START KEY //
		//console.log("FINAL *****: ", data); // WRONG // EMPTY
		res.send(data);
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
