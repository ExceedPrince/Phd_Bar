import React, { useState, useEffect } from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';
import { getAdminUniqueReservation, clearReservationData, upDateReservation } from '../redux/actions/admin';
import Alert from '../components/Alert';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const AdminReservationUnique = ({ match, admin, isAuthenticated, getAdminUniqueReservation, clearReservationData, upDateReservation }) => {
	const [formData, setFormData] = useState({ name: '', email: '', date: '', time: '', guests: '', isValiated: '', code: '' })

	const { name, email, date, time, guests, isValiated, code } = formData;

	const { id } = useParams();

	useEffect(() => {
		getAdminUniqueReservation(id);

		return () => {
			clearReservationData()
		}
	}, [getAdminUniqueReservation, match.params.id, clearReservationData])

	const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

	const onSubmit = (e) => {
		e.preventDefault();

		let formData = {
			id: admin.reservation._id,
			name: name || admin.reservation.name,
			email: email || admin.reservation.email,
			date: date || admin.reservation.date,
			time: time || admin.reservation.time,
			guests: guests || admin.reservation.guests,
			isValiated: isValiated || admin.reservation.isValiated.toString(),
			code: code || admin.reservation.code
		}

		upDateReservation(formData, admin.reservation._id);

	};


	if (!isAuthenticated) {
		return <Redirect to='/' />
	}

	return (
		<div className="adminBG" style={{ background: `url("/img/slides/bg_01.png")` }}>
			<Link to="/admin/reservation"><img src="/img/slides/backArrow.png" alt="backArrow" /></Link>
			<h1>Egyedi asztalfoglalás módosítása</h1>
			{admin.reservation &&
				<form id="adminReservationUniqueForm" onSubmit={e => onSubmit(e)}>
					<label htmlFor="name">Név:</label> <br />
					<input type="text" name="name" defaultValue={admin.reservation.name} onChange={e => onChange(e)} placeholder={admin.reservation.name} /> <br />
					<label htmlFor="email">Email:</label> <br />
					<input type="email" name="email" defaultValue={admin.reservation.email} onChange={e => onChange(e)} placeholder={admin.reservation.email} /> <br />
					<label htmlFor="date">Dátum:</label> <br />
					<input type="text" name="date" defaultValue={admin.reservation.date} onChange={e => onChange(e)} placeholder={admin.reservation.date} /> <br />
					<label htmlFor="time">Időpont:</label> <br />
					<input type="text" name="time" defaultValue={admin.reservation.time} onChange={e => onChange(e)} placeholder={admin.reservation.time} /> <br />
					<label htmlFor="guests">Vendégek száma:</label> <br />
					<input type="number" name="guests" defaultValue={admin.reservation.guests} onChange={e => onChange(e)} placeholder={admin.reservation.guests} /> <br />
					<label htmlFor="isValiated">Státusz:</label> <br />
					<input type="text" name="isValiated" defaultValue={admin.reservation.isValiated.toString()} onChange={e => onChange(e)} placeholder={admin.reservation.isValiated.toString()} /> <br />
					<label htmlFor="code">Kód:</label> <br />
					<input type="text" name="code" defaultValue={admin.reservation.code} onChange={e => onChange(e)} placeholder={admin.reservation.code} /> <br />
					<input type="submit" value="Adatok módosítása" />
				</form>
			}
			<Alert />
		</div>
	)
}

AdminReservationUnique.propTypes = {
	getAdminUniqueReservation: PropTypes.func.isRequired,
	clearReservationData: PropTypes.func.isRequired,
	upDateReservation: PropTypes.func.isRequired,
	admin: PropTypes.object.isRequired,
	isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
	admin: state.admin,
	isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, { getAdminUniqueReservation, clearReservationData, upDateReservation })(AdminReservationUnique);
