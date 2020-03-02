import React from "react";

const DropDown = ({ data, title, last, selected }) => {
	//const [selection, setSelection] = useState("");
	/*console.log("THIS PROPS IS DATA:", data);
	console.log("WHAT IS TITLE:", title);
	console.log("WHAT IS LAST:", last);*/
	//console.log("SELECTION IS:", selection); // input's value
	return (
		<div>
			<label htmlFor={title}>{title}</label>
			<select id={title} onChange={event => selected(event.target.value)}>
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
