import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { faChartArea } from "@fortawesome/free-solid-svg-icons";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import MainLegs from "../components/MainLegs";
import Filter from "../components/Filter";
import CustomDate from "../components/CustomDate";
import DropDown from "../components/Dropdown";
import axios from "axios";
import formatDirection from "../helper/formatDirection";

export default class MainView extends Component {
	state = {
		logs: [],
		users: [],
		numbers: [],
		directions: ["inbound", "outbound"],
		nextLogs: [],
		startDate: new Date(),
		endDate: new Date(),
	};

	temps = {};

	componentDidMount() {
		this.getUsers();
		this.getNumbers();
		this.defaultCall();
	}

	defaultCall() {
		axios({
			method: "get",
			url: "/default",
		}).then(res => {
			const prettyData = res.data.map(call => {
				call.direction = formatDirection(call.caller_id_number);
				return call;
			});
			// #1
			this.setState({ logs: prettyData, nextLogs: [...prettyData] });
			//console.log("* INITIAL STATE", this.state.logs);
		});
	}

	/*getLogs() {
		axios({
			method: "get",
			url: "/calls",
		}).then(res => {
			const prettyData = res.data.map(call => {
				call.direction = formatDirection(call.caller_id_number);
				return call;
			});
			this.setState({ logs: prettyData });
		});
	}*/

	getUsers() {
		axios({
			method: "get",
			url: "/users",
		}).then(res => {
			this.setState({ users: res.data });
		});
	}

	getNumbers() {
		axios({
			method: "get",
			url: "/numbers",
		}).then(res => {
			this.setState({ numbers: res.data });
		});
	}

	filter(filter) {
		const result = [];
		this.state.logs.forEach(call => {
			const row = Object.values(call)
				.flat()
				.join("");
			const match = row.includes(filter);
			if (match) result.push(call);
		});
		this.setState({ logs: result });
		/* RETURNS FILTERED LOGS */
	}

	/* CALLBACK FROM PARENT */
	selectDropdown(selection) {
		if (
			selection === "Show All Users" ||
			selection === "Show All Numbers" ||
			selection === "Show All Directions"
		) {
			this.reset();
		}
		this.filter(selection);
	}

	search() {
		//console.log("BASE STATE", this.state.logs);
		const base = 62167219200;
		const created_from = parseInt(this.state.startDate.getTime() / 1000 + base);
		const created_to = parseInt(this.state.endDate.getTime() / 1000 + base);
		//console.log("START:", created_from);
		//console.log("END:", created_to);

		axios
			.post("/calls", {
				created_from,
				created_to,
			})
			.then(res => {
				const prettyData = res.data.logs.map(call => {
					call.direction = formatDirection(call.caller_id_number);
					return call;
				});
				const { next_key } = res.data;

				// this.setState({ logs: prettyData, nextKey: next_key, nextLogs: [...prettyData] });
				//console.log("** CALL LOGS:", prettyData); // CORRECT

				/* INITIAL STATE */
				this.setState({ logs: prettyData });

				/* ONLY RUNS ONCE */
				if (res.data.next_key) {
					//console.log("NEXT KEY EXISTS");
					this.nextKeyCall(created_from, created_to, next_key);
				}
			});
	}

	nextKeyCall(created_from, created_to, next_key) {
		/* SCOPING PROBLEM EXISTS */
		//console.log("NEXT FUNCTION RUN");
		axios
			.post("/next", {
				created_from,
				created_to,
				next_key,
			})
			.then(res => {
				/* ERROR */
				// WHY DOES RESPONSE SEND MORE THAN 50? vvv
				// DUPLICATES FROM PREVIOUS LOG ARE ADDED
				//console.log("SERVER RESPONSE LENGTH:", res.data.logs.length);
				const prettyData = res.data.logs.map(call => {
					call.direction = formatDirection(call.caller_id_number);
					return call;
				});
				// EXPECTING 2nd PART OF CALL LOGS // CORRECT
				// console.log("NEXT CALL LOGS:", prettyData);
				const ids = prettyData.map(item => item.id);
				const set = new Set(ids);
				// console.log("IDS", ids);
				// console.log("**");
				set.add(...ids);
				//console.log("SET LENGTH:", set.size);
				//console.log("Check calls for reason limit is exceeded:", res.data.logs);

				//this.setState({ logs: [...this.state.logs, ...prettyData] });
				this.setState({ logs: [...this.state.logs, ...prettyData] });
				//console.log("STATE SET");
				//console.log("STATE:", this.state.logs);

				if (res.data.next_key) {
					//console.log("NEXT KEY EXISTS: ", res.data.next_key);
					// is this too fast?????
					this.nextKeyCall(created_from, created_to, res.data.next_key);
				}

				/*TESTING if (res.data.next_key !== next_key && res.data.next_key) {
					this.nextKeyCall(created_from, created_to, res.data.next_key);
				}*/

				// this.setState({ nextLogs: [...res.data.logs] });
				// this.setState({ logs: this.state.nextLogs });
				// this.setState({ logs: [...this.state.logs, ...res.data.logs] });
			});
	}

	reset() {
		this.defaultCall();
	}

	startDate(date) {
		this.setState({ startDate: date });
	}

	endDate(date) {
		this.setState({ endDate: date });
	}

	render() {
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
					<CustomDate
						{...this.state}
						changeStart={this.startDate.bind(this)}
						changeEnd={this.endDate.bind(this)}
					/>

					<DropDown
						selection={this.selectDropdown.bind(this)}
						title="Select User"
						data={this.state.users}
						last="Show All Users"
					/>
					<DropDown
						selection={this.selectDropdown.bind(this)}
						title="Select Number"
						data={this.state.numbers}
						last="Show All Numbers"
					/>
					<DropDown
						auto={"Show All Directions"}
						selection={this.selectDropdown.bind(this)}
						title="Select Direction"
						data={this.state.directions}
						last="Show All Directions"
					/>
					<div className="filters-input">
						<p>{this.state.logs.length}</p>
						<Filter filterTerm={this.filter.bind(this)} />
						<button onClick={() => this.search()}>SEARCH</button>
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
								<th>Index</th>
								<th>From</th>
								<th>Direction</th>
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
