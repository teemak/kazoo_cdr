const express = require("express");
const app = express();
const port = 3333;
const { auto } = require("./getDefault");
const { calls } = require("./getLogs");
const { users } = require("./getUsers");
const { numbers } = require("./getNumbers");
const { next } = require("./getNext");
const { legs } = require("./getLegs");
const bodyParser = require("body-parser");
//account_id=fe2befec1cd25fa45595eb28c8fa47a6
//credentials=6855ad27b778c6a30ffc6ac95187b009

app.use(bodyParser.json());

app.post("/login", (req, res) => {
	res.send("AUTHENTICATED USER");
});

app.post("/calls", (req, res) => {
	const { created_from, created_to } = req.body;
	const logs = calls(created_from, created_to);
	logs.then(data => {
		res.send(data);
	});
});

app.post("/next", (req, res) => {
	const { created_from, created_to, next_key } = req.body;
	const logs = next(created_from, created_to, next_key);
	logs.then(data => {
		res.send(data);
	});
});

app.post("/default", (req, res) => {
	//console.log("REQUEST BODY", req.body);
	const { created_from, created_to } = req.body;
	//console.log("DEFAULT START POINT", created_from);
	//console.log("DEFAULT END POINT", created_to);
	const logs = auto(created_from, created_to);
	logs.then(data => {
		res.send(data);
	});
});

app.get("/users", (req, res) => {
	const logs = users();
	logs.then(data => {
		res.send(data);
	});
});

app.get("/numbers", (req, res) => {
	const logs = numbers();
	logs.then(data => {
		res.send(data);
	});
});

app.get("/legs", (req, res) => {
	const logs = legs();
	logs.then(data => {
		res.send(data);
	});
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
