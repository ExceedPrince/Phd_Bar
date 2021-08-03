import React, { useState, useEffect } from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';
import { getAdminUniqueMenuItem, clearMenuItemData, updateMenuItem } from '../redux/actions/admin';
import Alert from '../components/Alert';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const AdminmenuUnique = ({ location: { state: { menu } }, admin, isAuthenticated, getAdminUniqueMenuItem,
	clearMenuItemData, updateMenuItem }) => {
	const [imageSrc, setImageSrc] = useState('');
	const [inputs, setInputs] = useState({ name: '', price: '', safe: '', ingredients: '', allergens: '', itemId: '', picture: '' })

	const { name, price, safe, ingredients, allergens, itemId, picture } = inputs;

	const { id } = useParams();

	useEffect(() => {
		getAdminUniqueMenuItem(menu, id);

		return () => {
			clearMenuItemData();
		}
	}, [getAdminUniqueMenuItem, id, clearMenuItemData]);

	const onChange = (e) => setInputs({ ...inputs, [e.target.name]: e.target.value });

	const onSubmit = async (e) => {
		e.preventDefault();

		const formData = new FormData();
		formData.append('id', name || admin.menu._id);
		formData.append('name', name || admin.menu.name);
		formData.append('price', +price || admin.menu.price);
		formData.append('safe', safe || admin.menu.safe);
		if (menu === "drinks") {
			formData.append('ingredients', " ");
			formData.append('allergens', " ");
		} else {
			formData.append('ingredients', ingredients || admin.menu.ingredients);
			formData.append('allergens', allergens || admin.menu.allergens);
		}
		formData.append('itemId', admin.menu.id);
		if (picture !== "") {
			formData.append('picture', picture, picture.name);
		}

		await updateMenuItem(menu, formData);

		return false;
	};

	if (!isAuthenticated) {
		return <Redirect to='/' />
	};

	return (
		<div className="adminBG" style={{ background: `url("/img/slides/bg_01.png")` }}>
			<Link to="/admin/menu"><img src="/img/slides/backArrow.png" alt="backArrow" /></Link>
			<h1>Menükínálat módosítása</h1>
			{admin.menu &&
				<form id="adminReservationUniqueForm" onSubmit={e => onSubmit(e)} >
					<label htmlFor="name">Név:</label> <br />
					<input type="text" name="name" defaultValue={admin.menu.name} onChange={e => onChange(e)} placeholder={admin.menu.name} /> <br />
					<label htmlFor="price">Ár: {menu === "drinks" ? "(Ft/dl)" : "(Ft)"}</label> <br />
					<input type="number" name="price" defaultValue={admin.menu.price} onChange={e => onChange(e)} placeholder={admin.menu.price} /> <br />
					<label htmlFor="safe">{menu === "drinks" ? "Alkoholmentes:" : "Gluténmentes:"}</label> <br />
					<input type="text" name="safe" defaultValue={admin.menu.safe.toString()} onChange={e => onChange(e)} placeholder={admin.menu.safe.toString()} /> <br />
					{menu !== "drinks" && (
						<>
							<label htmlFor="ingedients">Összetevők:</label> <br />
							<input type="text" name="ingedients" defaultValue={admin.menu.ingredients.join(", ")} onChange={e => onChange(e)} placeholder={admin.menu.ingredients} /> <br />
						</>)}
					{menu !== "drinks" && (
						<>
							<label htmlFor="ingedients">Allergének:</label> <br />
							<input type="text" name="ingedients" defaultValue={admin.menu.allergens.join(", ")} onChange={e => onChange(e)} placeholder={admin.menu.allergens} /> <br />
						</>)}
					<label htmlFor="itemId">Azonosító:</label> <br />
					<input type="number" name="itemId" defaultValue={admin.menu.id} onChange={e => onChange(e)} placeholder={admin.menu.id} readOnly /> <br />
					<label htmlFor="file">Képfeltöltés: (csak .png, maximum 1 MB)</label>
					<div id="file-upload">
						<input type="file" name="file" accept="image/png" onChange={e => { setInputs({ ...inputs, picture: e.target.files[0] }); setImageSrc(URL.createObjectURL(e.target.files[0])) }} /> <br />
						<img src={imageSrc === '' ? `data:image/gif;base64,${admin.menu.picURL}` : imageSrc} alt="" />
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
	updateMenuItem: PropTypes.func.isRequired,
	admin: PropTypes.object.isRequired,
	isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
	admin: state.admin,
	isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, { getAdminUniqueMenuItem, clearMenuItemData, updateMenuItem })(AdminmenuUnique);
