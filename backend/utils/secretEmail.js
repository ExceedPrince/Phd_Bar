//Make reservations' email address secreted
module.exports = function (reservations) {
	for (let i = 0; i < reservations.length; i++) {
		if (reservations[i].email.split('@')[0].length > 1) {
			reservations[i].email =
				reservations[i].email.split('@')[0][0] +
				reservations[i].email.split('@')[0].slice(1, reservations[i].email.split('@')[0].length - 1)
					.replace(/[a-z0-9]/g, '*').replace(/[&\/\\#,+()$~%.'":?<>{}]/g, '*') +
				reservations[i].email.split('@')[0][reservations[i].email.split('@')[0].length - 1] +
				"@" + reservations[i].email.split('@')[1];
		}
	}

	return reservations;
};