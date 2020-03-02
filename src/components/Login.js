import React, { Component } from "react";
import axios from "axios";

class Login extends Component {
	constructor() {
		super();

		this.state = {
			user: "",
			pass: "",
			auth: false,
		};

		this.handleUser = this.handleUser.bind(this);
		this.handlePass = this.handlePass.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(event) {
		event.preventDefault();
		//console.log("** SENDING CREDS");
		//const instance = axios.create({ baseURL: "http://localhost:3333" });
		//instance.post("/login").then(response => {
		//console.log("CLIENT SIDE RESPONSE FROM SERVER:", response);
		//});

		axios.post("/login", {
			user: "Tee",
			pass: "Cats",
		});
	}

	handleUser(event) {
		const { value } = event.target;
		//console.log("USER:", value);
		this.setState(() => {
			return {
				user: value,
			};
		});
	}

	handlePass(event) {
		const { value } = event.target;
		//console.log("PASS:", value);
		this.setState(() => {
			return {
				pass: value,
			};
		});
	}

	render() {
		return (
			<form className="login" onSubmit={this.handleSubmit}>
				<label htmlFor="user">USER NAME</label>
				<input id="user" type="text" value={this.state.user} onChange={this.handleUser} />
				<label htmlFor="pass">PASSWORD</label>
				<input
					id="pass"
					type="password"
					value={this.state.pass}
					onChange={this.handlePass}
				/>
				<input type="submit" value="SIGN IN" />
			</form>
		);
	}
}

export default Login;
