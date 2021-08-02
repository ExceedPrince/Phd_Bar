import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { getAdminReservations, deleteReservation, adminFilterReservation } from '../redux/actions/admin';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const AdminReservation = ({ admin, isAuthenticated, getAdminReservations, deleteReservation, adminFilterReservation }) => {
	const [formData, setFormData] = useState({ date: "", name: "", email: "" });

	const { date, name, email } = formData;

	useEffect(() => {
		getAdminReservations()
	}, [getAdminReservations])

	useEffect(() => {
		adminFilterReservation(formData)
	}, [formData]);

	if (!isAuthenticated) {
		return <Redirect to='/' />
	}

	return (
		<div className="adminBG" style={{ background: `url("/img/slides/bg_01.png")` }}>
			<Link to="/admin"><img src="/img/slides/backArrow.png" alt="backArrow" /></Link>
			<h1>Asztalfoglalások módosítása</h1>
			<div id="adminSearchReservation" className="menuFilterCont">
				<span id="radioButtons">
					<h3>Dátum:</h3>
					<input type="date" name="date" value={date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
				</span>
				<span id="searchName" className="menuFilterCont">
					<h3>Foglaló neve:</h3>
					<input type="text" name="name" value={name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
				</span>
				<span id="searchNum" className="menuFilterCont">
					<h3>Foglaló email címe:</h3>
					<input type="text" name="email" value={email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
				</span>
			</div>
			<div id="adminSearchReservationReset">
				<button onClick={() => setFormData({ date: "", name: "", email: "" })}>Szűrők törlése</button>
			</div>
			<div id="admin-listed-reservations">
				{admin.reservations &&
					admin.reservations.map((item, index) => (
						<div key={index}>
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
										<button><i className="fa fa-edit"></i></button>
									</Link>
									<button onClick={() => deleteReservation(item._id)} ><i className="fa fa-trash"></i></button>
								</span>
							</div>
							<hr />
						</div>
					))
				}
			</div>
		</div>
	)
}

AdminReservation.propTypes = {
	getAdminReservations: PropTypes.func.isRequired,
	deleteReservation: PropTypes.func.isRequired,
	adminFilterReservation: PropTypes.func.isRequired,
	admin: PropTypes.object.isRequired,
	isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
	admin: state.admin,
	isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, { getAdminReservations, deleteReservation, adminFilterReservation })(AdminReservation);
