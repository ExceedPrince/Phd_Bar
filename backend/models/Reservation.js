const mongoose = require('mongoose');
const ReservationSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
	},
	date: {
		type: String,
		required: true
	},
	time: {
		type: String,
		required: true
	},
	guests: {
		type: Number,
		required: true
	},
	isValiated: {
		type: Boolean,
		required: true
	},
	code: {
		type: String,
		required: true
	},
	createdDate: {
		type: Date,
		default: Date.now
	}
})

module.exports = Reservation = mongoose.model('reservation', ReservationSchema);