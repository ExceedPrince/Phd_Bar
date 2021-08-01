import React, { useState, useEffect } from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';
import { getAdminUniqueMenuItem, clearMenuItemData, /*upDateMenuItem */ } from '../redux/actions/admin';
import Alert from '../components/Alert';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const AdminmenuUnique = ({ location: { state: { menu } }, admin, isAuthenticated, getAdminUniqueMenuItem,
	clearMenuItemData, /* upDateMenuItem */ }) => {
	const [imageSrc, setImageSrc] = useState('');

	const { id } = useParams();

	useEffect(() => {
		getAdminUniqueMenuItem(menu, id);

		return () => {
			clearMenuItemData();
		}
	}, [getAdminUniqueMenuItem, id, clearMenuItemData]);

	/* 	const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
	
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
	
		}; */

	if (!isAuthenticated) {
		return <Redirect to='/' />
	};

	return (
		<div className="adminBG" style={{ background: `url("/img/slides/bg_01.png")` }}>
			<Link to="/admin/menu"><img src="/img/slides/backArrow.png" alt="backArrow" /></Link>
			<h1>Menükínálat módosítása</h1>
			{admin.menu &&
				<form id="adminReservationUniqueForm" /* onSubmit={e => onSubmit(e)} */>
					<label htmlFor="name">Név:</label> <br />
					<input type="text" name="name" defaultValue={admin.menu.name} /* onChange={e => onChange(e)} */ placeholder={admin.menu.name} /> <br />
					<label htmlFor="price">Ár: {menu === "drinks" ? "(Ft/dl)" : "(Ft)"}</label> <br />
					<input type="number" name="price" defaultValue={admin.menu.price} /* onChange={e => onChange(e)} */ placeholder={admin.menu.price} /> <br />
					<label htmlFor="safe">{menu === "drinks" ? "Alkoholmentes:" : "Gluténmentes:"}</label> <br />
					<input type="text" name="safe" defaultValue={admin.menu.safe.toString()} /* onChange={e => onChange(e)} */ placeholder={admin.menu.safe.toString()} /> <br />
					{menu !== "drinks" && (
						<>
							<label htmlFor="ingedients">Összetevők:</label> <br />
							<input type="text" name="ingedients" defaultValue={admin.menu.ingredients.join(", ")} /* onChange={e => onChange(e)} */ placeholder={admin.menu.ingredients} /> <br />
						</>)}
					{menu !== "drinks" && (
						<>
							<label htmlFor="ingedients">Allergének:</label> <br />
							<input type="text" name="ingedients" defaultValue={admin.menu.allergens.join(", ")} /* onChange={e => onChange(e)} */ placeholder={admin.menu.allergens} /> <br />
						</>)}
					<label htmlFor="id">Azonosító:</label> <br />
					<input type="number" name="id" defaultValue={admin.menu.id} /* onChange={e => onChange(e)} */ /> <br />
					<label htmlFor="file">Képfeltöltés: (csak .png, max. 500px széles)</label>
					<div id="file-upload">
						<input type="file" name="file" onChange={e => setImageSrc(URL.createObjectURL(e.target.files[0]))} placeholder={""} /> <br />
						<img src={imageSrc === '' ? `/img/${menu}/${admin.menu.pic}.png` : imageSrc} alt="" />
					</div>
					<input type="submit" value="Adatok módosítása" />
				</form>
			}
			<Alert />
		</div>
	)
};

AdminmenuUnique.propTypes = {
	getAdminUniqueMenuItem: PropTypes.func.isRequired,
	clearMenuItemData: PropTypes.func.isRequired,
	/* 		upDateMenuItem: PropTypes.func.isRequired, */
	admin: PropTypes.object.isRequired,
	isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
	admin: state.admin,
	isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, { getAdminUniqueMenuItem, clearMenuItemData,/* upDateMenuItem */ })(AdminmenuUnique);
