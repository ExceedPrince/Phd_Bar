const express = require('express');
const router = express.Router();

const Hamburger = require('../../models/Hamburger');
const Pizza = require('../../models/Pizza');
const Drink = require('../../models/Drink');

//GET - GET /api/menu/:type
//GET - Get all kind of menu types
//Public
router.get('/:type', async (req, res) => {
	switch (req.params.type) {
		case 'hamburgers':
			const hamburgers = await Hamburger.find();
			return res.json(hamburgers);
		case 'pizzas':
			const pizzas = await Pizza.find();
			return res.json(pizzas);
		case 'drinks':
			const drinks = await Drink.find();
			return res.json(drinks);
		default:
			return res.json(null);
	}
});

//GET - GET /api/menu/:type/:id
//GET - Get all items from menu by ID
//Public
router.get('/:type/:id', async (req, res) => {
	switch (req.params.type) {
		case 'hamburgers':
			const hamburger = await Hamburger.findOne({ id: req.params.id });
			return res.json(hamburger);
		case 'pizzas':
			const pizza = await Pizza.findOne({ id: req.params.id });
			return res.json(pizza);
		case 'drinks':
			const drink = await Drink.findOne({ id: req.params.id });
			return res.json(drink);
		default:
			return res.json(null);
	}
});

module.exports = router;