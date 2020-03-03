import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { faArrowCircleRight } from "@fortawesome/free-solid-svg-icons";

export default class MainLegs extends Component {
	state = {
		logs: [],
	};

	static getDerivedStateFromProps(nextProps, prevState) {
		return nextProps;
	}

	icon(direction) {
		/* DIRECTION NEEDS TO BE DETERMINED BEFORE HERE */
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

	render() {
		return (
			<tbody>
				{this.state.logs.map((call, index) => {
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
					return (
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
						</tr>
					);
				})}
			</tbody>
		);
	}
}
