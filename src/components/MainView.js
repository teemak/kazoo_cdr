import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { faChartArea } from "@fortawesome/free-solid-svg-icons";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import MainLegs from '../components/MainLegs';
import Filter from '../components/Filter';
import CustomDate from '../components/CustomDate';

export default class MainView extends Component {
	render() {
		return (
			<div>
				<div className="awning">
					<p className="awning-title">
						<FontAwesomeIcon className="awning-icon" icon={faFilter} />
						FILTERS
					</p>
					<p>
						<FontAwesomeIcon className="caret" icon={faCaretRight} size='3x'/>
					</p>
				</div>
				<div className="filters-window windows">
					<CustomDate />
					<Filter />
				</div>
				<div className="awning">
					<p className="awning-title">
						<FontAwesomeIcon className="awning-icon" icon={faChartArea} />
						LOGS
					</p>
					<p>
						<FontAwesomeIcon className="caret" icon={faCaretRight} size='3x'/>
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
						<MainLegs />
					</table>
				</div>
			</div>
		);
	}
}