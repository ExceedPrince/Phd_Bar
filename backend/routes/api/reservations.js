const express = require('express');
const router = express.Router();
const sgMail = require('@sendgrid/mail');
const { body, validationResult } = require('express-validator');
const secretEmail = require('../../utils/secretEmail');
const timeZoneTime = require('../../utils/timeZoneTime');
const { validationEmail, successEmail } = require('../../utils/sendGridEmails');

const Reservation = require('../../models/Reservation');

//Connect to SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

//GET - GET /api/reservations
//GET - Get array of reservations
//Public
router.get('/', async (req, res) => {
	const reservations = await Reservation.find({ isValiated: true });

	if (!reservations) {
		return res.send(null);
	}

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
	const reservations = await Reservation.find({ isValiated: true });

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
router.post('/', [
	body('name', 'Legalább 5 karaktert írjon be!').isLength({ min: 5 }),
	body('email', 'Adjon meg valós email címet!').isEmail(),
	body('guests', '1 és 10 között válasszon helyet!').isLength({ min: 1, max: 10 }),
	body('date', 'Válasszon másik dátumot!').not().isEmpty(),
	body('time', 'Válasszon másik időpontot!').not().isEmpty()
], async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() }); // bad request
	};

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
		res.send([false, "Ön már foglalt nálunk erre a napra!"]);
	} else {
		const isValiated = false;
		const code = Math.floor(Math.random() * 16777215).toString(16);

		const newReservation = new Reservation({ name, email, date, time, guests, isValiated, code });

		await newReservation.save();

		await sgMail.send(validationEmail(email, name, code, date));

		res.send([true, "Köszönjük! Rendelését erősítse meg az elküldött email üzenetben!"]);
	}
});

//POST - POST /api/reservations/validate/
//POST - Validate a reservation
//Public
router.post('/validate/', [
	body('email', 'Adjon meg valós email címet!').isEmail(),
	body('validation', 'Adja meg a megerősítő kódját!').not().isEmpty()
], async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() }); // bad request
	};

	const { email, validation, reservDate, date } = req.body;

	const user = await Reservation.findOne({ email: email, date: reservDate });

	if (!user) {
		return res.status(400).json({ errors: [{ msg: 'Ezzel a címmel nincs erre a napra érvényesítendő foglalás!' }] });
	};

	if (new Date(date).getTime() < new Date(user.createdDate).getTime() + 300000 && user.code === validation) {
		user.isValiated = true;

		await user.save();

		await sgMail.send(successEmail(user.email, user.name, user.date, user.time, user.guests));

		res.json([true, 'Foglalását sikeresen megerősítette, visszairányítjuk a főoldalra!']);
	} else {
		await Reservation.findByIdAndDelete(user._id);

		res.json([false, 'Hibás megerősítés miatt foglalását töröltük, visszairányítjuk a főoldalra!']);
	}
});

module.exports = router;