//import formatPhoneNumber from "./formatPhoneNumber";

const formatCallee = (callee, to, request) => {
	//console.log("CALLEE IS THIS:", callee);
	//console.log(callee);
	//console.log("TO:", to);
	let formattedCallee;

	if (callee === undefined) {
		const c = request.split("@")[0];
		//console.log("WHAT IS LENGTH?", c.length);
		if (c.length === 12) {
			// +19544141212
			const phoneNumber = `(${c[2]}${c[3]}${c[4]}) ${c[5]}${c[6]}${c[7]} - ${c[8]}${c[9]}${
				c[10]
			}${c[11]}`;
			//console.log("PHONE NUMBER", phoneNumber);
			//return phoneNumber;
			formattedCallee = phoneNumber;
		} else if (c.length === 4) {
			// 1001
			const c = request.split("@")[0];
			const phoneNumber = `EXT ${c}`;
			formattedCallee = phoneNumber;
			//console.log("formattedCallee", formattedCallee);
			//return formattedCallee;
		} else if (c.length === 10) {
			const d = c.split("");
			formattedCallee = `(${d[0]}${d[1]}${d[2]}) ${d[3]}${d[4]}${d[5]} - ${d[6]}${d[7]}${
				d[8]
			}${d[9]}`;
			// console.log("WHAT IS CALLEE", c);
			// conference
			// console.log("C:", c);
			// const titleCase = c[0].toUpperCase + c.slice(1);
			// return titleCase;
			// console.log("* C IS", formattedCallee);
			// return formattedCallee;
		}
		//callee = phoneNumber;
		//callee = to;
		//} else if (callee === undefined) { // ????? never runs
		//callee = "UNKNOWN CALLEE?????";
		//return callee;
	} else {
		/*
		 * Callee === name   ||
		 * Callee === number ||
		 * Callee === ext
		 */
		console.log("CALLEE EXISTS", callee);
		//console.log("TO", to);
		//console.log("REQUEST", request);
		//console.log("CALLEE IS NOT UNDEFINED:", callee);
		//const isNumber = callee.split("@");
		//callee = isNumber;

		/*isNumber.map(digit => {
			//console.log("DIGIT IS:", digit);
			if (typeof digit === "number") return false;
			return true;
		});*/

		//CHECK FOR NUMBER OR STRING
		//NUMBER FORMAT TO (123) 456-7890
		//console.log("CALLEE", callee);//NAME
		//console.log("TO", to); //SIP URL
		//console.log("REQUEST", request); //IP ADDRESS && SIP URL

		return callee;
	}
	//console.log("DEFAULT RETURN", to);
	//return to;
	//console.log("DEFAULT:", request);
	//return request;
	// TEMP
	//formattedCallee = request;
	return formattedCallee;
};

export default formatCallee;
