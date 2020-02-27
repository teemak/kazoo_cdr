import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { faChartArea } from "@fortawesome/free-solid-svg-icons";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import MainLegs from "../components/MainLegs";
import Filter from "../components/Filter";
import CustomDate from "../components/CustomDate";
import axios from "axios";

export default class MainView extends Component {
	state = {
		logs: [],
		filter: "",
	};

	componentDidMount() {
		axios({
			method: "get",
			url: "/calls",
		}).then(res => {
			this.setState({ logs: res.data });
		});
	}

	filter(filter) {
		console.log("** FILTER METHOD RUN");
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
		axios({
			method: "get",
			url: "/calls",
		}).then(res => {
			this.setState({ logs: res.data });
		});
		console.log("STATE", this.state);
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
					<CustomDate />
					<Filter filterTerm={this.filter.bind(this)} />
					<button onClick={() => this.reset()}>RESET</button>
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
