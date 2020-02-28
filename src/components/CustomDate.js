import React, { useState } from "react";
import DatePicker from "react-datepicker";
//import React, { Component } from "react";
//import { DateRangePicker } from "react-date-range";
//import { addDays } from "date-fns";
//import "react-date-range/dist/styles.css";
//import "react-date-range/dist/theme/default.css";
import "react-datepicker/dist/react-datepicker.css";

const CustomDate = () => {
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(new Date());
	return (
		<div className="date-picker-container">
			<div>
				<p>Start Date</p>
				<DatePicker
					className="start-date"
					selected={startDate}
					onChange={date => setStartDate(date)}
				/>
			</div>
			<div>
				<p>End Date</p>
				<DatePicker
					className="end-date"
					selected={endDate}
					onChange={date => setEndDate(date)}
				/>
			</div>
		</div>
	);
};

export default CustomDate;

/*export default class CustomDate extends Component {
	state = {
		start: new Date(),
		end: addDays(new Date(), 7),
		key: "selection",
	};
	render() {
		return (
			<span className="custom-date">
				<div className="start-date">
					<DateRangePicker
						onChange={item => console.log(item)}
						showSelectionPreview={true}
						moveRangeOnFirstSelection={false}
						months={2}
						ranges={[this.state.start, this.state.end]}
						direction="horizontal"
					/>
				</div>
				<div className="end-date" />
			</span>
		);
	}
}*/
