import React, { Component } from "react";

class Login extends Component {
	constructor() {
		super();

		this.state = {
			value: "",
		};

		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event) {
		const { value } = event.target;
		this.setState(() => {
			return {
				value,
			};
		});
	}

	render() {
		return (
			<form className="login">
				<input type="text" value={this.state.value} onChange={this.handleChange} />
				<input type="password" value={this.state.value} onChange={this.handleChange} />
				<button>LOGIN</button>
			</form>
		);
	}
}

export default Login;
