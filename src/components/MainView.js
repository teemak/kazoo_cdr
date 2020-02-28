import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { faChartArea } from "@fortawesome/free-solid-svg-icons";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import MainLegs from "../components/MainLegs";
import Filter from "../components/Filter";
import CustomDate from "../components/CustomDate";
import CustomTime from "../components/CustomTime";
import DropDown from "../components/Dropdown";
import axios from "axios";

export default class MainView extends Component {
	state = {
		logs: [],
		users: [],
		numbers: [],
		filter: "",
	};

	componentDidMount() {
		this.getLogs();
		this.getUsers();
		this.getNumbers();
	}

	getLogs() {
		//console.log("RUNNING GET LOGS");
		axios({
			method: "get",
			url: "/calls",
		}).then(res => {
			this.setState({ logs: res.data });
		});
	}

	getUsers() {
		//console.log("RUNNING GET LOGS");
		axios({
			method: "get",
			url: "/users",
		}).then(res => {
			this.setState({ users: res.data });
		});
	}

	getNumbers() {
		//console.log("RUNNING GET LOGS");
		axios({
			method: "get",
			url: "/numbers",
		}).then(res => {
			//console.log("NUMBERS:", res);
			this.setState({ numbers: res.data });
		});
	}

	filter(filter) {
		//console.log("** FILTER METHOD RUN");
		const result = [];
		this.state.logs.forEach(call => {
			const row = Object.values(call)
				.flat()
				.join("");
			const match = row.includes(filter);
			if (match) result.push(call);
		});
		this.setState({ logs: result });
	}

	reset() {
		this.getLogs();
	}

	render() {
		if (this.state.logs.length === 0) this.getLogs();
		//console.log("TOTAL:", this.state.logs.length);
		return (
			<div>
				<div className="awning">
					<p className="awning-title">
						<FontAwesomeIcon className="awning-icon" icon={faFilter} />
						FILTERS
					</p>
					<p>
						<FontAwesomeIcon className="caret" icon={faCaretRight} size="3x" />
					</p>
				</div>
				<div className="filters-window windows">
					<CustomDate />
					<CustomTime />
					<DropDown title="Select User" data={this.state.users} last="Show All Users" />
					<DropDown
						title="Select Number"
						data={this.state.numbers}
						last="Show All Numbers"
					/>
					<div className="filters-input">
						<p>{this.state.logs.length}</p>
						<p>{this.state.filter}</p>
						<Filter filterTerm={this.filter.bind(this)} />
						<button>SEARCH</button>
						<button onClick={() => this.reset()}>RESET</button>
					</div>
				</div>
				<div className="awning">
					<p className="awning-title">
						<FontAwesomeIcon className="awning-icon" icon={faChartArea} />
						LOGS
					</p>
					<p>
						<FontAwesomeIcon className="caret" icon={faCaretRight} size="3x" />
					</p>
				</div>
				<div className="legs-window windows">
					<table className="main-legs">
						<thead>
							<tr className="table-header">
								<th>Direction</th>
								<th>From</th>
								<th>To</th>
								<th>Disposition</th>
								<th>Time</th>
								<th>Duration</th>
							</tr>
						</thead>
						<MainLegs {...this.state} />
					</table>
				</div>
			</div>
		);
	}
}
