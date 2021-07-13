const express = require('express');
const router = express.Router();
const secretEmail = require('../../utils/secretEmail');
const timeZoneTime = require('../../utils/timeZoneTime');
//express-validator itt fog kelleni a post request-nél!!!

const Reservation = require('../../models/Reservation');

//GET - GET /api/reservations
//GET - Get array of reservations
//Public
router.get('/', async (req, res) => {
	const reservations = await Reservation.find();

	await secretEmail(reservations);

	timeZoneTime();

	const todayFormat = timeZoneTime().toISOString().split('T')[0];

	const filtered = await reservations.filter(item => new Date(item.date).getTime() >= new Date(todayFormat).getTime());

	const sortedByMin = await filtered.sort((e, f) => +e.time.split(":")[1] - +f.time.split(":")[1]);
	const sortedByHour = await sortedByMin.sort((c, d) => +c.time.split(":")[0] - +d.time.split(":")[0]);
	const sortedByDay = await sortedByHour.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

	res.send(sortedByDay);
});

//GET - GET /api/reservations/:date
//GET - Get reservations by date
//Public
router.get('/:date', async (req, res) => {
	const reservations = await Reservation.find();

	await secretEmail(reservations);

	const selectedDay = await reservations.filter(el => el.date == req.params.date);
	if (selectedDay.length > 0) {
		const sortedByMin = await selectedDay.sort((e, f) => +e.time.split(":")[1] - +f.time.split(":")[1]);
		const sortedByHour = await sortedByMin.sort((c, d) => +c.time.split(":")[0] - +d.time.split(":")[0]);

		res.send(sortedByHour);
	} else {
		res.send(null);
	}
});

//POST - POST /api/reservations/
//POST - Post a new reservation
//Public
router.post('/', async (req, res) => {
	const reservations = await Reservation.find();

	const { name, email, date, time, guests } = req.body;

	//Collect all dates that this email user has in the database
	let dateArr = []
	await reservations.filter(person => person.email === email ? dateArr.push(person.date) : null);
	//Collect all email from database
	let array = [];
	await reservations.map(item => array.push(item.email));

	//Check if this user's email is in the collected email array
	const checkMails = (mail) => {
		return mail === email
	}
	//Check if this user's chosen date is in the collected date array
	const checkDates = (checkDate) => {
		return checkDate === date
	}

	if (array.some(checkMails) === true && dateArr.some(checkDates) === true) {
		res.send([false, "Ön már foglalt nálunk erre a napra!"])
	} else {
		const newReservation = new Reservation({ name, email, date, time, guests });

		await newReservation.save();

		res.send([true, "Foglalását rögzítettük"])
	}
});

module.exports = router;