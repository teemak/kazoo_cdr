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

app.get("/default", (req, res) => {
	const logs = auto();
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

app.listen(port, () => console.log(`Server listening on port ${port}`));
