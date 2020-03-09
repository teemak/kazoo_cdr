const formatPhoneNumber = (number = "") => {
	let formattedNumber;
	if (number.length === 4) {
		formattedNumber = `EXT ${number}`;
	} else if (number.length === 12) {
		let c = number.split("");
		formattedNumber = `(${c[2]}${c[3]}${c[4]}) ${c[5]}${c[6]}${c[7]} - ${c[8]}${c[9]}${c[10]}${
			c[11]
		}`;
		//console.log("FORMATTED NUMBER:", formattedNumber); //CORRECT
	}
	return formattedNumber;
};

export default formatPhoneNumber;
