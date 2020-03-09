import React from "react";

const DropDown = ({ data, title, last, selection, auto, id }) => {
	return (
		<div className="dropdown-container">
			<div className="dropdown-title-container">
				<label htmlFor={title} className="dropdown-title" id={id}>
					{title}
				</label>
			</div>

			<select id={title} onChange={event => selection(event.target.value)}>
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
