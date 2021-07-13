//Get the timezone
module.exports = function () {
	let ending = "";
	let offset = new Date().getTimezoneOffset();
	if (offset < 0) {
		ending = "GMT+00:00";
	} else {
		ending = "GMT-00:00";
	}

	let now = new Date().toString();
	let timeZone = " (" + now.replace(/.*[(](.*)[)].*/, '$1') + ")";
	let today = new Date().toString().replace(timeZone, "").slice(0, -8) + ending;

	return new Date(today);
};