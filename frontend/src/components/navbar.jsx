import React, { useState } from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import Fade from 'react-reveal/Fade';


const Navbar = () => {
	const [clicked, setClicked] = useState(false)

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
			<div id="open" onClick={clickEvent}>
				<svg viewBox="0 0 40 40">
					<rect className="a" x="0" y="0" width="20" height="2"></rect>
					<rect className="b" x="0" y="0" width="20" height="2"></rect>
					<rect className="c" x="0" y="0" width="20" height="2"></rect>
				</svg>
			</div>
			<nav id="nav">
				<Fade right when={clicked} delay={200}>
					<ul>
						<Link to="/#" exact ><li onClick={clickEvent}>Fő oldal</li></Link>
						<Link to="/menu/#" exact ><li onClick={clickEvent}>Kínálataink</li></Link>
						<Link to="/#form_container" exact ><li onClick={openForm}>Asztalfoglalás</li></Link>
						<Link to="/reservations/#" exact ><li onClick={clickEvent}>Aktuális Foglalások</li></Link>
						<Link to="/contacts/#" exact ><li onClick={clickEvent}>Elérhetőségeink</li></Link>
					</ul>
				</Fade>

			</nav>
		</>
	)
}

export default Navbar;
