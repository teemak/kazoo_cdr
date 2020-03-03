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
		startDate: new Date(),
		endDate: new Date(),
	};

	componentDidMount() {
		this.getUsers();
		this.getNumbers();
		this.defaultCall();
		//this.getLogs();
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
			this.setState({ logs: prettyData });
		});
	}

	getLogs() {
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
	}

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

	/* SHOULD FILTER BASED ON USER/NUMBER/INPUT */
	filter(filter) {
		const result = [];
		this.state.logs.forEach(call => {
			const row = Object.values(call)
				.flat()
				.join("");
			const match = row.includes(filter);
			if (match) result.push(call);
		});
		this.setState({ logs: result }); //ASYNC
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
		/* MAKE AXIOS POST API CALL
		 * endpoint /calls
		 * START DATE
		 * END DATE
		 */
		//console.log("* REQ TO SERVER ==>", this.state);
		//this.setState({ logs: [] });
		const base = 62167219200;
		const created_from = parseInt(this.state.startDate.getTime() / 1000 + base);
		const created_to = parseInt(this.state.endDate.getTime() / 1000 + base);
		//console.log("* START:", created_from);
		//console.log("** END:", created_to);
		//console.log("SEARCH BUTTON PRESSED");
		axios.create({ baseURL: "http://localhost:3333" });
		axios
			.post("/calls", {
				created_from,
				created_to,
			})
			.then(res => {
				//console.log("CHECK NEXT_KEY", res.data);
				const prettyData = res.data.logs.map(call => {
					call.direction = formatDirection(call.caller_id_number);
					return call;
				});
				const { next_key } = res.data;
				this.setState({ logs: prettyData, nextKey: next_key });

				if (this.state.nextKey) {
					this.nextKeyCall(created_from, created_to, this.state.nextKey);
				}
			});
		//console.log("STATE AFTER SEARCH PRESS:", this.state);
	}

	nextKeyCall(created_from, created_to, next_key) {
		//console.log("NEXT API CALL RAN");
		//console.log("* NEXT_KEY ===>", next_start_key);
		//console.log("* RUNNING NEXT METHOD");
		axios
			.post("/next", {
				created_from,
				created_to,
				next_key,
			})
			.then(res => {
				/* RECURSIVE CALL */
				//console.log("STATE NEXT_KEY   ", next_key);
				//console.log("RESPONSE NEXT_KEY", res.data.next_key);
				console.log("FIRST KEY", next_key);
				console.log("NEW KEY  ", res.data.next_key);

				if (res.data.next_key !== next_key && res.data.next_key) {
					//console.log("** RECURSIVE NEXT METHOD");
					this.nextKeyCall(created_from, created_to, res.data.next_key);
				}
				//console.log("STATE NEXT KEY:", this.state.nextKey);
				this.setState({ logs: [...res.data.logs] });
				//console.log("NEXT KEY:", res);
			});
	}

	reset() {
		this.getLogs();
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
