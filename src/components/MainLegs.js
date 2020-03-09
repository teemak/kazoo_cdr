//import React from "react";
import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { faArrowCircleRight } from "@fortawesome/free-solid-svg-icons";

/* THIS IS WHERE THE INDEX OF ROWS IS DUPPED */
export default class MainLegs extends Component {
	constructor(props) {
		super(props);
		this.state = {
			logs: props.logs,
			timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
		};
	}

	icon = direction => {
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
	};

	formatDuration = duration => {
		let hours = ~~(duration / 3600);
		let minutes = ~~((duration % 3600) / 60);
		let seconds = duration % 60;

		if (hours < 10) {
			hours = `0${hours}`;
		}
		if (minutes < 10) {
			minutes = `0${minutes}`;
		}
		if (seconds < 10) {
			seconds = `0${seconds}`;
		}

		return `${hours}:${minutes}:${seconds}`;
	};

	formatDate = date => {
		let d = date.split("-");
		return `${d[1]}/${d[2]}/${d[0]}`;
	};

	twelveHourFormat = time => {
		let result;
		let militaryTime;
		//let hour = parseInt(time.split(" ")[1].split(":")[0], 10);
		let hour = time.split(":")[0];
		//console.log("WHAT IS HOUR", hour);

		if (hour <= this.state.timezone) {
			hour = hour + 12 + this.state.timezone;
		} else {
			hour = hour + this.state.timezone;
		}
		militaryTime = time.split(":");

		if (hour === 12) {
			result = `${hour}:${militaryTime[1]}:${militaryTime[2]} PM `;
		} else if (hour > 12) {
			result = `${hour - 12}:${militaryTime[1]}:${militaryTime[2]} PM `;
		} else {
			result = `${hour}:${militaryTime[1]}:${militaryTime[2]} AM `;
		}
		return result;
	};

	getTimeZone = timeZone => {
		let result;
		switch (timeZone) {
			case "America/New_York":
				result = -5;
				break;
			case "America/Chicago":
				result = -6;
				break;
			case "America/Denver":
				result = -7;
				break;
			case "America/Los_Angeles":
				result = -8;
				break;
			default:
				return;
		}
		//console.log("TIMEZONE:", result);
		return result;
	};

	render() {
		return (
			<tbody>
				{this.props.logs.map((call, index) => {
					const {
						id,
						direction,
						caller_id_name,
						caller_id_number,
						callee_id_name,
						dialed_number,
						hangup_cause,
						iso_8601,
						datetime,
						duration_seconds,
						//unix_timestamp,
					} = call;
					//const time = new Date(unix_timestamp * 1000);
					//console.log("**", time);
					//const date = this.formatDate(iso_8601);
					const time = datetime.split(" ");

					//console.log("TIME:", time);
					//console.log("ID:", id);
					//const set = new Set();
					//set.add(id);
					//console.log(set.
					return (
						<tr key={id}>
							<td>{index + 1}</td>
							<td>{this.icon(direction)}</td>
							<td>
								{caller_id_name}
								<p>{caller_id_number}</p>
							</td>
							<td>
								{callee_id_name}
								<p>{dialed_number}</p>
							</td>
							<td>{hangup_cause}</td>
							<td>
								{iso_8601}
								<p>{time[1]}</p>
							</td>
							<td>{this.formatDuration(duration_seconds)}</td>
						</tr>
					);
				})}
			</tbody>
		);
	}
}
