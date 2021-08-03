const mongoose = require('mongoose');
const HamburgerSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	pic: {
		type: String,
		required: true,
		unique: true
	},
	picURL: {
		type: Object,
		required: true,
	},
	id: {
		type: Number,
		required: true
	},
	price: {
		type: Number,
		required: true
	},
	safe: {
		type: Boolean,
		required: true
	},
	ingredients: {
		type: [String],
		required: true
	},
	allergens: {
		type: [String],
		required: true
	},
	date: {
		type: Date,
		default: Date.now
	}
})

module.exports = Hamburger = mongoose.model('hamburger', HamburgerSchema);