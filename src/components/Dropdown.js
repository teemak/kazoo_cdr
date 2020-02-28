import React from "react";

const DropDown = ({ data, title, last }) => {
	//console.log("** PROPS: ", data);
	return (
		<div>
			<label htmlFor={title}>{title}</label>
			<select id={title}>
				{data.map((item, index) => {
					return (
						<option key={item + index} value={index}>
							{item}
						</option>
					);
				})}
				<option>{last}</option>
			</select>
		</div>
	);
};
/*
				<option value="1">Tee</option>
				<option value="2">Mark</option>
				<option value="3">Sean</option>
				<option value="4">Frank</option>
				<option value="5">Jared</option>
*/
export default DropDown;
