const app = require("../app");
const supertest = require("supertest");
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const MockDate = require('mockdate');

const request = supertest(app);

const Reservation = require("../models/Reservation");
const Opening = require("../models/Opening");

describe("testing the whole reservation process", () => {
	MockDate.set('2021-08-20');

	let mongoServer;
	beforeAll(async () => {
		mongoServer = await MongoMemoryServer.create();
		await mongoose.connect(mongoServer.getUri(),
			{
				useNewUrlParser: true,
				dbName: "verifyMASTER",
				useCreateIndex: true,
				useUnifiedTopology: true
			});

		await Opening.create(
			{ index: 1, day: "Hétfő", open: [10, 0], close: [19, 0] },
		);
	});

	afterEach(async () => {
		await Reservation.deleteMany();
	});

	afterAll(async () => {
		await Opening.deleteMany();

		await mongoose.connection.close();
		await mongoose.disconnect();
		if (mongoServer) {
			await mongoServer.stop();
		}
	})

	//Reservation process

	test("After a success reservation it should return an array with 'true' and a string", async () => {

		const res = await request.post("/api/reservations").send({
			name: "Bodorkós Tamás",
			email: "tamas.bodorkos@hotmail.hu",
			date: "2021-08-23", //Monday
			time: "12:30",
			guests: 3,
		});

		const reservation = await Reservation.findOne({});

		expect(typeof reservation).toBe('object');
		expect(reservation._id).not.toBe(undefined);
		expect(reservation.name).toBe("Bodorkós Tamás");
		expect(reservation.guests).toBe(3);
		expect(reservation).toHaveProperty('isValiated', false);
		expect(reservation).toHaveProperty('code');

		expect(res.status).toBe(200);
		expect(typeof res.body).toBe('object');
		expect(res.body[0]).toBe(true);
		expect(res.body[1]).toBe('Köszönjük! Rendelését erősítse meg az elküldött email üzenetben!');
	});

	test("If the same person (by email) reserves for the same day twice it should return an array with 'false' and a string", async () => {

		const res = await request.post("/api/reservations").send({
			name: "Bodorkós Tamás",
			email: "tamas.bodorkos@hotmail.hu",
			date: "2021-08-23", //Monday
			time: "12:30",
			guests: 3,
		});

		const resSecond = await request.post("/api/reservations").send({
			name: "Bodorkós Tamás",
			email: "tamas.bodorkos@hotmail.hu",
			date: "2021-08-23", //Monday
			time: "15:50",
			guests: 8,
		});

		expect(res.status).toBe(200);
		expect(typeof res.body).toBe('object');
		expect(res.body[0]).toBe(true);
		expect(res.body[1]).toBe('Köszönjük! Rendelését erősítse meg az elküldött email üzenetben!');

		expect(resSecond.status).toBe(200);
		expect(typeof resSecond.body).toBe('object');
		expect(resSecond.body[0]).toBe(false);
		expect(resSecond.body[1]).toBe('Ön már foglalt nálunk erre a napra!');
	});

	test("Without proper name it should return a string: 'Legalább 5 karaktert írjon be!'", async () => {

		const res = await request.post("/api/reservations").send({
			name: "BoT",
			email: "tamas.bodorkos@hotmail.hu",
			date: "2021-08-23", //Monday
			time: "12:30",
			guests: 3,
		});

		expect(res.status).toBe(400);
		expect(typeof res.body).toBe('object');
		expect(res.body).toHaveProperty('errors');
		expect(res.body.errors).toHaveLength(1);
		expect(res.body.errors[0]).toHaveProperty('msg');
		expect(res.body.errors[0].msg).toBe('Legalább 5 karaktert írjon be!');
	});

	test("Without proper email it should return a string: 'Adjon meg valós email címet!'", async () => {
		const res = await request.post("/api/reservations").send({
			name: "Bodorkós Tamás",
			email: "tamas.bodorkoshotmail.hu",
			date: "2021-08-23", //Monday
			time: "12:30",
			guests: 3,
		});

		expect(res.status).toBe(400);
		expect(typeof res.body).toBe('object');
		expect(res.body).toHaveProperty('errors');
		expect(res.body.errors).toHaveLength(1);
		expect(res.body.errors[0]).toHaveProperty('msg');
		expect(res.body.errors[0].msg).toBe('Adjon meg valós email címet!');
	});

	test("Without proper guest number it should return a string: '1 és 10 között válasszon helyet!'", async () => {

		const res = await request.post("/api/reservations").send({
			name: "Bodorkós Tamás",
			email: "tamas.bodorkos@hotmail.hu",
			date: "2021-08-23", //Monday
			time: "12:30",
			guests: 12,
		});

		expect(res.status).toBe(400);
		expect(typeof res.body).toBe('object');
		expect(res.body).toHaveProperty('errors');
		expect(res.body.errors).toHaveLength(1);
		expect(res.body.errors[0]).toHaveProperty('msg');
		expect(res.body.errors[0].msg).toBe('1 és 10 között válasszon helyet!');
	});

	test("Without date it should return a string: 'Válasszon másik dátumot!'", async () => {
		const res = await request.post("/api/reservations").send({
			name: "Bodorkós Tamás",
			email: "tamas.bodorkos@hotmail.hu",
			date: "",
			time: "12:30",
			guests: 3,
		});

		expect(res.status).toBe(400);
		expect(typeof res.body).toBe('object');
		expect(res.body).toHaveProperty('errors');
		expect(res.body.errors).toHaveLength(1);
		expect(res.body.errors[0]).toHaveProperty('msg');
		expect(res.body.errors[0].msg).toBe('Válasszon másik dátumot!');
	});

	test("Without time it should return a string: 'Válasszon másik időpontot!'", async () => {

		const res = await request.post("/api/reservations").send({
			name: "Bodorkós Tamás",
			email: "tamas.bodorkos@hotmail.hu",
			date: "2021-08-23", //Monday
			time: "",
			guests: 3,
		});

		expect(res.status).toBe(400);
		expect(typeof res.body).toBe('object');
		expect(res.body).toHaveProperty('errors');
		expect(res.body.errors).toHaveLength(1);
		expect(res.body.errors[0]).toHaveProperty('msg');
		expect(res.body.errors[0].msg).toBe('Válasszon másik időpontot!');
	});

	//Reservation verification

	test("If verification is correct, it should return an array with 'true' and a string'", async () => {

		await request.post("/api/reservations").send({
			name: "Bodorkós Tamás",
			email: "tamas.bodorkos@hotmail.hu",
			date: "2021-08-23", //Monday
			time: "12:30",
			guests: 3,
		});

		const reservation = await Reservation.findOne({});

		expect(typeof reservation).toBe('object');
		expect(reservation._id).not.toBe(undefined);
		expect(reservation.email).toBe("tamas.bodorkos@hotmail.hu");
		expect(reservation.guests).toBe(3);
		expect(reservation).toHaveProperty('isValiated', false);
		expect(reservation).toHaveProperty('code');

		const resValid = await request.post("/api/reservations/validate").send(
			{ email: reservation.email, validation: reservation.code, reservDate: reservation.date, date: new Date() }
		);

		expect(resValid.status).toBe(200);
		expect(typeof resValid.body).toBe('object');
		expect(resValid.body[0]).toBe(true);
		expect(resValid.body[1]).toBe('Foglalását sikeresen megerősítette, visszairányítjuk a főoldalra!');

		const reservationSecondCheck = await Reservation.findOne({});

		expect(reservationSecondCheck.email).toBe("tamas.bodorkos@hotmail.hu");
		expect(reservationSecondCheck.isValiated).toBeTruthy();
	});

	test("Without proper email it should return a string: 'Adjon meg valós email címet!'", async () => {

		await request.post("/api/reservations").send({
			name: "Bodorkós Tamás",
			email: "tamas.bodorkos@hotmail.hu",
			date: "2021-08-23", //Monday
			time: "12:30",
			guests: 3,
		});

		const reservation = await Reservation.findOne({});

		const resValid = await request.post("/api/reservations/validate").send(
			{ email: "tamas.bodorkoshotmail.hu", validation: reservation.code, reservDate: reservation.date, date: new Date() }
		);

		expect(resValid.status).toBe(400);
		expect(typeof resValid.body).toBe('object');
		expect(resValid.body).toHaveProperty('errors');
		expect(resValid.body.errors).toHaveLength(1);
		expect(resValid.body.errors[0]).toHaveProperty('msg');
		expect(resValid.body.errors[0].msg).toBe('Adjon meg valós email címet!');
	});

	test("Without validation code it should return a string: 'Adja meg a megerősítő kódját!'", async () => {

		await request.post("/api/reservations").send({
			name: "Bodorkós Tamás",
			email: "tamas.bodorkos@hotmail.hu",
			date: "2021-08-23", //Monday
			time: "12:30",
			guests: 3,
		});

		const reservation = await Reservation.findOne({});

		const resValid = await request.post("/api/reservations/validate").send(
			{ email: reservation.email, validation: "", reservDate: reservation.date, date: new Date() }
		);

		expect(resValid.status).toBe(400);
		expect(typeof resValid.body).toBe('object');
		expect(resValid.body).toHaveProperty('errors');
		expect(resValid.body.errors).toHaveLength(1);
		expect(resValid.body.errors[0]).toHaveProperty('msg');
		expect(resValid.body.errors[0].msg).toBe('Adja meg a megerősítő kódját!');
	});

	test("With wrong email, it should return: 'Ezzel a címmel nincs erre a napra érvényesítendő foglalás!'", async () => {

		await request.post("/api/reservations").send({
			name: "Bodorkós Tamás",
			email: "tamas.bodorkos@hotmail.hu",
			date: "2021-08-23", //Monday
			time: "12:30",
			guests: 3,
		});

		const reservation = await Reservation.findOne({});

		const resValid = await request.post("/api/reservations/validate").send(
			{ email: "szep.erika@gmail.com", validation: reservation.code, reservDate: reservation.date, date: new Date() }
		);

		expect(resValid.status).toBe(400);
		expect(typeof resValid.body).toBe('object');
		expect(resValid.body).toHaveProperty('errors');
		expect(resValid.body.errors).toHaveLength(1);
		expect(resValid.body.errors[0]).toHaveProperty('msg');
		expect(resValid.body.errors[0].msg).toBe('Ezzel a címmel nincs erre a napra érvényesítendő foglalás!');
	});

	test("With more then 5 minutes timeout, it should return an array with 'false' and a string", async () => {

		await request.post("/api/reservations").send({
			name: "Bodorkós Tamás",
			email: "tamas.bodorkos@hotmail.hu",
			date: "2021-08-23", //Monday
			time: "12:30",
			guests: 3,
		});

		const reservation = await Reservation.findOne({});

		const resValid = await request.post("/api/reservations/validate").send({
			email: reservation.email,
			validation: reservation.code,
			reservDate: reservation.date,
			date: new Date(new Date(reservation.createdDate).getTime() + 300001)
		});

		expect(resValid.status).toBe(200);
		expect(typeof resValid.body).toBe('object');
		expect(resValid.body[0]).toBe(false);
		expect(resValid.body[1]).toBe('Hibás megerősítés miatt foglalását töröltük, visszairányítjuk a főoldalra!');

		const reservationSecondCheck = await Reservation.find();

		expect(reservationSecondCheck).toEqual([]);
	});

	test("With wrong code, it should return an array with 'false' and a string", async () => {

		await request.post("/api/reservations").send({
			name: "Bodorkós Tamás",
			email: "tamas.bodorkos@hotmail.hu",
			date: "2021-08-23", //Monday
			time: "12:30",
			guests: 3,
		});

		const reservation = await Reservation.findOne({});

		const resValid = await request.post("/api/reservations/validate").send(
			{ email: reservation.email, validation: "gdrd65", reservDate: reservation.date, date: new Date() }
		);

		expect(resValid.status).toBe(200);
		expect(typeof resValid.body).toBe('object');
		expect(resValid.body[0]).toBe(false);
		expect(resValid.body[1]).toBe('Hibás megerősítés miatt foglalását töröltük, visszairányítjuk a főoldalra!');

		const reservationSecondCheck = await Reservation.find();

		expect(reservationSecondCheck).toEqual([]);
	});

});