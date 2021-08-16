const app = require("../app");
const supertest = require("supertest");
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const request = supertest(app);

const Opening = require("../models/Opening");
const Reservation = require("../models/Reservation");
const Drink = require("../models/Drink");

test("Testing to see if Jest works", () => {
	expect(1).toBe(1);
});

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
	});

	afterEach(async () => {
		await Opening.deleteMany();
		await Reservation.deleteMany();
		await Drink.deleteMany();
	});

	afterAll(async () => {
		await mongoose.connection.close();
		await mongoose.disconnect();
		if (mongoServer) {
			await mongoServer.stop();
		}
	})


	test("If DB is empty, it should return an empty array", async () => {
		const response = await request.get("/api/openings");

		expect(response.status).toBe(200);
		expect(response.body).toEqual([]);
	});

	test("After filling up with one object, the DB should return that document", async () => {
		await Opening.create({
			index: 1,
			day: "hétfő",
			open: [10, 0],
			close: [20, 0]
		});

		const opening = await Opening.findOne({});

		const response = await request.get("/api/openings");

		expect(typeof opening).toBe('object');
		expect(response.status).toBe(200);
		expect(response.body.length).toBe(1);
		expect(response.body[0]._id).not.toBe(undefined);
		expect(response.body[0].index).toBe(1);
		expect(response.body[0].day).toBe("hétfő");
		expect(typeof response.body[0].open).toBe('object');
		expect(response.body[0].open).toHaveLength(2);
		expect(response.body[0].open[0]).toBe(10);
		expect(response.body[0].close[0]).toBe(20);
	});

	test("Loading up more objects it should return an array of reservations (email is secreted)", async () => {
		await Reservation.insertMany([
			{ name: "Kiss Bernadett", email: "kibe@freemail.hu", date: "2022-02-16", time: "15:00", guests: 5, isValiated: true, code: "abc012" },
			{ name: "Nagy Ádám", email: "naad@freemail.hu", date: "2022-02-15", time: "12:00", guests: 3, isValiated: true, code: "fdf543" },
			{ name: "Feke Árpád", email: "fear@freemail.hu", date: "2022-02-17", time: "19:00", guests: 2, isValiated: true, code: "fge755" },
		]);

		const reservation = await Reservation.find();

		const response = await request.get("/api/reservations");

		expect(typeof reservation).toBe('object');
		expect(reservation).toHaveLength(3);
		expect(response.status).toBe(200);
		expect(response.body).toHaveLength(3);
		expect(response.body[0]._id).not.toBe(undefined);
		expect(response.body[0].name).toBe("Nagy Ádám");
		expect(response.body[1].email).toBe("k**e@freemail.hu");
		expect(response.body[1].date).toBe("2022-02-16");
		expect(response.body[2].time).toBe("19:00");
		expect(response.body[2].isValiated).toBeTruthy()
		expect(response.body[2].code).toBe("fge755");
	});

	test("Should get one object by ID from an array of drinks", async () => {
		await Drink.insertMany([
			{ name: "Pepsi", pic: "pepsi", id: 16, price: 490, safe: true, ingredients: null, allergens: null },
			{ name: "Sangria", pic: "sangria", id: 18, price: 690, safe: false, ingredients: null, allergens: null },
			{ name: "Áfonyás pálinka", pic: "afonyas-palinka", id: 20, price: 890, safe: false, ingredients: null, allergens: null }
		]);

		const drinks = await Drink.find();
		const chosenDrink = await Drink.findOne({ name: "Sangria" });

		const response = await request.get(`/api/menu/drinks/${chosenDrink.id}`);

		expect(typeof drinks).toBe('object');
		expect(drinks).toHaveLength(3);
		expect(response.status).toBe(200);
		expect(typeof response.body).toBe('object');
		expect(response.body._id).not.toBe(undefined);
		expect(response.body.name).toBe("Sangria");
		expect(response.body.id).toBe(18);
		expect(response.body.price).toBe(690);
		expect(response.body.safe).toBeFalsy();
		expect(response.body.ingredients).toBeNull();
		expect(response.body.allergens).toBeNull();
	});
});
