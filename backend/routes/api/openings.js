const express = require('express');
const router = express.Router();

const Opening = require('../../models/Opening');

//GET - GET /api/openings
//GET - Get opening hours
//Public
router.get('/', async (req, res) => {
	const openings = await Opening.find();
	res.json(openings);
});

module.exports = router;