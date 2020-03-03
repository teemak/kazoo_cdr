import React from "react";

const DropDown = ({ data, title, last, selection, auto }) => {
	//console.log("DATA IS ", data);
	return (
		<div>
			<label htmlFor={title}>{title}</label>

			<select value={auto} id={title} onChange={event => selection(event.target.value)}>
				{data.map((item, index) => {
					return (
						<option key={item} value={item}>
							{item}
						</option>
					);
				})}
				<option>{last}</option>
			</select>
		</div>
	);
};

export default DropDown;
