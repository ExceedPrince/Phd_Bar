const express = require('express');
const router = express.Router();

const Opening = require('../../models/Opening');

//GET - GET /api/openings
//GET - Get opening hours
//Public
router.get('/', async (req, res) => {
	const openings = await Opening.find().sort({ _id: 1 });
	res.json(openings);
});

module.exports = router;