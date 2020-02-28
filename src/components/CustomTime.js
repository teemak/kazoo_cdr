import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CustomTime = () => {
	const [startTime, setStartTime] = useState(new Date());
	const [endTime, setEndTime] = useState(new Date());
	return (
		<div className="date-picker-container">
			<div>
				<p>Start Time</p>
				<DatePicker
					className="start-date"
					selected={startTime}
					onChange={date => setStartTime(date)}
					showTimeSelect
					showTimeSelectOnly
					timeIntervals={30}
					timeCaption="Time"
					dateFormat="h:mm aa"
				/>
			</div>
			<div>
				<p>End Time</p>
				<DatePicker
					className="end-date"
					selected={endTime}
					onChange={date => setEndTime(date)}
					showTimeSelect
					showTimeSelectOnly
					timeIntervals={30}
					timeCaption="Time"
					dateFormat="h:mm aa"
				/>
			</div>
		</div>
	);
};

export default CustomTime;
