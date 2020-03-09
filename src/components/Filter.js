import React, { Component } from "react";

export default class Filter extends Component {
	render() {
		return (
			<input
				type="text"
				id="outlined-basic"
				placeholder="Filter By Caller, Duration, Number..."
				onChange={event => this.props.filterTerm(event.target.value)}
			/>
		);
	}
}
