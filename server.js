const express = require("express");
const app = express();
const port = 3333;
const calls = require("./getLogs");

app.get("/login", (req, res) => {
	console.log("REQ", req);
	//const calls = logs();
	res.send("AUTHENTICATE DATA");
});

app.get("/calls", (req, res) => {
	const logs = calls();

	logs.then(data => {
		const result = data;
		res.send(result);
	});
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
