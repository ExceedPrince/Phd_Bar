const app = require("../app");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const supertest = require("supertest");
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const request = supertest(app);

const User = require("../models/User");


describe("testing some easy case", () => {
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

		//Encrypt password
		const salt = await bcrypt.genSalt(10);

		const adminPW = await bcrypt.hash("123456", salt);

		await User.create({
			name: "Kerekes Ernő",
			email: "kerer@hotmail.com",
			password: adminPW,
			code: "fdd456",
			isAdmin: true
		});
	});

	afterAll(async () => {
		await User.deleteMany();

		await mongoose.connection.close();
		await mongoose.disconnect();
		if (mongoServer) {
			await mongoServer.stop();
		}
	});

	test("A success login shoul return a token string", async () => {
		const res = await request.post("/api/admin/login").send({
			email: "kerer@hotmail.com", password: "123456"
		});

		expect(res.status).toBe(200);
		expect(typeof res.body).toBe('object');
		expect(res.body).toHaveProperty('token');
		expect(res.body.token).not.toBe(undefined);
		expect(typeof res.body.token).toBe('string');
	});

	test("With wrong email-format it should return: 'Írjon be valós email címet!'", async () => {
		const res = await request.post("/api/admin/login").send({
			email: "kererhotmail.com", password: "123456"
		});

		expect(res.status).toBe(400);
		expect(typeof res.body).toBe('object');
		expect(res.body).toHaveProperty('errors');
		expect(res.body.errors).toHaveLength(1);
		expect(res.body.errors[0]).toHaveProperty('msg');
		expect(res.body.errors[0].msg).toBe('Írjon be valós email címet!');
	});

	test("With wrong email it should return: 'Hibás azonosítás'", async () => {
		const res = await request.post("/api/admin/login").send({
			email: "john.doe@hotmail.com", password: "123456"
		});

		expect(res.status).toBe(400);
		expect(typeof res.body).toBe('object');
		expect(res.body).toHaveProperty('errors');
		expect(res.body.errors).toHaveLength(1);
		expect(res.body.errors[0]).toHaveProperty('msg');
		expect(res.body.errors[0].msg).toBe('Hibás azonosítás');
	});

	test("Without password it should return: 'Jelszó szükséges!'", async () => {
		const res = await request.post("/api/admin/login").send({
			email: "kerer@hotmail.com"
		});

		expect(res.status).toBe(400);
		expect(typeof res.body).toBe('object');
		expect(res.body).toHaveProperty('errors');
		expect(res.body.errors).toHaveLength(1);
		expect(res.body.errors[0]).toHaveProperty('msg');
		expect(res.body.errors[0].msg).toBe('Jelszó szükséges!');
	});

	test("With wrong password it should return: 'Hibás azonosítás'", async () => {
		const res = await request.post("/api/admin/login").send({
			email: "kerer@hotmail.com", password: "wrongPW"
		});

		expect(res.status).toBe(400);
		expect(typeof res.body).toBe('object');
		expect(res.body).toHaveProperty('errors');
		expect(res.body.errors).toHaveLength(1);
		expect(res.body.errors[0]).toHaveProperty('msg');
		expect(res.body.errors[0].msg).toBe('Hibás azonosítás');
	});

	test("If admin is still not validated, it should return: 'Érvénytelen felhasználó'", async () => {
		const salt = await bcrypt.genSalt(10);
		const adminNewPW = await bcrypt.hash("123456", salt);

		await User.create({
			name: "Kozma Sándor",
			email: "kosa@gmail.com",
			password: adminNewPW,
			code: "gd5zb3",
			isAdmin: false
		});

		const res = await request.post("/api/admin/login").send({
			email: "kosa@gmail.com", password: "gd5zb3"
		});

		expect(res.status).toBe(400);
		expect(typeof res.body).toBe('object');
		expect(res.body).toHaveProperty('errors');
		expect(res.body.errors).toHaveLength(1);
		expect(res.body.errors[0]).toHaveProperty('msg');
		expect(res.body.errors[0].msg).toBe('Érvénytelen felhasználó');
	});

	test("Using the token from '/api/admin/login', it should return from '/api/admin/auth' the user without password", async () => {
		//Login
		const res = await request.post("/api/admin/login").send({
			email: "kerer@hotmail.com", password: "123456"
		});

		//Authorization
		const resAuth = await request.get("/api/admin/auth").set({ 'x-auth-token': res.body.token, Accept: 'application/json' });

		expect(resAuth.status).toBe(200);
		expect(typeof resAuth.body).toBe('object');
		expect(resAuth.body.name).toBe('Kerekes Ernő');
		expect(resAuth.body.email).toBe('kerer@hotmail.com');
		expect(resAuth.body.code).toBe('fdd456');
		expect(resAuth.body.isAdmin).toBe(true);
		expect(resAuth.body).not.toHaveProperty('password');
	});



});