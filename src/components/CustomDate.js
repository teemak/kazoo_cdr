import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default class CustomDate extends Component {
	state = { startDate: this.props.startDate, endDate: this.props.endDate };

	changeStartDate(date) {
		this.setState({ startDate: date });
	}

	changeStartTime(time) {
		let date = this.state.startDate;
		date.setTime(time);
		this.setState({ startDate: date });
	}

	changeEndDate(date) {
		this.setState({ endDate: date });
	}

	changeEndTime(time) {
		let date = this.state.endDate;
		date.setTime(time);
		this.setState({ endDate: date });
	}

	render() {
		return (
			<div className="date-picker-container">
				<div className="start-date-container">
					<div>
						<p>Start Date</p>
						<DatePicker
							className="start-date"
							onChange={date => {
								this.changeStartDate(date);
								this.props.changeStart(date);
							}}
							selected={this.state.startDate}
						/>
						<p>Start Time</p>
						<DatePicker
							className="start-date"
							selected={this.state.startDate}
							onChange={date => {
								this.changeStartTime(date.getTime());
								this.props.changeStart(date);
							}}
							showTimeSelect
							showTimeSelectOnly
							timeIntervals={30}
							timeCaption="Time"
							dateFormat="h:mm aa"
						/>
					</div>
				</div>
				<div className="end-date-container">
					<div>
						<p>End Date</p>
						<DatePicker
							className="end-date"
							onChange={date => {
								this.changeEndDate(date);
								this.props.changeEnd(date);
							}}
							selected={this.state.endDate}
						/>
						<p>End Time</p>
						<DatePicker
							className="end-date"
							selected={this.state.endDate}
							onChange={date => {
								this.changeEndTime(date.getTime());
								this.props.changeEnd(date);
							}}
							showTimeSelect
							showTimeSelectOnly
							timeIntervals={30}
							timeCaption="Time"
							dateFormat="h:mm aa"
						/>
					</div>
				</div>
			</div>
		);
	}
}
