import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default class CustomDate extends Component {
	state = {
		startDate: this.props.startDate,
		endDate: this.props.endDate,
		startTime: this.props.startDate.setHours(0, 0, 0, 0),
		endTime: this.props.endDate.getTime(),
	};

	changeStartDate(date) {
		this.setState({ startDate: date });
	}

	changeEndDate(date) {
		this.setState({ endDate: date });
	}

	changeStartTime(time) {
		let date = this.state.startDate;
		date.setTime(time);
		this.setState({ startDate: date });
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
						<p className="date-label">Start Date</p>
						<DatePicker
							className="start-date"
							onChange={date => {
								this.changeStartDate(date);
								this.props.changeStart(date);
							}}
							selected={this.state.startDate}
						/>
						<p className="date-label">Start Time</p>
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
						<p className="date-label">End Date</p>
						<DatePicker
							className="end-date"
							onChange={date => {
								this.changeEndDate(date);
								this.props.changeEnd(date);
							}}
							selected={this.state.endDate}
						/>
						<p className="date-label">End Time</p>
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
