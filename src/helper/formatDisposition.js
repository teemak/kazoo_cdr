//const axios = require('axios');
const formatDisposition = (caller, cause) => {
	//console.log("FORMAT HELPER METHOD RUN");
	//let device = axios.get('/legs', () => {});
	//let device;
	let disposition;
	switch (cause) {
		case "NORMAL_CLEARING":
			disposition = `${caller} picked up`; //on ${device}`;
			break;
		case "ORIGINATOR_CANCEL":
			disposition = `${caller} hung up`;
			break;
		default:
			return;
	}
	return disposition;
};

export default formatDisposition;
