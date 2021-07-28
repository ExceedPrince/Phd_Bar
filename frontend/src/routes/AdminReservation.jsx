import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminReservations, deleteReservation } from '../redux/actions/admin';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const AdminReservation = ({ admin, getAdminReservations, deleteReservation }) => {

	useEffect(() => {
		getAdminReservations()
	}, [getAdminReservations])

	if (admin.reservations) {
		console.log(admin.reservations)
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
				{admin.reservations &&
					admin.reservations.map((item, index) => (
						<>
							<div className="admin-listed-reservation-item" key={index}>
								<span>{item.date}</span>
								<span>{item.time}</span>
								<span>{item.name}</span>
								<span>{item.email.split('@')[0]}<wbr />@{item.email.split('@')[1]}</span>
								<span>{item.guests} (fő)</span>
								<span>{item.isValiated ? "Validálva" : "Nincs validálva"}</span>
								<span>Kód: {item.code}</span>
								<span>
									<Link to={`/admin/reservation/${item._id}`} >
										<button><i class="fa fa-edit"></i></button>
									</Link>
									<button onClick={() => deleteReservation(item._id)} ><i class="fa fa-trash"></i></button>
								</span>
							</div>
							<hr />
						</>
					))
				}
			</div>
		</div>
	)
}

AdminReservation.propTypes = {
	getAdminReservations: PropTypes.func.isRequired,
	deleteReservation: PropTypes.func.isRequired,
	admin: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	admin: state.admin
})

export default connect(mapStateToProps, { getAdminReservations, deleteReservation })(AdminReservation);
