import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import {
	faChartArea,
	faArrowCircleLeft,
	faArrowCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import MainLegs from "../components/MainLegs";
import Filter from "../components/Filter";
import CustomDate from "../components/CustomDate";
import DropDown from "../components/Dropdown";
import axios from "axios";
import formatPhoneNumber from "../helper/formatPhoneNumber";
import formatDirection from "../helper/formatDirection";
import formatDisposition from "../helper/formatDisposition";

export default class MainView extends Component {
	state = {
		logs: [],
		viewable: [],
		users: [],
		numbers: [],
		directions: ["Inbound", "Outbound"],
		nextLogs: [],
		startDate: new Date(),
		endDate: new Date(),
		user: "All Users",
		number: "All Numbers",
		direction: "All Directions",
		tags: [],
		//tags: new Set(),
		startTime: "",
		endTime: "",
		status: "Done",
		filter: false,
	};

	temps = {};

	componentDidMount() {
		this.getUsers();
		this.getNumbers();
		this.defaultCall();
		this.getTime(1);
	}

	getTime(first) {
		const meridian = time => (time > 12 ? "PM" : "AM");
		const hours = hour => (hour >= 12 ? hour - 12 : hour);
		const hour = hour => (hour === 0 ? 12 : hour);
		const minutes = minutes => (minutes < 10 ? `0${minutes}` : minutes);
		let startTime;

		if (first) {
			startTime = "00:00 AM";
		} else {
			startTime = `${hour(hours(this.state.startDate.getHours()))}:${minutes(
				this.state.startDate.getMinutes(),
			)} ${meridian(this.state.startDate.getHours())}`;
		}

		this.setState({
			startTime,
			endTime: `${hour(hours(this.state.endDate.getHours()))}:${minutes(
				this.state.endDate.getMinutes(),
			)} ${meridian(this.state.endDate.getHours())}`,
		});
	}

	defaultCall() {
		axios({
			method: "get",
			url: "/default",
		}).then(res => {
			const prettyData = res.data.map(call => {
				call.direction = formatDirection(call.caller_id_number);
				call.caller_id_number = formatPhoneNumber(call.caller_id_number);
				call.dialed_number = formatPhoneNumber(call.callee_id_number);
				call.hangup_cause = formatDisposition(call.callee_id_name, call.hangup_cause);
				//call.callee_id_name = formatPhoneNumber(call.callee_id_name);
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

	filter(filter) {
		//console.log("STATE.TAGS", this.state.tags);
		if (this.state.filter === false) {
			console.log("SIMPLE FILTER");
			const result = [];
			this.state.logs.forEach(call => {
				const row = Object.values(call)
					.flat()
					.join("");
				const match = row.includes(filter);
				if (match) result.push(call);
			});
			this.setState({ viewable: result, filter: true });
		} else if (this.state.filter) {
			console.log("COMPOUND FILTER");
			const result = [];
			this.state.viewable.forEach(call => {
				const match = call.direction.includes(filter.toLowerCase());
				if (match) {
					console.log("MATCH");
					result.push(call);
				}
			});
			this.setState({ viewable: result, filter: true });
		}
		console.log("STATE.TAGS", this.state.tags);
		/*
		if (filter === "All Users" || filter === "All Numbers" || filter === "All Directions") {
			this.search();
			this.setState({ filter: false });
		} else if (this.state.tags) {
			console.log("RUNNING COMPOUND FILTER");
			const result = [];
			this.state.viewable.forEach(call => {
				const match = call.direction.includes(filter.toLowerCase());

				if (match) {
					console.log("MATCH");
					result.push(call);
				}
			});
			this.setState({ viewable: result, filter: true });
		} 
		*/
	}

	/* CALLBACK FROM PARENT */
	selectDropdown(selection) {
		//console.log("STATE IN DROPDOWN", this.state);
		if (
			selection === "All Users" ||
			selection === "All Numbers" ||
			selection === "All Directions"
		) {
			this.reset();
		}
		this.filter(selection);
		//const items = [this.state.tags.add(selection)];
		//this.setState({ user: selection, tags: [selection] });
		this.setState({ user: selection, tags: [...this.state.tags, selection] });
	}

	clear() {
		/* SET STATE IS ASYNCHRONOUS */
		this.setState({ logs: [] }, () => {
			this.getData();
		});
	}

	search() {
		// SHOULD RESET ALL THE VALUES IN THE DROPDOWN
		const base = 62167219200;
		const created_from = parseInt(this.state.startDate.getTime() / 1000 + base);
		const created_to = parseInt(this.state.endDate.getTime() / 1000 + base);

		axios
			.post("/calls", {
				created_from,
				created_to,
				//paginate=50
			})
			.then(res => {
				let { next_key, logs } = res.data;
				/* EVIL HACK
				 * caches previous server response
				 * if it caches we only want the most recent data
				 * which is the last 50 or page length of api call
				 */
				if (logs.length > 50) {
					logs = logs.slice(-50);
				}

				/*let prettyData = logs.map(call => {
					call.direction = formatDirection(call.caller_id_number);
					return call;
				});*/

				const prettyData = logs.map(call => {
					call.direction = formatDirection(call.caller_id_number);
					call.caller_id_number = formatPhoneNumber(call.caller_id_number);
					call.dialed_number = formatPhoneNumber(call.callee_id_number);
					call.hangup_cause = formatDisposition(call.callee_id_name, call.hangup_cause);
					//call.callee_id_name = formatPhoneNumber(call.callee_id_name);
					return call;
				});

				if (next_key) {
					this.setState({ nextLogs: [...prettyData], status: "Loading" });
					this.nextKeyCall(created_from, created_to, next_key);
				} else {
					this.setState({ logs: prettyData, filter: false, tags: [] });
				}
			});
		this.getTime();
	}

	/* RECURSIVE SCOPING EXISTS */
	nextKeyCall(created_from, created_to, next_key) {
		/* SCOPING PROBLEM EXISTS */
		//console.log("NEXT FUNCTION RUN");
		//const existingLogs = [];
		//console.log("PREVIOUS LOGS", previousLogs);
		//console.log("** running nextKeyCall", next_key);
		//while (next_key) {
		axios
			.post("/next", {
				created_from,
				created_to,
				next_key,
			})
			.then(res => {
				const prettyData = res.data.logs.map(call => {
					call.direction = formatDirection(call.caller_id_number);
					return call;
				});
				//existingLogs.push(...prettyData);
				//console.log("NEXT LOGS LENGTH", this.state.nextLogs);
				//console.log("RESPONSE LENGTH:", prettyData.length);
				this.setState({ nextLogs: [...this.state.nextLogs, ...prettyData] }, () =>
					this.setState({ logs: this.state.nextLogs }),
				);
				//console.log("CRASH? -- NEXT_KEY_CALL METHOD");
				//console.log("SETTING LOG STATE IN CALLBACK OF NEXT LOGS");
				// CONCAT IN REAL TIME
				//this.setState({ logs: this.state.nextLogs });
				//console.log("EXISTING LOGS LENGTH:", existingLogs.length);
				//console.log("WHAT IS THIS", res.data.next_key);
				if (res.data.next_key) {
					this.nextKeyCall(created_from, created_to, res.data.next_key);
				} else {
					// console.log("LENGTH OF AGGREGATE LOGS", this.state.nextLogs.length);
					// REMOVE THE 1st 50
					//const currentState = [...this.state.nextLogs];
					//console.log("IS THIS THE CORRECT LENGTH?", currentState.length);
					this.setState({
						logs: [...this.state.nextLogs],
						status: "Done",
						filter: false,
					});
					//this.setState({ logs: this.state.nextLogs });
				}
				//this.setState({ logs: [...prettyData] });
				/*if (res.data.next_key) {
						this.setState({ logs: [...prettyData] });
						this.nextKeyCall(
							created_from,
							created_to,
							res.data.next_key,
							this.state.logs,
						);
					} else {
						this.setState({ logs: prettyData });
					}*/
			});
		//}
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

	getCallLogs(logs) {
		this.setState({ logs });
		//console.log("DATA FROM CHILD");
	}

	icon(direction) {
		let point;
		switch (direction) {
			case "inbound":
				point = (
					<FontAwesomeIcon
						style={{ color: "#6db65b" }}
						size="2x"
						icon={faArrowCircleRight}
					/>
				);
				break;
			case "outbound":
				point = (
					<FontAwesomeIcon
						style={{ color: "#22a5ff" }}
						size="2x"
						icon={faArrowCircleLeft}
					/>
				);
				break;
			default:
				return;
		}
		return point;
	}

	showCalls() {
		let calls = [];

		this.state.logs.forEach((call, index) => {
			const {
				id,
				direction,
				caller_id_name,
				caller_id_number,
				callee_id_name,
				dialed_number,
				hangup_cause,
				datetime,
				duration_seconds,
			} = call;
			calls.push(
				<tr key={id}>
					<td>{index + 1}</td>
					<td>
						{caller_id_name}
						<p>{caller_id_number}</p>
					</td>
					<td>{this.icon(direction)}</td>
					<td>
						{callee_id_name}
						<p>{dialed_number}</p>
					</td>
					<td>{hangup_cause}</td>
					<td>{datetime}</td>
					<td>{duration_seconds}</td>
				</tr>,
			);
		});
		//console.log("CALLS", calls);
		//console.log("**");
		return calls;
	}

	formatDate(date) {
		//console.log("ARG INSIDE FORMAT DATE METHOD", date);
		const copy = date;
		const month = copy.getMonth();
		//console.log("OG DATE OBJECT", date);
		const day = date.getDate();
		//const year = date.getYear();
		//console.log("DATE", date);
		const MONTHS = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December",
		];
		//console.log("MONTH", month);
		//console.log("DAY", day);
		//console.log("YEAR", year);
		return `${MONTHS[month]} ${day}`;
	}

	addTag(input) {
		console.log("WHAT IS THE VALUE", input);
	}

	render() {
		//console.log("START DATE IS: ", this.state.startDate);
		//console.log("END DATE IS: ", this.state.endDate);
		//console.log("STATE.FILTER", this.state.filter);
		//console.log("LOGS", this.state.logs);
		//console.log("VIEWABLE", this.state.viewable);
		const logs = this.state.filter ? this.state.viewable : this.state.logs;
		//console.log("WHAT IS LOGS?", logs);
		return (
			<div>
				<div className="awning">
					<p className="awning-title">
						<FontAwesomeIcon className="awning-icon" icon={faFilter} />
						FILTERS
					</p>
				</div>
				<div className="filters-window windows">
					<CustomDate
						{...this.state}
						changeStart={this.startDate.bind(this)}
						changeEnd={this.endDate.bind(this)}
					/>
					<div className="filter-button-container">
						<button className="filter-button" onClick={() => this.search()}>
							SEARCH
						</button>
					</div>

					<DropDown
						id={"select-user"}
						selection={this.selectDropdown.bind(this)}
						title="Select User"
						data={this.state.users}
						last="All Users"
					/>
					<DropDown
						id={"select-number"}
						selection={this.selectDropdown.bind(this)}
						title="Select Number"
						data={this.state.numbers}
						last="All Numbers"
					/>
					<DropDown
						id={"select-direction"}
						selection={this.selectDropdown.bind(this)}
						title="Select Direction"
						data={this.state.directions}
						last="All Directions"
					/>
					<div className="filters-input">
						<label htmlFor={"filter-input"} className="filter-label">
							Filter
						</label>
						<Filter
							filterTerm={this.filter.bind(this)}
							onChange={event => this.addTag(event.target.value)}
						/>
					</div>
				</div>
				<div className="awning" id="awning-log">
					<p className="awning-title">
						<FontAwesomeIcon className="awning-icon" icon={faChartArea} />
						LOGS
					</p>
					<div className="meta-data">
						<p className="meta-data-item">
							Start: {this.formatDate(this.state.startDate)}
							{", "}
							{this.state.startTime}
						</p>
						<p className="meta-data-item">
							End: {this.formatDate(this.state.endDate)}
							{", "}
							{this.state.endTime}
						</p>
						<p className="meta-data-item">
							Status:{" "}
							<span className={this.state.status === "Done" ? "done" : "loading"}>
								{this.state.status}
							</span>
						</p>
						<p className="meta-data-item">
							Total: <span className="total">{logs.length}</span>
						</p>
						<p className="meta-data-item">
							Filtered By: <span className="tags">{this.state.tags.join(", ")}</span>
						</p>
					</div>
				</div>
				<div className="legs-window windows">
					<table className="main-legs">
						<thead>
							<tr className="table-header">
								<th>Index</th>
								<th>Direction</th>
								<th>From</th>
								<th>To</th>
								<th>Disposition</th>
								<th>Time</th>
								<th>Duration</th>
							</tr>
						</thead>
						<MainLegs logs={logs} />
					</table>
				</div>
			</div>
		);
	}
}
