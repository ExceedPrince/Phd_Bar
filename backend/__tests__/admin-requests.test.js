const app = require("../app");
const bcrypt = require("bcryptjs");
const supertest = require("supertest");
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const MockDate = require('mockdate');

const request = supertest(app);

const User = require("../models/User");
const Hamburger = require("../models/Hamburger");
const Reservation = require("../models/Reservation");
const Opening = require("../models/Opening");

describe("testing some authorization-needed requests", () => {
	MockDate.set('2021-08-15');

	let mongoServer;
	let res;
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

		//Login
		res = await request.post("/api/admin/login").send({
			email: "kerer@hotmail.com", password: "123456"
		});
	});

	afterEach(async () => {
		await Hamburger.deleteMany();
		await Reservation.deleteMany();
		await Opening.deleteMany();
	});

	afterAll(async () => {
		await User.deleteMany();

		await mongoose.connection.close();
		await mongoose.disconnect();
		if (mongoServer) {
			await mongoServer.stop();
		}
	});

	test("After authorization it shuold return a filtered array by name and type", async () => {
		//insert a reservation
		await Hamburger.insertMany([
			{ name: "Vegán burger", pic: "veganburger", id: 1, price: 1190, safe: true, ingredients: ["zsemle", "zöldség"], allergens: ["kukorica"] },
			{ name: "Angry bacon burger", pic: "angrybaconburger", id: 2, price: 1290, safe: false, ingredients: ["zsemle", "bacon"], allergens: "glutén" },
			{ name: "Overking burger", pic: "overkingburger", id: 3, price: 1390, safe: false, ingredients: ["zsemle", "hús", "paradicsom"], allergens: "glutén" }
		]);

		//Authorization and put request
		const resMenu = await request.post("/api/admin/menu-filter").set({ 'x-auth-token': res.body.token, Accept: 'application/json' }).send({
			name: "angry", type: "hamburgers"
		});;

		expect(resMenu.status).toBe(200);
		expect(typeof resMenu.body).toBe('object');
		expect(resMenu.body).toHaveLength(1);
		expect(resMenu.body[0].name).toBe("Angry bacon burger");
		expect(resMenu.body[0].id).toBe(2);
		expect(resMenu.body[0].price).toBe(1290);
	});

	test("After authorization and a success reservation DELETE request it should return an array with 1 item", async () => {
		//insert a reservation
		await Reservation.insertMany([
			{ _id: "60ee2269f9ff9760981a4e24", name: "Vak Béla", email: "vabe@gmail.com", date: "2021-08-19", time: "15:30", guests: 4, isValiated: true, code: "gdf643" },
			{ _id: "40ee2269f9ff9760981a4e25", name: "Sas Tamás", email: "sata@gmail.com", date: "2021-08-20", time: "12:30", guests: 7, isValiated: true, code: "ggdfg5" }
		]);

		const reservs = await Reservation.find();

		expect(reservs).toHaveLength(2);

		//Authorization and delete request
		const resDelete = await request.delete("/api/admin/reservations/60ee2269f9ff9760981a4e24").set({ 'x-auth-token': res.body.token, Accept: 'application/json' })

		expect(resDelete.status).toBe(200);
		expect(typeof resDelete.body).toBe('object');
		expect(resDelete.body).toHaveLength(1);
		expect(resDelete.body[0].name).toBe("Sas Tamás");
		expect(resDelete.body[0].email).toBe("sata@gmail.com");
		expect(resDelete.body[0].time).toBe("12:30");
	});

	test("After changing the opening hours it should return 'Nyitvatartás sikeresen módosítva'", async () => {
		//insert a reservation
		await Opening.create(
			{ index: 1, day: "Hétfő", open: [10, 0], close: [19, 0] },
		);

		const day = await Opening.findOne({});

		//Authorization and delete request
		const resDay = await request.put("/api/admin/openings/").set({ 'x-auth-token': res.body.token, Accept: 'application/json' }).send({
			opening: 14, closing: 18, id: day._id
		})

		const changedDay = await Opening.findOne({});

		expect(changedDay.open[0]).toBe(14);
		expect(changedDay.close[0]).toBe(18);
		expect(resDay.status).toBe(200);
		expect(typeof resDay.body).toBe('string');
		expect(resDay.body).toBe('Nyitvatartás sikeresen módosítva');
	});


});