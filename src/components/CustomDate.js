import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CustomDate = () => {
	/* startDate:obj, setStartDate:fn() */
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(new Date());
	// SELECTED IS THE DATE OBJECT

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
