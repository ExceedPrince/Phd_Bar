const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
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
const Pizza = require('../../models/Pizza');
const Hamburger = require('../../models/Hamburger');
const Drink = require('../../models/Drink');

//Connect to SendGrid
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

//GET - GET /api/admin/menu/:type/:id
//GET - Get unique menu item
//private
router.get('/menu/:type/:id', auth, async (req, res) => {

	switch (req.params.type) {
		case 'hamburgers':
			const hamburgers = await Hamburger.findOne({ _id: req.params.id });
			return res.json(hamburgers);
		case 'pizzas':
			const pizzas = await Pizza.findOne({ _id: req.params.id });
			return res.json(pizzas);
		case 'drinks':
			const drinks = await Drink.findOne({ _id: req.params.id });
			return res.json(drinks);
		default:
			return res.json(null);
	}
});

//POST - POST /api/admin/menu-filter
//POST - Get filtered menu items
//private
router.post('/menu-filter', auth, async (req, res) => {
	const { name, type } = req.body;

	switch (type) {
		case 'hamburgers':
			const hamburgers = await Hamburger.find({ "name": { "$regex": name, "$options": "i" } }).sort({ price: 1 });
			return res.json(hamburgers);
		case 'pizzas':
			const pizzas = await Pizza.find({ "name": { "$regex": name, "$options": "i" } }).sort({ price: 1 });
			return res.json(pizzas);
		case 'drinks':
			const drinks = await Drink.find({ "name": { "$regex": name, "$options": "i" } }).sort({ price: 1 });
			return res.json(drinks);
		default:
			return res.json(null);
	}
});

//POST - POST /api/admin/menu/:type/
//POST - Post a new menu item
//private
router.post('/menu/:type', auth, async (req, res) => {
	let { name, price, safe, id, ingredients, allergens } = req.body;

	//checking for errors
	if (name.length < 5) return res.status(400).json({ errors: [{ msg: 'Legalább 5 karaktert írjon be!' }] });
	if (+price < 90) return res.status(400).json({ errors: [{ msg: '90 Ft lehet a legolcsóbb ár!' }] });
	if (safe === '') return res.status(400).json({ errors: [{ msg: '"Mentes" mező kitöltése kötelező!' }] });
	if (id === '') return res.status(400).json({ errors: [{ msg: 'Azonosító megadása kötelező!' }] });
	if (ingredients.length === 0) return res.status(400).json({ errors: [{ msg: 'Adjon meg összetevő(ke)t!' }] });
	if (allergens.length === 0) return res.status(400).json({ errors: [{ msg: 'Adjon meg allergén(eke)t!' }] });
	if (!req.files) return res.status(400).json({ errors: [{ msg: 'Kép feltöltése kötelező!' }] });

	const { picture } = req.files;

	if (picture.name.split('.')[1] !== "png") return res.status(400).json({ errors: [{ msg: 'Csak PNG kép tölthető fel!' }] });

	switch (req.params.type) {
		case 'hamburgers':
			const hamburgers = await Hamburger.findOne({ $or: [{ 'name': name }, { 'id': id }] });
			if (hamburgers) {
				return res.status(400).json({ errors: [{ msg: 'Ez a termék már létezik a listán!' }] });
			};

			if (safe === "true") {
				safe = true;
			} else if (safe === "false") {
				safe = false
			} else {
				return res.status(400).json({ errors: [{ msg: '"Mentes" mező értéke "true" vagy "false" lehet!' }] });
			}

			if (!picture) {
				return res.status(400).json({ errors: [{ msg: 'Nincs feltöltött kép!' }] });
			}

			picture.mv("./img/hamburgers/" + picture.name);

			const newHamburger = new Hamburger(
				{
					name,
					price: +price,
					safe,
					id: +id,
					ingredients: ingredients.split(", "),
					allergens: allergens.split(","),
					pic: picture.name.split('.')[0]
				}
			);

			await newHamburger.save();

			return res.send("Az új termék felkerült a listára!");

		case 'pizzas':
			const pizza = await Pizza.findOne({ $or: [{ 'name': name }, { 'id': id }] });
			if (pizza) {
				return res.status(400).json({ errors: [{ msg: 'Ez a termék már létezik a listán!' }] });
			};

			if (safe === "true") {
				safe = true;
			} else if (safe === "false") {
				safe = false
			} else {
				return res.status(400).json({ errors: [{ msg: '"Mentes" mező értéke "true" vagy "false" lehet!' }] });
			}

			if (!picture) {
				return res.status(400).json({ errors: [{ msg: 'Nincs feltöltött kép!' }] });
			}

			picture.mv("./img/hamburgers/" + picture.name);

			const newPizza = new Pizza(
				{
					name,
					price: +price,
					safe,
					id: +id,
					ingredients: ingredients.split(", "),
					allergens: allergens.split(","),
					pic: picture.name.split('.')[0]
				}
			);

			await newPizza.save();

			return res.send("Az új termék felkerült a listára!");
		case 'drinks':
			const drink = await Drink.findOne({ $or: [{ 'name': name }, { 'id': id }] });
			if (drink) {
				return res.status(400).json({ errors: [{ msg: 'Ez a termék már létezik a listán!' }] });
			};

			if (safe === "true") {
				safe = true;
			} else if (safe === "false") {
				safe = false
			} else {
				return res.status(400).json({ errors: [{ msg: '"Mentes" mező értéke "true" vagy "false" lehet!' }] });
			}

			if (!picture) {
				return res.status(400).json({ errors: [{ msg: 'Nincs feltöltött kép!' }] });
			}

			picture.mv("./img/drinks/" + picture.name);

			const newDrink = new Drink(
				{
					name,
					price: +price,
					safe,
					id: +id,
					ingredients: null,
					allergens: null,
					pic: picture.name.split('.')[0]
				}
			);

			await newDrink.save();

			return res.send("Az új termék felkerült a listára!");
		default:
			return res.json(null);
	}
});


//PUT - PUT /api/admin/menu/:type
//PUT - Change the values of a certain menuitem
//private
router.put('/menu/:type', auth, async (req, res) => {
	let { id, name, price, safe, ingredients, allergens, itemId } = req.body;

	//checking for errors
	if (name.length < 5) return res.status(400).json({ errors: [{ msg: 'Legalább 5 karaktert írjon be!' }] });
	if (+price < 90) return res.status(400).json({ errors: [{ msg: '90 Ft lehet a legolcsóbb ár!' }] });
	if (safe === '') return res.status(400).json({ errors: [{ msg: '"Mentes" mező kitöltése kötelező!' }] });
	if (itemId === '') return res.status(400).json({ errors: [{ msg: 'Azonosító megadása kötelező!' }] });
	if (ingredients.length === 0) return res.status(400).json({ errors: [{ msg: 'Adjon meg összetevő(ke)t!' }] });
	if (allergens.length === 0) return res.status(400).json({ errors: [{ msg: 'Adjon meg allergén(eke)t!' }] });
	if (req.files && req.files.picture.name.split('.')[1] !== "png") return res.status(400).json({ errors: [{ msg: 'Csak PNG kép tölthető fel!' }] });

	switch (req.params.type) {
		case 'hamburgers':
			const hamburgers = await Hamburger.findOne({ $or: [{ 'name': name }, { '_id': mongoose.Types.ObjectId(id) }] });
			if (!hamburgers) {
				return res.status(400).json({ errors: [{ msg: 'Ilyen termék nem létezik a listán!' }] });
			};

			if (safe === "true") {
				safe = true;
			} else if (safe === "false") {
				safe = false
			} else {
				return res.status(400).json({ errors: [{ msg: '"Mentes" mező értéke "true" vagy "false" lehet!' }] });
			}

			try {
				let chosen = await Hamburger.findOne({ _id: mongoose.Types.ObjectId(id) });

				if (!chosen) {
					return res.status(400).json({ errors: [{ msg: 'Hibás azonosító' }] });
				};

				let menuFields = {};
				menuFields.name = name;
				menuFields.price = +price;
				if (safe === "true") {
					menuFields.safe = true;
				} else {
					menuFields.safe = false;
				};
				menuFields.id = +itemId;
				menuFields.ingredients = ingredients.split(",");
				menuFields.allergens = allergens.split(",");

				if (req.files) {
					let { picture } = req.files;

					menuFields.pic = picture.name.split('.')[0];

					try {
						fs.unlinkSync(`./img/hamburgers/${chosen.pic}.png`)
						//file removed
					} catch (err) {
						console.error(err)
					}

					picture.mv("./img/hamburgers/" + picture.name);
				} else {
					menuFields.pic = chosen.pic;
				}

				if (chosen) {
					// Update
					chosen = await Hamburger.findOneAndUpdate(
						{ _id: mongoose.Types.ObjectId(id) },
						{ $set: menuFields },
						{ new: true, upsert: true }
					);

					return res.json('Termék sikeresen módosítva');
				}
			} catch (err) {
				console.error(err.message);
				return res.status(500).send('Server Error');
			}

		case 'pizzas':
			const pizza = await Pizza.findOne({ $or: [{ 'name': name }, { '_id': mongoose.Types.ObjectId(id) }] });
			if (!pizza) {
				return res.status(400).json({ errors: [{ msg: 'Ilyen termék nem létezik a listán!' }] });
			};

			if (safe === "true") {
				safe = true;
			} else if (safe === "false") {
				safe = false
			} else {
				return res.status(400).json({ errors: [{ msg: '"Mentes" mező értéke "true" vagy "false" lehet!' }] });
			}

			try {
				let chosen = await Pizza.findOne({ _id: mongoose.Types.ObjectId(id) });

				if (!chosen) {
					return res.status(400).json({ errors: [{ msg: 'Hibás azonosító' }] });
				};

				let menuFields = {};
				menuFields.name = name;
				menuFields.price = +price;
				if (safe === "true") {
					menuFields.safe = true;
				} else {
					menuFields.safe = false;
				};
				menuFields.id = +itemId;
				menuFields.ingredients = ingredients.split(",");
				menuFields.allergens = allergens.split(",");

				if (req.files) {
					let { picture } = req.files;

					menuFields.pic = picture.name.split('.')[0];

					try {
						fs.unlinkSync(`./img/pizzas/${chosen.pic}.png`)
						//file removed
					} catch (err) {
						console.error(err)
					}

					picture.mv("./img/pizzas/" + picture.name);
				} else {
					menuFields.pic = chosen.pic;
				}

				if (chosen) {
					// Update
					chosen = await Pizza.findOneAndUpdate(
						{ _id: mongoose.Types.ObjectId(id) },
						{ $set: menuFields },
						{ new: true, upsert: true }
					);

					return res.json('Termék sikeresen módosítva');
				}
			} catch (err) {
				console.error(err.message);
				return res.status(500).send('Server Error');
			}
		case 'drinks':
			const drink = await Drink.findOne({ $or: [{ 'name': name }, { '_id': mongoose.Types.ObjectId(id) }] });
			if (!drink) {
				return res.status(400).json({ errors: [{ msg: 'Ilyen termék nem létezik a listán!' }] });
			};

			if (safe === "true") {
				safe = true;
			} else if (safe === "false") {
				safe = false
			} else {
				return res.status(400).json({ errors: [{ msg: '"Mentes" mező értéke "true" vagy "false" lehet!' }] });
			}

			try {
				let chosen = await Drink.findOne({ _id: mongoose.Types.ObjectId(id) });

				if (!chosen) {
					return res.status(400).json({ errors: [{ msg: 'Hibás azonosító' }] });
				};

				let menuFields = {};
				menuFields.name = name;
				menuFields.price = +price;
				if (safe === "true") {
					menuFields.safe = true;
				} else {
					menuFields.safe = false;
				};
				menuFields.id = +itemId;
				menuFields.ingredients = null;
				menuFields.allergens = null;

				if (req.files) {
					let { picture } = req.files;

					menuFields.pic = picture.name.split('.')[0];

					try {
						fs.unlinkSync(`./img/drinks/${chosen.pic}.png`)
						//file removed
					} catch (err) {
						console.error(err)
					}

					picture.mv("./img/drinks/" + picture.name);
				} else {
					menuFields.pic = chosen.pic;
				}

				if (chosen) {
					// Update
					chosen = await Drink.findOneAndUpdate(
						{ _id: mongoose.Types.ObjectId(id) },
						{ $set: menuFields },
						{ new: true, upsert: true }
					);

					return res.json('Termék sikeresen módosítva');
				}
			} catch (err) {
				console.error(err.message);
				return res.status(500).send('Server Error');
			}
		default:
			return res.json(null);
	}
});

//DELETE - DELETE /api/admin/reservations/:id
//DELETE - Delete a reservation by id
//private
router.delete('/menu/:type/:id', auth, async (req, res) => {
	switch (req.params.type) {
		case 'hamburgers':
			const hamburger = await Hamburger.findOne({ _id: req.params.id });

			if (!hamburger) {
				return res.status(400).json({ errors: [{ msg: 'Hiba a törlés során!' }] });
			}
			await Hamburger.findOneAndRemove({ _id: req.params.id });

			const newHamburgers = await Hamburger.find().sort({ date: -1 }).sort({ time: -1 });;

			return res.json(newHamburgers);
		case 'pizzas':
			const pizza = await Pizza.findOne({ _id: req.params.id });

			if (!pizza) {
				return res.status(400).json({ errors: [{ msg: 'Hiba a törlés során!' }] });
			}
			await Pizza.findOneAndRemove({ _id: req.params.id });

			const newPizzas = await Pizza.find().sort({ date: -1 }).sort({ time: -1 });;

			return res.json(newPizzas);
		case 'drinks':
			const drinks = await Drink.findOne({ _id: req.params.id });

			if (!drinks) {
				return res.status(400).json({ errors: [{ msg: 'Hiba a törlés során!' }] });
			}
			await Drink.findOneAndRemove({ _id: req.params.id });

			const newDrinks = await Drink.find().sort({ date: -1 }).sort({ time: -1 });;

			return res.json(newDrinks);
	}
});

//GET - GET /api/admin/reservations
//GET - Get reservations uncensored for admin
//private
router.get('/reservations', auth, async (req, res) => {
	const reservations = await Reservation.find().sort({ date: -1 }).sort({ time: -1 });
	res.json(reservations);
});

//GET - GET /api/admin/reservations/:id
//GET - Get unique reservation
//private
router.get('/reservations/:id', auth, async (req, res) => {
	const reservations = await Reservation.findOne({ _id: req.params.id });
	res.json(reservations);
});

//POST - POST /api/admin/reservation-filter
//POST - Get filtered reservation coming from frontend
//private
router.post('/reservation-filter', auth, async (req, res) => {
	const { date, name, email } = req.body;

	if (date !== '' && name === '' && email === '') {
		const reservations = await Reservation.find({ date: date }).sort({ date: -1 }).sort({ time: -1 });
		res.json(reservations);
	} else if (date === '' && name !== '' && email === '') {
		const reservations = await Reservation.find({ "name": { "$regex": name, "$options": "i" } }).sort({ date: -1 }).sort({ time: -1 });
		res.json(reservations);
	} else if (date === '' && name === '' && email !== '') {
		const reservations = await Reservation.find({ "email": { "$regex": email, "$options": "i" } }).sort({ date: -1 }).sort({ time: -1 });
		res.json(reservations);
	} else if (date !== '' && name !== '' && email === '') {
		const reservations = await Reservation.find({ date: date, "name": { "$regex": name, "$options": "i" } }).sort({ date: -1 }).sort({ time: -1 });
		res.json(reservations);
	} else if (date !== '' && name === '' && email !== '') {
		const reservations = await Reservation.find({ date: date, "email": { "$regex": email, "$options": "i" } }).sort({ date: -1 }).sort({ time: -1 });
		res.json(reservations);
	} else if (date === '' && name !== '' && email !== '') {
		const reservations = await Reservation.find({ "name": { "$regex": name, "$options": "i" }, "email": { "$regex": email, "$options": "i" } }).sort({ date: -1 }).sort({ time: -1 });
		res.json(reservations);
	} else if (date !== '' && name !== '' && email !== '') {
		const reservations = await Reservation.find({ date: date, "name": { "$regex": name, "$options": "i" }, "email": { "$regex": email, "$options": "i" } }).sort({ date: -1 }).sort({ time: -1 });
		res.json(reservations);
	} else {
		const reservations = await Reservation.find().sort({ date: -1 }).sort({ time: -1 });
		res.json(reservations);
	}
});

//PUT - PUT /api/admin/reservations/
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
//GET - Get unique opening for admin
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