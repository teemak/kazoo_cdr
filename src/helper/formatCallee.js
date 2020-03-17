const formatCallee = (callee, to, request) => {
	let formattedCallee;

	if (callee === undefined) {
		const c = request.split("@")[0];
		if (c.length === 12) {
			// +19544141212
			const phoneNumber = `(${c[2]}${c[3]}${c[4]}) ${c[5]}${c[6]}${c[7]} - ${c[8]}${c[9]}${
				c[10]
			}${c[11]}`;
			formattedCallee = phoneNumber;
		} else if (c.length === 4) {
			// 1001
			const c = request.split("@")[0];
			const phoneNumber = `EXT ${c}`;
			formattedCallee = phoneNumber;
		} else if (c.length === 10) {
			const d = c.split("");
			formattedCallee = `(${d[0]}${d[1]}${d[2]}) ${d[3]}${d[4]}${d[5]} - ${d[6]}${d[7]}${
				d[8]
			}${d[9]}`;
		} else {
			// Digits pressed by caller
			to = to.split("@");
			return to[0];
		}
	} else {
		return callee;
	}
	return formattedCallee;
};

export default formatCallee;
