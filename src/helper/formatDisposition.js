//const axios = require('axios');
const formatDisposition = (caller = "", cause) => {
	//console.log("FORMAT HELPER METHOD RUN");
	//let device = axios.get('/legs', () => {});
	//let device;
	let disposition = cause;
	//let disposition;
	switch (cause) {
		case "NORMAL_CLEARING":
			//disposition = `${caller} picked up`; //on ${device}`;
			disposition = `Callee picked up`;
			break;
		case "ORIGINATOR_CANCEL":
			disposition = `Caller hung up`;
			break;
		case "NO_ANSWER":
			disposition = `Missed call`;
			break;
		case "NO_ROUTE_DESTINATION":
			disposition = `No call route`;
			break;
		case "LOSE_RACE":
			disposition = `Did not pick up`;
			break;
		case "UNALLOCATED_NUMBER":
			disposition = `Number not assigned to a user|provider`;
			break;
		case "PROGRESS_TIMEOUT":
			disposition = `Call timed out`;
			break;
		case "PICKED_OFF":
			disposition = `Picked up at another extension`;
			break;
		case "NO_USER_RESPONSE":
			disposition = `Timed out`;
			break;
		case "USER_BUSY":
			disposition = `Callee busy`;
			break;
		case "ATTENDED_TRANSFER":
			disposition = `Attended transfer`;
			break;
		case "NORMAL_TEMPORARY_FAILURE":
			disposition = `Connecting call`;
			break;
		case "NORMAL_UNSPECIFIED":
			disposition = `Temporary unavailable`;
			break;
		case "INVALID_NUMBER_FORMAT":
			disposition = `Wrong number format`;
			break;
		default:
			console.log(disposition);
			//disposition = "Routing call";
			return;
	}
	return disposition;
};

export default formatDisposition;
