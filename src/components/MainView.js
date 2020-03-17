import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import {
	faChartArea,
	faArrowCircleLeft,
	faArrowCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import MainLegs from "../components/MainLegs";
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
		isDisabled: true,
		startTime: "1584024046",
		endTime: "1584024046",
		status: "Idle",
		filter: false,
		pressed: false,
	};

	temps = {};

	componentDidMount() {
		this.getUsers();
	}

	defaultCall() {
		const start = new Date();
		start.setHours(0, 0, 0, 0);
		const end = new Date();
		end.setHours(23, 59, 59, 999);
		const base = 62167219200;
		const created_from = parseInt(start.getTime() / 1000 + base);
		const created_to = parseInt(end.getTime() / 1000 + base);

		axios.post("/default", { created_from, created_to }).then(res => {
			let { logs } = res.data;

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
			if (res.data.next_key) {
				this.setState({ status: "Loading" });
				this.nextKeyCallDefault(created_from, created_to, res.data.next_key);
			} else {
				this.setState({
					logs: prettyData,
					nextLogs: prettyData,
					startTime: created_from,
					endTime: created_to,
					status: "Done",
				});
			}
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
		filter = filter.split(" ").pop();
		filter = `EXT ${filter}`;
		if (filter && direction === "Outbound") {
			const result = [];
			this.state.logs.forEach(call => {
				const caller = call.caller_id_number;
				if (filter === caller) {
					result.push(call);
				}
			});
			this.setState({ viewable: result });
		}
	}

	selectDropdown(selection, direction = "Outbound") {
		if (
			selection === "All Users" ||
			selection === "All Numbers" ||
			selection === "All Directions"
		) {
			this.setState({ viewable: this.state.logs, tags: [] });
		} else {
			this.filter(selection, direction);
			this.setState({ user: selection, tags: [selection], filter: true });
		}
	}

	clear() {
		this.setState({ logs: [] }, () => {
			this.getData();
		});
	}

	getToday(event) {
		const base = 62167219200;

		const start = new Date();
		start.setHours(0, 0, 0, 0);
		const end = new Date();
		end.setHours(23, 59, 59, 999);

		const startMS = start.getTime();
		const endMS = end.getTime();
		const created_from = parseInt(startMS / 1000 + base);
		const created_to = parseInt(endMS / 1000 + base);

		this.setState({ startDate: start, endDate: end, tags: [], status: "Loading" });

		axios
			.post("/calls", {
				created_from,
				created_to,
			})
			.then(res => {
				let { next_key, logs } = res.data;
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

				if (next_key) {
					this.setState({ nextLogs: [...prettyData], status: "Loading" });
					this.nextKeyCall(created_from, created_to, next_key);
				} else if (this.state.default) {
					this.setState({
						logs: prettyData,
						filter: false,
						tags: [],
						isDisabled: true,
					});
				} else {
					this.setState({
						logs: prettyData,
						filter: false,
						tags: [],
						isDisabled: false,
					});
				}
			});
	}

	search(event) {
		const four_hours = 14400;
		const base = 62167219200;
		const startMS = this.state.startDate.getTime();
		const endMS = this.state.endDate.getTime();
		const created_from = parseInt((startMS - four_hours) / 1000 + base);
		const created_to = parseInt((endMS - four_hours) / 1000 + base);

		this.setState({ status: "Loading", tags: [] });

		axios
			.post("/calls", {
				created_from,
				created_to,
			})
			.then(res => {
				let { next_key, logs } = res.data;
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

				if (next_key) {
					this.setState({ nextLogs: [...prettyData], status: "Loading" });
					this.nextKeyCall(created_from, created_to, next_key);
				} else if (this.state.default) {
					this.setState({
						logs: prettyData,
						filter: false,
						tags: [],
						isDisabled: true,
					});
				} else {
					this.setState({
						logs: prettyData,
						filter: false,
						tags: [],
						isDisabled: false,
					});
				}
			})
			.catch(err => {
				if (err) {
					this.defaultCall();
				}
			});
	}

	nextKeyCallDefault(created_from, created_to, next_key) {
		axios
			.post("/next", {
				created_from,
				created_to,
				next_key,
			})
			.then(res => {
				let { logs } = res.data;

				if (logs.length > 100) {
					logs = logs.slice(-100);
				} else if (!logs.length) {
					this.setState({
						logs: [...this.state.nextLogs],
						status: "Done",
						filter: false,
						isDisabled: true,
						pressed: false,
					});
					return;
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
					this.nextKeyCallDefault(created_from, created_to, res.data.next_key);
				} else {
					this.setState({
						logs: [...this.state.nextLogs],
						status: "Done",
						filter: false,
						isDisabled: true,
						pressed: false,
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
				let { logs } = res.data;
				if (logs.length > 100) {
					logs = logs.slice(-100);
				} else if (!logs.length) {
					this.setState({
						logs: [...this.state.nextLogs],
						status: "Done",
						filter: false,
						isDisabled: true,
						pressed: false,
					});
					return;
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
						pressed: false,
					});
				}
			});
	}

	reset() {
		this.search();
		this.setState({ isDisabled: true, startDate: new Date(), endDate: new Date() });
	}

	startDate(date) {
		this.setState({ startDate: date });
	}

	endDate(date) {
		this.setState({ endDate: date });
	}

	getCallLogs(logs) {
		this.setState({ logs });
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

	restart() {
		this.setState({ filter: false, isDisabled: true, tags: [] });
	}

	showFilter() {
		this.setState({ isDisabled: false });
	}

	clearButton() {
		this.setState({ isDisabled: true, filter: false, viewable: this.state.logs, tags: [] });
	}

	render() {
		let logs = this.state.filter ? this.state.viewable : this.state.logs;
		const disableButton = this.state.status === "Loading" ? true : false;
		const tags = this.state.filter ? (
			<p className="meta-data-item">
				Filtered By: <span className="tags">{this.state.tags.join(", ")}</span>
			</p>
		) : (
			""
		);
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
						<button
							className="filter-button date-range-button"
							onClick={event => this.search(event)}
							disabled={disableButton}>
							SEARCH
						</button>
					</div>
					<DropDown
						id={"select-user"}
						selection={this.selectDropdown.bind(this)}
						title="Select User"
						data={this.state.users}
						last="All Users"
						disabled={disableButton}
					/>
					<div className="filter-button-container">
						<button
							disabled={disableButton}
							className="filter-button"
							onClick={() => this.clearButton()}>
							REMOVE FILTER
						</button>
					</div>
				</div>

				<div className="awning" id="awning-log">
					<p className="awning-title">
						<FontAwesomeIcon className="awning-icon" icon={faChartArea} />
						LOGS
					</p>
					<div className="meta-data">
						<p className="meta-data-item">
							Start:{" "}
							<span className="total">{this.formatDate(this.state.startDate)}</span>
						</p>
						<p className="meta-data-item">
							End:{" "}
							<span className="total">{this.formatDate(this.state.endDate)}</span>
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
						{tags}
					</div>
				</div>
				<div className="legs-window windows">
					<table className="main-legs">
						<thead>
							<tr className="table-header">
								<th className="head">Direction</th>
								<th className="head">From</th>
								<th className="head">To</th>
								<th className="head">Disposition</th>
								<th className="head">Datetime</th>
								<th className="head">Duration</th>
							</tr>
						</thead>
						<MainLegs logs={logs} />
					</table>
				</div>
			</div>
		);
	}
}
