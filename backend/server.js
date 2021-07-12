const express = require('express');
const bodyParser = require('body-parser');
const app = express();

//Can the frontend do GET request
app.use(function (req, res, next) {
	// Website you wish to allow to connect
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

	// Request methods you wish to allow
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

	// Request headers you wish to allow
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

	// Set to true if you need the website to include cookies in the requests sent
	// to the API (e.g. in case you use sessions)
	res.setHeader('Access-Control-Allow-Credentials', true);

	// Pass to next layer of middleware
	next();
});

//Can post from frontend
const cors = require('cors');
const corsOptions = {
	origin: 'http://localhost:3000',
	credentials: true,            //access-control-allow-credentials:true
	optionSuccessStatus: 200
}
app.use(cors(corsOptions));

//Can write my original data file
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
const port = 8080
const fs = require('fs');

//Menu data
let menuContent = fs.readFileSync("./menudb.json");
let menuJsonContent = JSON.parse(menuContent);

//Opening data
let openingContent = fs.readFileSync("./openingdb.json");
let openingJsonContent = JSON.parse(openingContent);

//Array of menu
app.get('/menu', (req, res) => {
	res.send(menuJsonContent);
})

//Types of menus
app.get('/menu/:type', (req, res) => {
	let chosen = Object.keys(menuJsonContent[0]).indexOf(req.params.type);

	res.send(Object.values(menuJsonContent[0]).filter((el, index) => index === chosen)[0]);
});

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

		let now = new Date().toString();
		let timeZone = " (" + now.replace(/.*[(](.*)[)].*/, '$1') + ")";
		let today = new Date().toString().replace(timeZone, "").slice(0, -8) + ending;

		return new Date(today);
	}


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
})


//404 error
app.use(function (req, res, next) {
	res.status(404).send("No such page can be found")
})

//Console log
app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
})
