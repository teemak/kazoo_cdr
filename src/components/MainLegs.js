import React, { Component } from "react";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";

export default class MainLegs extends Component {
	render() {
		return (
			<div>
				<div className="awning">
					<p className="awning-title">
						<FontAwesomeIcon className="awning-icon" icon={faFilter} />
						FILTERS
					</p>
					<p>
						<FontAwesomeIcon className="caret" icon={faCaretRight} />
					</p>
				</div>
				<div className="filters-window windows">
					<ButtonGroup
						variant="contained"
						color="primary"
						aria-label="contained primary button group">
						<Button>Today</Button>
						<Button>Week</Button>
						<Button>Month</Button>
					</ButtonGroup>
					<Input placeholder="Filter By Caller, Duration, Number..." />
					<p>DATE TO</p>
					<Input placeholder="Start Date" />
					<p>DATE FROM</p>
					<Input placeholder="End Date" />
					<p>TIME START</p>
					<Input placeholder="9:00 AM" />
					<p>TIME END</p>
					<Input placeholder="5:00 PM" />
					<p>DIRECTION</p>
					<Input placeholder="Show Both" />
					<p>USERS</p>
					<Input placeholder="Show All" />
					<p>NUMBERS</p>
					<Input placeholder="Show All" />

					<Button>SEARCH</Button>
				</div>
				<div className="awning">
					<p>ICON</p>
					<p>LOGS</p>
					<p>NABLA</p>
				</div>
				<div className="legs-window windows">
					<table className="main-legs">
						<tr>
							<td>Direction</td>
							<td>From</td>
							<td>To</td>
							<td>Disposition</td>
							<td>Time</td>
							<td>Duration</td>
						</tr>
						<tr>
							<td>Incoming</td>
							<td>Tee Mak</td>
							<td>Voicemail</td>
							<td>Missed Call</td>
							<td>2/14/2020</td>
							<td>00:00:12</td>
						</tr>
						<tr>
							<td>Outgoing</td>
							<td>Vinix</td>
							<td>Tee Mak</td>
							<td>Answered on Tee's Desk Phone</td>
							<td>2/14/2020</td>
							<td>00:00:20</td>
						</tr>
					</table>
				</div>
			</div>
		);
	}
}
