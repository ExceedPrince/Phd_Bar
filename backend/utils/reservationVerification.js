require('dotenv').config();

//Sending email to verify a reservation
const validationEmail = (email, name, code, date) => {
	return {
		to: email,
		from: { email: "jadenprince93@gmail.com", name: "PhD Bár" },
		subject: "Asztalfoglalás",
		html: `<h1>Foglalási szándéka megérkezett hozzánk!</h1>
		<div>
		<h2>Kedves ${name}!</h2>
		<p>Köszönjük, hogy megtisztelt minket asztalfoglalásával a PhD Bárban!</p>
		<p>Az alábbi linkre kattintva, kérjük, hogy <u>5 percen belül</u> erősítse meg asztalfoglalási szándékát, a megadott kód felhasználásával!</p>
		<p>Az Ön kódja: <span style="color:red; font-size:20px;">${code}</span></p>
		<p>Link eléréséhez <a href=${process.env.FRONTEND_PORT}/verification?user=${email}&date=${date}>Kattinson ide</a></p>
		<br>
		<h2>Üdvözlettel, <br>PhD Bár</h2>
		</div>
		`
	}
};

//Sending email about succes reservation
const successEmail = (email, name, date, time, guests) => {
	const day = () => {
		switch (new Date(date).getDay()) {
			case 1:
				return "Hétfő";
			case 2:
				return "Kedd";
			case 3:
				return "Szerda";
			case 4:
				return "Csütörtök";
			case 5:
				return "Péntek";
			case 6:
				return "Szombat";
			case 0:
				return "Vasárnap";
		}
	}

	return {
		to: email,
		from: { email: "jadenprince93@gmail.com", name: "PhD Bár" },
		subject: "Sikeres asztalfoglalás!",
		html: `
		<div>
		<h2>Kedves ${name}!</h2>
		<p>Foglalását sikeresen megerősítette, melynek pontos részletei:</p>
		<ul>
			<li>Foglaló neve: ${name}</li>
			<li>Dátum: ${date}, ${day()}</li>
			<li>Időpont: ${time}</li>
			<li>Vendégek száma: ${guests}</li>
		</ul>
		<p>Amennyiben szeretné módosítani, vagy lemondani a foglalását, kérjük küldjön üzenetet a(z) <a href="mailto:jadenprince93@gmail.com">jadenprince93@gmail.com</a> címre!</p>
		<p>Szeretettel várjuk az éttermünkben!</p>
		<br>
		<h2>Üdvözlettel, <br>PhD Bár</h2>
		</div>
		`
	}
};

module.exports = { validationEmail, successEmail };