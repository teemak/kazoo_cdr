import React, { Component, Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import {
	faChartArea,
	faArrowCircleLeft,
	faArrowCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import MainLegs from "../components/MainLegs";
//import Filter from "../components/Filter";
import CustomDate from "../components/CustomDate";
import DropDown from "../components/Dropdown";
import axios from "axios";
import formatPhoneNumber from "../helper/formatPhoneNumber";
import formatDirection from "../helper/formatDirection";
import formatDisposition from "../helper/formatDisposition";
//import Moment from "react-moment";

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
		isDisabled: true,
		startTime: "1584024046",
		endTime: "1584024046",
		status: "Done",
		filter: false,
	};

	temps = {};

	componentDidMount() {
		this.getUsers();
		//this.getNumbers();
		this.defaultCall();
		//this.getTime(1);
	}

	/*getTime(first) {
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
	}*/

	defaultCall() {
		//console.log("DEFAULT CALL RUN");
		const start = new Date();
		start.setHours(0, 0, 0, 0);
		const end = new Date();
		end.setHours(23, 59, 59, 999);
		const base = 62167219200;
		const created_from = parseInt(start.getTime() / 1000 + base);
		const created_to = parseInt(end.getTime() / 1000 + base);

		axios.post("/default", { created_from, created_to }).then(res => {
			let { logs } = res.data;

			const prettyData = logs.map(call => {
				call.direction = formatDirection(call.caller_id_number);
				call.caller_id_number = formatPhoneNumber(call.caller_id_number);
				call.dialed_number = formatPhoneNumber(call.callee_id_number);
				call.hangup_cause = formatDisposition(call.callee_id_name, call.hangup_cause);
				return call;
			});
			if (res.data.next_key) {
				this.setState({ status: "Loading" });
				this.nextKeyCallDefault(created_from, created_to, res.data.next_key);
			}
			this.setState({
				logs: prettyData,
				nextLogs: prettyData,
				startTime: start.getTime(),
				endTime: end.getTime(),
			});
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

	filter(filter, direction) {
		//console.log("FILTER ACTIVE");
		filter = filter.split(" ").pop();
		filter = `EXT ${filter}`;
		//console.log("STATE.TAGS", this.state.tags);
		//console.log("SIMPLE FILTER");
		if (filter && direction === "Outbound") {
			const result = [];
			//console.log("LOGS TO FILTER", this.state.logs);
			this.state.logs.forEach(call => {
				const caller = call.caller_id_number;
				//const callee = call.callee_id_number;

				if (filter === caller) {
					//console.log("MATCH");
					result.push(call);
					//console.log("LOGS", result);
				}
			});
			this.setState({ viewable: result });
			//console.log("STATE:", this.state);
		}

		/*this.state.logs.forEach(call => {
				const row = Object.values(call)
					.flat()
					.join("");
				const match = row.includes(filter);
				if (match) result.push(call);
			});
			this.setState({ viewable: result, filter: true });
		} else if (this.state.filter) {
			//console.log("COMPOUND FILTER");
			const result = [];
			this.state.viewable.forEach(call => {
				const match = call.direction.includes(filter.toLowerCase());
				if (match) {
					console.log("MATCH");
					result.push(call);
				}
			});
			this.setState({ viewable: result, filter: true });*/
		//console.log("STATE.TAGS", this.state.tags);
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
	selectDropdown(selection, direction = "Outbound") {
		//console.log("STATE IN DROPDOWN", this.state);
		if (
			selection === "All Users" ||
			selection === "All Numbers" ||
			selection === "All Directions"
		) {
			//this.reset();
			this.setState({ viewable: this.state.logs, tags: [] });
		} else {
			//console.log("SELECTION", selection);
			this.filter(selection, direction);
			//const items = [this.state.tags.add(selection)];
			//this.setState({ user: selection, tags: [selection] });
			this.setState({ user: selection, tags: [selection], filter: true });
			//console.log("WHAT IS THE STATE:", this.state);
		}
	}

	clear() {
		/* SET STATE IS ASYNCHRONOUS */
		this.setState({ logs: [] }, () => {
			this.getData();
		});
	}

	search() {
		console.log("SEARCH RUN");
		// SHOULD RESET ALL THE VALUES IN THE DROPDOWN
		const startMS = this.state.startDate.getTime();
		const endMS = this.state.endDate.getTime();
		const base = 62167219200;

		const created_from = parseInt(startMS / 1000 + base);
		const created_to = parseInt(endMS / 1000 + base);

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
				console.log("SEARCH CACHE", logs.length);
				if (logs.length > 100) {
					logs = logs.slice(-100);
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
				} else if (this.state.default) {
					this.setState({ logs: prettyData, filter: false, tags: [], isDisabled: true });
				} else {
					this.setState({ logs: prettyData, filter: false, tags: [], isDisabled: false });
				}
			});
		//this.getTime();
		//console.log("STATE.DISABLED", this.state.isDisabled);
	}

	/* RECURSIVE SCOPING EXISTS */
	nextKeyCallDefault(created_from, created_to, next_key) {
		axios
			.post("/next", {
				created_from,
				created_to,
				next_key,
			})
			.then(res => {
				//console.log("WHAT IS THE RESPONSE OF NEXT KEY", res);
				//console.log("RES.DATA", res.data.logs.length);
				let { logs } = res.data;
				const prettyData = logs.map(call => {
					call.direction = formatDirection(call.caller_id_number);
					call.caller_id_number = formatPhoneNumber(call.caller_id_number);
					call.dialed_number = formatPhoneNumber(call.callee_id_number);
					call.hangup_cause = formatDisposition(call.callee_id_name, call.hangup_cause);
					return call;
				});
				/* ERROR HERE */
				//DUPLICATE KEYS

				//console.log("* BEFORE LOGS LENGTH", logs.length);
				/*if (logs.length > 100) {
					logs = logs.slice(-100);
					//last 100
					let a = this.state.nextLogs.slice(-100);
					//new 100
					let b = logs;
					console.log("A", a);
					console.log("B", b);
					// stringify a && b
					// COMPARE A === B
				}*/
				//console.log("* AFTER LOGS LENGTH", logs.length);

				this.setState({ nextLogs: [...this.state.nextLogs, ...prettyData] }, () =>
					this.setState({ logs: this.state.nextLogs }),
				);

				if (res.data.next_key) {
					this.nextKeyCallDefault(created_from, created_to, res.data.next_key);
				} else {
					this.setState({
						logs: [...this.state.nextLogs],
						status: "Done",
						filter: false,
						isDisabled: true,
					});
				}
			});
	}

	nextKeyCall(created_from, created_to, next_key) {
		axios
			.post("/next", {
				created_from,
				created_to,
				next_key,
			})
			.then(res => {
				//console.log("WHAT IS THE RESPONSE OF NEXT KEY", res);
				let { logs } = res.data;
				console.log("NEXT KEY CALL CACHE", logs.length);
				if (logs.length > 100) {
					logs = logs.slice(-100);
				}
				const prettyData = logs.map(call => {
					call.direction = formatDirection(call.caller_id_number);
					call.caller_id_number = formatPhoneNumber(call.caller_id_number);
					call.dialed_number = formatPhoneNumber(call.callee_id_number);
					call.hangup_cause = formatDisposition(call.callee_id_name, call.hangup_cause);
					return call;
				});

				this.setState({ nextLogs: [...this.state.nextLogs, ...prettyData] }, () =>
					this.setState({ logs: this.state.nextLogs }),
				);

				if (res.data.next_key) {
					this.nextKeyCall(created_from, created_to, res.data.next_key);
				} else {
					this.setState({
						logs: [...this.state.nextLogs],
						status: "Done",
						filter: false,
						isDisabled: false,
					});
				}
			});
	}

	reset() {
		this.search();
		//this.defaultCall();
		this.setState({ isDisabled: true, startDate: new Date(), endDate: new Date() });
	}

	startDate(date) {
		//console.log("WHAT IS DATE? argument", date);
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
		return calls;
	}

	formatDate(date) {
		const copy = date;
		const month = copy.getMonth();
		const day = date.getDate();
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
		return `${MONTHS[month]} ${day}`;
	}

	addTag(input) {
		console.log("WHAT IS THE VALUE", input);
	}

	restart() {
		//this.search();
		//this.defaultCall();
		this.setState({ filter: false, isDisabled: true, tags: [] });
	}

	showFilter() {
		this.setState({ isDisabled: false });
	}

	clearButton() {
		this.setState({ viewable: this.state.logs, tags: [] });
	}

	render() {
		//console.log("** STATE.IS_DISABLED **", this.state.isDisabled);

		const logs = this.state.filter ? this.state.viewable : this.state.logs;
		const disabled = (
			<Fragment>
				<DropDown
					id={"select-user"}
					selection={this.selectDropdown.bind(this)}
					title="Select User"
					data={this.state.users}
					last="All Users"
				/>
				{/*
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
				*/}
				<div className="filter-button-container">
					<button className="filter-button" onClick={() => this.clearButton()}>
						REMOVE FILTER
					</button>
					<button className="filter-button filter" onClick={() => this.restart()}>
						SELECT DATE RANGE
					</button>
				</div>
			</Fragment>
		);
		const disableButton = this.state.status === "Loading" ? true : false;
		const enabled = (
			<Fragment>
				<CustomDate
					{...this.state}
					changeStart={this.startDate.bind(this)}
					changeEnd={this.endDate.bind(this)}
				/>
				<div className="filter-button-container">
					<button
						className="filter-button"
						onClick={() => this.search()}
						disabled={disableButton}>
						SEARCH
					</button>
					<button
						className="filter-button filter"
						onClick={() => this.showFilter()}
						disabled={disableButton}>
						FILTER
					</button>
				</div>
			</Fragment>
		);
		//console.log("STATE.DISABLED", this.state.isDisabled);
		const isDisabled = this.state.isDisabled ? enabled : disabled;
		const tags = this.state.isDisabled ? (
			""
		) : (
			<p className="meta-data-item">
				Filtered By: <span className="tags">{this.state.tags.join(", ")}</span>
			</p>
		);
		//console.log("IS DISABLED", isDisabled);
		//console.log("WHAT IS LOGS?", logs);
		//console.log("STATE.FILTER", this.state.filter);
		return (
			<div>
				<div className="awning">
					<p className="awning-title">
						<FontAwesomeIcon className="awning-icon" icon={faFilter} />
						FILTERS
					</p>
				</div>

				<div className="filters-window windows">{isDisabled}</div>

				<div className="awning" id="awning-log">
					<p className="awning-title">
						<FontAwesomeIcon className="awning-icon" icon={faChartArea} />
						LOGS
					</p>
					<div className="meta-data">
						<p className="meta-data-item">
							Start: {this.formatDate(this.state.startDate)}
						</p>
						<p className="meta-data-item">End: {this.formatDate(this.state.endDate)}</p>
						<p className="meta-data-item">
							Status:{" "}
							<span className={this.state.status === "Done" ? "done" : "loading"}>
								{this.state.status}
							</span>
						</p>
						<p className="meta-data-item">
							Total: <span className="total">{logs.length}</span>
						</p>
						{tags}
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
