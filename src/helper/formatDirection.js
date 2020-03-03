const formatDirection = (caller, callee) => {
	//console.log("CALLER", caller);
	//console.log("CALLEE", callee);
	//console.log("WHAT IS NUMBER", number);
	if (caller.length === 4) return "outbound";
	//if (callee.length === 4 && caller.length) return "inbound";
	return "inbound";
};

export default formatDirection;
