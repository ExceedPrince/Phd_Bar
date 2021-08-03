const mongoose = require('mongoose');
const DrinkSchema = new mongoose.Schema({
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
		type: String,
		default: null
	},
	allergens: {
		type: String,
		default: null
	},
	date: {
		type: Date,
		default: Date.now
	}
})

module.exports = Drink = mongoose.model('drink', DrinkSchema);