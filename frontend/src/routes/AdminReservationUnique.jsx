import React, { useState, useEffect } from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';
import { getAdminUniqueReservation, clearReservationData } from '../redux/actions/admin';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const AdminReservationUnique = ({ match, admin, isAuthenticated, getAdminUniqueReservation, clearReservationData }) => {
	const [formData, setFormData] = useState({ name: '', email: '', date: '', time: '', guests: '', isValiated: '', code: '' })

	const { name, email, date, time, guests, isValiated, code } = formData;

	useEffect(() => {
		getAdminUniqueReservation(match.params.id);

		return () => {
			clearReservationData()
		}

	}, [getAdminUniqueReservation, match.params.id, clearReservationData])

	const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

	const onclick = () => {
		let formData = {
			name: name || admin.reservation.name,
			email: email || admin.reservation.email,
			date: date || admin.reservation.date,
			time: time || admin.reservation.time,
			guests: guests || admin.reservation.guests,
			isValiated: isValiated || admin.reservation.isValiated.toString(),
			code: code || admin.reservation.code
		}

		console.log(formData)

	};


	if (!isAuthenticated) {
		return <Redirect to='/' />
	}

	return (
		<div>
			<Link to="/admin/reservation"><img src="/img/slides/backArrow.png" alt="backArrow" /></Link>
			{match.params.id} <br />
			{JSON.stringify(admin.reservation)} <br />
			{admin.reservation &&
				<>
					<input type="text" name="name" defaultValue={admin.reservation.name} onChange={e => onChange(e)} placeholder={admin.reservation.name} /> <br />
					<input type="email" name="email" defaultValue={admin.reservation.email} onChange={e => onChange(e)} placeholder={admin.reservation.email} /> <br />
					<input type="text" name="date" defaultValue={admin.reservation.date} onChange={e => onChange(e)} placeholder={admin.reservation.date} /> <br />
					<input type="text" name="time" defaultValue={admin.reservation.time} onChange={e => onChange(e)} placeholder={admin.reservation.time} /> <br />
					<input type="number" name="guests" defaultValue={admin.reservation.guests} onChange={e => onChange(e)} placeholder={admin.reservation.guests} /> <br />
					<input type="text" name="isValiated" defaultValue={admin.reservation.isValiated.toString()} onChange={e => onChange(e)} placeholder={admin.reservation.isValiated.toString()} /> <br />
					<input type="text" name="code" defaultValue={admin.reservation.code} onChange={e => onChange(e)} placeholder={admin.reservation.code} /> <br />
					<button onClick={onclick}>gomb</button>
				</>
			}
		</div>
	)
}

AdminReservationUnique.propTypes = {
	getAdminUniqueReservation: PropTypes.func.isRequired,
	clearReservationData: PropTypes.func.isRequired,
	admin: PropTypes.object.isRequired,
	isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
	admin: state.admin,
	isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, { getAdminUniqueReservation, clearReservationData })(AdminReservationUnique);
