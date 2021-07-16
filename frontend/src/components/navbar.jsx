import React, { useState } from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import Fade from 'react-reveal/Fade';


const Navbar = () => {
	const [clicked, setClicked] = useState(false);
	const [showForm, setShowForm] = useState(false);
	const [formData, setFormData] = useState({ email: '', password: '' });

	const { email, password } = formData;

	const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

	const onSubmit = async (e) => {
		e.preventDefault();
		console.log(email, password)
	}


	function clickEvent() {
		document.querySelector("body").classList.toggle("clicked");
		setClicked(!clicked);
		console.log(document.querySelector("body").classList.contains("clicked"));
	}

	async function openForm() {
		await clickEvent();

		if (document.getElementById("formOpenBtn") !== null) {
			const link = document.getElementById('formOpenBtn');
			link.click();
		}
	}

	return (
		<>
			<div id="open" onClick={() => { clickEvent(); setShowForm(false); setFormData({ ...formData, email: '', password: '' }) }}>
				<svg viewBox="0 0 40 40">
					<rect className="a" x="0" y="0" width="20" height="2"></rect>
					<rect className="b" x="0" y="0" width="20" height="2"></rect>
					<rect className="c" x="0" y="0" width="20" height="2"></rect>
				</svg>
			</div>
			<nav id="nav">
				<Fade right when={clicked} delay={200}>
					{!showForm ? (
						<ul>
							<Link to="/#" exact ><li onClick={clickEvent}>Fő oldal</li></Link>
							<Link to="/menu/#" exact ><li onClick={clickEvent}>Kínálataink</li></Link>
							<Link to="/#form_container" exact ><li onClick={openForm}>Asztalfoglalás</li></Link>
							<Link to="/reservations/#" exact ><li onClick={clickEvent}>Aktuális Foglalások</li></Link>
							<Link to="/contacts/#" exact ><li onClick={clickEvent}>Elérhetőségeink</li></Link>
							<li id="login_icon" onClick={() => setShowForm(!showForm)}><i className="fa fa-sign-in"></i></li>
						</ul>
					) :
						(<div>
							<h1 id="admin-title">Admin belépés</h1>
							<form className="login-form" onSubmit={e => onSubmit(e)}>
								<label htmlFor="email">Email: </label> <br />
								<input type="email" name="email" placeholder="admin@email.com" value={email} onChange={e => onChange(e)} /><br />
								<label htmlFor="password">Jelszó: </label><br />
								<input type="password" name="password" placeholder="Jelszó" value={password} onChange={e => onChange(e)} /><br /><br />
								<div>
									<input type="submit" value="Belépés" />
									<button onClick={() => { setShowForm(!showForm); setFormData({ ...formData, email: '', password: '' }) }}>Visszalépek</button>
								</div>
							</form>
						</div>
						)}

				</Fade>

			</nav>
		</>
	)
}

export default Navbar;
