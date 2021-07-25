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

//Connect to SendGrid
require('dotenv').config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


//GET - GET /api/admin/auth
//GET - Get the loaded admin user
//Public
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

//GET - GET /api/admin/openings
//GET - Get reservations uncensored for admin
//Public
router.get('/reservations', async (req, res) => {
	const reservations = await Reservation.find().sort({ date: -1 }).sort({ time: -1 });
	res.json(reservations);
});

module.exports = router;