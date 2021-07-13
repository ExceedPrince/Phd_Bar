const mongoose = require('mongoose');
const OpeningSchema = new mongoose.Schema({
	index: {
		type: Number,
		required: true
	},
	day: {
		type: String,
		required: true,
	},
	open: {
		type: [Number] || null,
		default: null
	},
	close: {
		type: [Number] || null,
		default: null
	},
	date: {
		type: Date,
		default: Date.now
	}
})

module.exports = Opening = mongoose.model('opening', OpeningSchema);