const express = require('express');
const connectDB = require('./config/db');
const app = express();
require('dotenv').config();
const cors = require('cors');
const allowCors = require('./middleware/allowCors');
const corsOptions = require('./middleware/corsOptions');
const auth = require('./middleware/auth');
const notExists = require('./middleware/notExists');

const Hamburger = require('./models/Hamburger');
const Pizza = require('./models/Pizza');
const Drink = require('./models/Drink');


const PORT = process.env.PORT || 8080;

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());
app.use(allowCors);
app.use(cors(corsOptions));


//GET - Basic route
//Public
app.get('/api/', async (req, res) => {
	res.send('Backend is on')
});

//GET - Get all kind of menu types
//Public
app.get('/api/menu/:type', async (req, res) => {
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



/* 
//Items of types by ID
app.get('/menu/:type/:id', (req, res) => {
	let chosen = Object.keys(menuJsonContent[0]).indexOf(req.params.type);
	let array = Object.values(menuJsonContent[0]).filter((el, index) => index === chosen)[0];

	res.send(array.filter(el => el.id == req.params.id)[0]);
});

//Array of opening hours
app.get('/openings', (req, res) => {
	res.send(openingJsonContent);
})

//Array of reservations
app.get('/reservations', (req, res) => {
	//Reservation data
	let reservationsContent = fs.readFileSync("./reservationsdb.json");
	let reservationsJsonContent = JSON.parse(reservationsContent);

	for (let i = 0; i < reservationsJsonContent.length; i++) {
		if (reservationsJsonContent[i].email.split('@')[0].length > 1) {
			reservationsJsonContent[i].email =
				reservationsJsonContent[i].email.split('@')[0][0] +
				reservationsJsonContent[i].email.split('@')[0].slice(1, reservationsJsonContent[i].email.split('@')[0].length - 1)
					.replace(/[a-z0-9]/g, '*').replace(/[&\/\\#,+()$~%.'":?<>{}]/g, '*') +
				reservationsJsonContent[i].email.split('@')[0][reservationsJsonContent[i].email.split('@')[0].length - 1] +
				"@" + reservationsJsonContent[i].email.split('@')[1];
		}
	}

	function timeZoneTime() {
		let ending = "";
		let offset = new Date().getTimezoneOffset();
		if (offset < 0) {
			ending = "GMT+00:00";
		} else {
			ending = "GMT-00:00";
		}
 */
//		let now = new Date().toString();
//		let timeZone = " (" + now.replace(/.*[(](.*)[)].*/, '$1') + ")";
//		let today = new Date().toString().replace(timeZone, "").slice(0, -8) + ending;

//		return new Date(today);
//	}

/*
	let todayFormat = timeZoneTime().toISOString().split('T')[0];

	let filtered = reservationsJsonContent.filter(item => new Date(item.date).getTime() >= new Date(todayFormat).getTime());

	let sortedByMin = filtered.sort((e, f) => +e.time.split(":")[1] - +f.time.split(":")[1]);
	let sortedByHour = sortedByMin.sort((c, d) => +c.time.split(":")[0] - +d.time.split(":")[0]);
	let sortedByDay = sortedByHour.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

	res.send(sortedByDay);
})

 //Reservations by ID
app.get('/reservations/:date', (req, res) => {
	//Reservation data
	let reservationsContent = fs.readFileSync("./reservationsdb.json");
	let reservationsJsonContent = JSON.parse(reservationsContent);

	for (let i = 0; i < reservationsJsonContent.length; i++) {
		if (reservationsJsonContent[i].email.split('@')[0].length > 1) {
			reservationsJsonContent[i].email =
				reservationsJsonContent[i].email.split('@')[0][0] +
				reservationsJsonContent[i].email.split('@')[0].slice(1, reservationsJsonContent[i].email.split('@')[0].length - 1)
					.replace(/[a-z0-9]/g, '*').replace(/[&\/\\#,+()$~%.'":?<>{}]/g, '*') +
				reservationsJsonContent[i].email.split('@')[0][reservationsJsonContent[i].email.split('@')[0].length - 1] +
				"@" + reservationsJsonContent[i].email.split('@')[1];
		}
	}

	let selectedDay = reservationsJsonContent.filter(el => el.date == req.params.date);
	let sortedByMin = selectedDay.sort((e, f) => +e.time.split(":")[1] - +f.time.split(":")[1]);
	let sortedByHour = sortedByMin.sort((c, d) => +c.time.split(":")[0] - +d.time.split(":")[0]);

	res.send(sortedByHour);
})

//Post a new student
app.post('/reservations', (req, res) => {
	//Backup Reservation data
	let backupContent = fs.readFileSync("./reservationsdb.json");
	let backupJsonContent = JSON.parse(backupContent);

	var obj = { name: req.body.name, email: req.body.email, date: req.body.date, time: req.body.time, guests: req.body.guests };
	let dateArr = []
	backupJsonContent.filter(person => person.email === obj.email ? dateArr.push(person.date) : null);
	let array = [];
	backupJsonContent.map(item => array.push(item.email));

	function checkMails(mail) {
		return mail === obj.email
	}

	function checkDates(date) {
		return date === obj.date
	}

	if (array.some(checkMails) === true && dateArr.some(checkDates) === true) {
		res.send([false, "Ön már foglalt nálunk erre a napra!"])
	} else {
		backupJsonContent.push(obj);
		var json = JSON.stringify(backupJsonContent);
		fs.writeFile("./reservationsdb.json", json, 'utf8', function () { });
		res.send([true, "Foglalását rögzítettük"])
	}
}) */

app.use(notExists);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));