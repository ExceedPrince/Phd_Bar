const express = require('express');
const router = express.Router();
const sgMail = require('@sendgrid/mail');
const { body, validationResult } = require('express-validator');
const secretEmail = require('../../utils/secretEmail');
const timeZoneTime = require('../../utils/timeZoneTime');
const { validationEmail, successEmail } = require('../../utils/sendGridEmails');

const Reservation = require('../../models/Reservation');
const Opening = require('../../models/Opening');

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
	body('name', 'Legal??bb 5 karaktert ??rjon be!').isLength({ min: 5 }),
	body('email', 'Adjon meg val??s email c??met!').isEmail(),
	body('guests', '1 ??s 10 k??z??tt v??lasszon helyet!').isFloat({ min: 1, max: 10 }),
	body('date', 'V??lasszon m??sik d??tumot!').not().isEmpty(),
	body('time', 'V??lasszon m??sik id??pontot!').not().isEmpty()
], async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() }); // bad request
	};

	const reservations = await Reservation.find();

	const { name, email, date, time, guests } = req.body;

	//Check if date is in the past
	if (new Date().getTime() > new Date(date).getTime()) {
		return res.status(400).json({ errors: [{ msg: 'Elm??lt napra nem lehet foglalni!' }] });
	}

	//Check if chosen day is closed
	const dayIndex = new Date(date).getDay();

	const choosenDay = await Opening.findOne({ index: dayIndex });

	if (dayIndex === 0) {
		return res.status(400).json({ errors: [{ msg: 'Vas??rnapra nem lehet foglalni' }] });
	}
	if (choosenDay.open === null || choosenDay.close === null) {
		return res.status(400).json({ errors: [{ msg: 'Z??rt napra nem lehet foglalni' }] });
	}

	//check if time is correct
	if (choosenDay.open[0] > +time.split(':')[0]) {
		return res.status(400).json({ errors: [{ msg: 'Nyit??s el??ttre nem lehet foglalni' }] });
	}
	if (+time.split(':')[0] >= choosenDay.close[0] - 1) {
		return res.status(400).json({ errors: [{ msg: 'Z??r??ra el??tti 1 ??r??n bel??l ??s ut??nra sem lehet foglalni' }] });
	}

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
		res.send([false, "??n m??r foglalt n??lunk erre a napra!"]);
	} else {
		const isValiated = false;
		const code = Math.floor(Math.random() * 16777215).toString(16);

		const newReservation = new Reservation({ name, email, date, time, guests, isValiated, code });

		await newReservation.save();

		await sgMail.send(validationEmail(email, name, code, date));

		res.send([true, "K??sz??nj??k! Rendel??s??t er??s??tse meg az elk??ld??tt email ??zenetben!"]);
	}
});

//POST - POST /api/reservations/validate/
//POST - Validate a reservation
//Public
router.post('/validate/', [
	body('email', 'Adjon meg val??s email c??met!').isEmail(),
	body('validation', 'Adja meg a meger??s??t?? k??dj??t!').not().isEmpty()
], async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() }); // bad request
	};

	const { email, validation, reservDate, date } = req.body;

	const user = await Reservation.findOne({ email: email, date: reservDate });

	if (!user) {
		return res.status(400).json({ errors: [{ msg: 'Ezzel a c??mmel nincs erre a napra ??rv??nyes??tend?? foglal??s!' }] });
	};

	if (new Date(date).getTime() < new Date(user.createdDate).getTime() + 300000 && user.code === validation) {
		user.isValiated = true;

		await user.save();

		await sgMail.send(successEmail(user.email, user.name, user.date, user.time, user.guests));

		res.json([true, 'Foglal??s??t sikeresen meger??s??tette, visszair??ny??tjuk a f??oldalra!']);
	} else {
		await Reservation.findByIdAndDelete(user._id);

		res.json([false, 'Hib??s meger??s??t??s miatt foglal??s??t t??r??lt??k, visszair??ny??tjuk a f??oldalra!']);
	}
});

module.exports = router;