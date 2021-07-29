const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');
const { body, validationResult } = require('express-validator');
const sgMail = require('@sendgrid/mail');
const bcrypt = require("bcryptjs");
const { newPAssEmail } = require('../../utils/sendGridEmails');

const User = require('../../models/User');
const Reservation = require('../../models/Reservation');
const Opening = require('../../models/Opening');

//Connect to SendGrid
require('dotenv').config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


//GET - GET /api/admin/auth
//GET - Get the loaded admin user
//private
router.get('/auth', auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select('-password');
		res.json(user);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

//POST - POST /api/admin/login
//POST - Admin login route
//Public
router.post('/login', [
	body('email', 'Írjon be valós email címet!').isEmail(),
	body('password', 'Jelszó szükséges!').exists()
], async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() }); // bad request
	}

	const { email, password } = req.body;

	let user = await User.findOne({ email });

	if (!user) {
		return res.status(400).json({ errors: [{ msg: 'Hibás azonosítás' }] });
	}

	if (!user.isAdmin) {
		return res.status(400).json({ errors: [{ msg: 'Érvénytelen felhasználó' }] });
	}

	// comparing plain text password with password from db
	const isMatch = await bcrypt.compare(password, user.password);

	if (!isMatch) {
		return res.status(400).json({ errors: [{ msg: 'Hibás azonosítás' }] });
	}

	const payload = {
		user: {
			id: user.id
		}
	};

	jwt.sign(
		payload,
		process.env.JWTSECRET,
		{ expiresIn: '5 days' },
		(err, token) => {
			if (err) throw err;

			res.json({ token });
		}
	);

});

//POST - POST /api/admin/newpass
//POST - Post admin's email if it's correct
//Public
router.post('/newpass', [
	body('email', 'Adjon meg email címet!').not().isEmpty().isEmail()
], async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() }); // bad request
	};

	const { email } = req.body;

	const user = await User.findOne({ email: email });

	if (!user) {
		return res.status(400).json({ errors: [{ msg: 'Helytelen email címet adott meg!' }] });
	} else {
		const code = Math.floor(Math.random() * 16777215).toString(16);
		const newPass = Math.floor(Math.random() * 16777215).toString(16);

		const date = new Date().getTime();

		await sgMail.send(newPAssEmail(user.email, code, date, newPass));

		user.isAdmin = false;
		user.code = code;

		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(newPass, salt);

		await user.save();

		res.json('Új jelszavát és megerősítő kódját elküldtük az Admin email címre!');
	}

});

//POST - POST /api/admin/validatepass
//POST - Post admin's email if it's correct
//Public
router.post('/validatepass', [
	body('email', 'Adjon meg email címet!').isEmail(),
	body('password', 'Nem adta meg az új jelszavát').exists(),
	body('code', 'A kód hossza legalább 6 karakter kell, hogy legyen!').isLength({ min: 6 }),
	body('time', 'Nincs kérvényezési idő!').exists()
], async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() }); // bad request
	};

	const { email, password, code, time } = req.body;

	const user = await User.findOne({ email: email });

	// if no user found
	if (!user) {
		return res.status(400).json({ errors: [{ msg: 'Azonosítási probléma lépett fel!' }] });
	};

	// comparing plain text password with password from db
	const isMatch = await bcrypt.compare(password, user.password);

	if (!isMatch) {
		return res.status(400).json({ errors: [{ msg: 'Azonosítási probléma lépett fel!' }] });
	};

	// comparing validation code
	if (user.code !== code) {
		return res.status(400).json({ errors: [{ msg: 'Azonosítási probléma lépett fel!' }] });
	};

	// comparing the validation intervall
	if (new Date().getTime() > (Number(time) + 300000)) {
		return res.status(400).json({ errors: [{ msg: 'Lejárt a módosítási idő! Kérjen új jelszót!' }] });
	};

	user.isAdmin = true;

	await user.save();

	res.json('Módosítás sikeresen végrehajtva! Visszairányítás után lépjen be új jelszavával!');
});

//GET - GET /api/admin/reservations
//GET - Get reservations uncensored for admin
//private
router.get('/reservations', auth, async (req, res) => {
	const reservations = await Reservation.find().sort({ date: -1 }).sort({ time: -1 });
	res.json(reservations);
});

//GET - GET /api/admin/reservations/:id
//GET - Get reservations uncensored for admin
//private
router.get('/reservations/:id', auth, async (req, res) => {
	const reservations = await Reservation.findOne({ _id: req.params.id });
	res.json(reservations);
});

//PUT - PUT /api/admin/reservations/:id
//PUT - Change the values of a certain reservation
//private
router.put('/reservations/', [
	body('id', 'Nincs azonosító!').exists(),
	body('name', 'A név legalább 5 karakterből kell, hogy álljon!').notEmpty().isLength({ min: 5 }),
	body('email', 'Valós email formátumot adjon meg!').notEmpty().isEmail(),
	body('guests', '1 és 10 között adjon meg számot!').notEmpty().isFloat({ min: 1, max: 10 }),
], auth, async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { id, name, email, date, time, guests, isValiated, code } = req.body;

	//check updated date

	if (date.search(/[^0-9,-]/) !== -1) {
		return res.status(400).json({ errors: [{ msg: 'Dátum formátum nem megfelelő! (YYYY-MM-DD)' }] });
	}
	if (new Date().getTime() > new Date(date).getTime()) {
		return res.status(400).json({ errors: [{ msg: 'Elmúlt napra nem lehet módosítani!' }] });
	}

	const dayIndex = new Date(date).getDay();

	const choosenDay = await Opening.findOne({ index: dayIndex });

	if (dayIndex === 0) {
		return res.status(400).json({ errors: [{ msg: 'Vasárnapra nem lehet módosítani' }] });
	}
	if (choosenDay.open === null || choosenDay.close === null) {
		return res.status(400).json({ errors: [{ msg: 'Zárt napra nem lehet módosítani' }] });
	}

	//check updated time
	if (time.search(/[^0-9,:]/) !== -1) {
		return res.status(400).json({ errors: [{ msg: 'Időpont formátuma nem megfelelő! (HH:MM)' }] });
	}
	if (choosenDay.open[0] > +time.split(':')[0]) {
		return res.status(400).json({ errors: [{ msg: 'Nyitás előttre nem lehet módosítani' }] });
	}
	if (+time.split(':')[0] >= choosenDay.close[0] - 1) {
		return res.status(400).json({ errors: [{ msg: 'Záróra előtti 1 órán belül és utánra sem lehet módosítani' }] });
	}

	//check validation
	if (isValiated.toLowerCase() !== "true" && isValiated.toLowerCase() !== "false") {
		return res.status(400).json({ errors: [{ msg: 'A státusz csak "true" vagy "false" lehet!' }] });
	}

	try {
		let chosen = await Reservation.findOne({ _id: id });

		if (!chosen) {
			return res.status(400).json({ errors: [{ msg: 'Hibás azonosító' }] });
		};

		const reservationFields = {};
		reservationFields.name = name;
		reservationFields.email = email;
		reservationFields.date = date;
		reservationFields.time = time;
		reservationFields.guests = guests;
		if (isValiated === "true") {
			reservationFields.isValiated = true;
		} else {
			reservationFields.isValiated = false;
		};
		reservationFields.code = code;


		if (chosen) {
			// Update
			chosen = await Reservation.findOneAndUpdate(
				{ _id: id },
				{ $set: reservationFields },
				{ new: true, upsert: true }
			);
			/* console.log(reservationFields) */
			res.json('Asztalfoglalás sikeresen módosítva');
		}
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

//DELETE - DELETE /api/admin/reservations/:id
//DELETE - Delete a reservation by id
//private
router.delete('/reservations/:id', auth, async (req, res) => {
	const reservation = await Reservation.findOne({ _id: req.params.id });

	if (!reservation) {
		return res.status(400).json({ errors: [{ msg: 'Hiba a törlés során!' }] });
	}

	await Reservation.findOneAndRemove({ _id: req.params.id });

	const newReservations = await Reservation.find().sort({ date: -1 }).sort({ time: -1 });;

	res.json(newReservations);
});

//GET - GET /api/admin/openings/:id
//GET - Get reservations uncensored for admin
//private
router.get('/openings/:id', auth, async (req, res) => {
	const open = await Opening.findOne({ _id: req.params.id });

	if (!open) {
		return res.status(400).json({ errors: [{ msg: 'Hibás azonosító' }] });
	}

	res.json(open);
});

//PUT - PUT /api/admin/openings/
//PUT - Admin can change the opening hours
//private
router.put('/openings', [
	body('opening', '0 és 23 között adjon meg számot!').notEmpty().isFloat({ min: 0, max: 23 }),
	body('closing', '0 és 23 között adjon meg számot!').notEmpty().isFloat({ min: 0, max: 23 }),
	body('id', 'Nincs azonosító!').exists()
], auth, async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { opening, closing, id } = req.body;

	try {
		let chosen = await Opening.findOne({ _id: id });

		if (!chosen) {
			return res.status(400).json({ errors: [{ msg: 'Hibás azonosító' }] });
		};

		if ((opening === closing) && (opening === 0 && closing === 0)) {
			console.log('passed')
		}
		else if ((opening >= closing) && (opening !== 0 && closing !== 0)) {
			return res.status(400).json({ errors: [{ msg: 'Záróra nem lehet korábban, mint a nyitó óra!' }] });
		} else if ((opening >= closing) && (opening === 0 || closing === 0)) {
			return res.status(400).json({ errors: [{ msg: 'Záróra nem lehet korábban, mint a nyitó óra!' }] });
		};

		const openingFields = {};
		openingFields.index = chosen.index;
		openingFields.day = chosen.day;
		if (opening && opening !== 0) {
			openingFields.open = [opening, 0]
		} else {
			openingFields.open = null;
		};
		if (closing && closing !== 0) {
			openingFields.close = [closing, 0]
		} else {
			openingFields.close = null;
		};

		if (chosen) {
			// Update
			chosen = await Opening.findOneAndUpdate(
				{ _id: id },
				{ $set: openingFields },
				{ new: true }
			);
			res.json('Nyitvatartás sikeresen módosítva');
		}
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

module.exports = router;