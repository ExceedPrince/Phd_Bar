import React, { useState, useEffect } from 'react';
import { getAdminReservations } from '../redux/actions/admin';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const AdminReservation = ({ admin, getAdminReservations }) => {

	useEffect(() => {
		getAdminReservations()
	}, [getAdminReservations])

	if (admin.openings) {
		console.log(admin.openings)
	}

	//oldalként 20 látható

	//legyen egy input=text, mellette 2 radiobutton, hogy név vagy email alapján szűrjünk frontenden

	//legyen egy date input is, dátum alapján szűrni

	//a szűrők figyeljék egymást

	//egyen egy gomb, ami visszaállítja az összes létező időpontot

	//újat nem lehet felvenni, de meglévőt lehet törölni módosítani
	//törlés lehetséges itt is egy törlés gombbal
	//módosításhoz is itt van egy gomb, az átvisz egy egyedi id-s oldalra
	//ott PUT request-el lehet módosítást küldeni


	return (
		<div className="adminBG" style={{ background: `url("/img/slides/bg_01.png")` }}>
			<h1>Asztalfoglalások módosítása</h1>
			<form id="searchRadios" className="menuFilterCont">
				{/* 					<span id="radioButtons">
						<label className="container">Igen
							<input type="radio" name="item" id="itemFilter1" className="itemFilter" onChange={() => setGlutenFiltered(true)} />
							<span className="checkmark"></span>
						</label>
						<label className="container">Nem
							<input type="radio" name="item" id="itemFilter2" className="itemFilter" onChange={() => setGlutenFiltered(false)} />
							<span className="checkmark"></span>
						</label>
					</span>

					<span id="searchName" className="menuFilterCont">
					<h3>Keress név alapján:</h3>
					<input type="text" id="textFilter" onChange={(e) => editSearch(e)} />
				</span>
				<span id="searchNum" className="menuFilterCont">
					<h3>Legyen olcsóbb, mint:</h3>
					<input type="number" id="numberFilter" min={lowestPrice} max={highestPrice}
						value={numberFiltered === "" || numberFiltered > highestPrice ? highestPrice : numberFiltered}
						onChange={(e) => setNumberFiltered(e.target.value)}
						onBlur={() => numberFiltered === "" || numberFiltered < lowestPrice ? setNumberFiltered(highestPrice) : numberFiltered} />
				</span> */}
			</form>
			<div id="admin-listed-reservations">
				{admin.openings &&
					admin.openings.map((item, index) => (
						<div className="admin-listed-opening-item" style={{ color: "white" }} key={index}>
							{JSON.stringify(item)}
						</div>
					))
				}
			</div>
		</div>
	)
}

AdminReservation.propTypes = {
	getAdminReservations: PropTypes.func.isRequired,
	admin: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	admin: state.admin
})

export default connect(mapStateToProps, { getAdminReservations })(AdminReservation);
