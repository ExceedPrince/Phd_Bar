import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { getMenuNoImg, clearMenuData } from '../redux/actions';
import { adminFilterMenu, deleteMenuItem, postNewMenuItem } from '../redux/actions/admin';
import Alert from '../components/Alert';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const AdminMenu = ({ allData, getMenuNoImg, clearMenuData, adminFilterMenu, isAuthenticated,
	deleteMenuItem, postNewMenuItem }) => {
	const [menu, setMenu] = useState("pizzas");
	const [filtered, setFiltered] = useState("");
	const [show, setShow] = useState(false);
	const [imageSrc, setImageSrc] = useState('');
	const [inputs, setInputs] = useState({ name: '', price: '', safe: '', ingredients: '', allergens: '', id: '', picture: '' });

	const { name, price, safe, ingredients, allergens, id, picture } = inputs;

	useEffect(() => {
		getMenuNoImg(menu);

		return () => {
			clearMenuData()
		}
	}, [getMenuNoImg, menu, clearMenuData]);

	useEffect(() => {
		let formData = { name: filtered, type: menu }
		adminFilterMenu(formData)
	}, [filtered, adminFilterMenu]);

	const onChange = (e) => setInputs({ ...inputs, [e.target.name]: e.target.value });

	const onSubmit = async (e) => {
		e.preventDefault();

		const formData = new FormData();
		formData.append('name', name);
		formData.append('price', +price);
		formData.append('safe', safe);
		if (menu === "drinks") {
			formData.append('ingredients', " ");
			formData.append('allergens', " ");
		} else {
			formData.append('ingredients', ingredients);
			formData.append('allergens', allergens);
		}
		formData.append('id', +id);
		formData.append('picture', picture, picture.name);

		console.log(picture)

		await postNewMenuItem(menu, formData, setShow, setInputs);

		return false;
	};


	if (!isAuthenticated) {
		return <Redirect to='/' />
	}


	return (
		<div className="adminBG" style={{ background: `url("/img/slides/bg_01.png")` }}>
			<Link to="/admin"><img src="/img/slides/backArrow.png" alt="backArrow" /></Link>
			<h1>Menükínálat módosítása</h1>
			<form id='admin-menu-radios'>
				<label htmlFor="menu" className="container">Pizzák:
					<input type="radio" name="menu" id="pizzas" checked={menu === "pizzas"} />
					<span className="checkmark" onClick={() => { setMenu("pizzas"); setFiltered('') }}></span>
				</label>
				<label htmlFor="menu" className="container">Hamburgerek:
					<input type="radio" name="menu" id="hamburgers" checked={menu === "hamburgers"} />
					<span className="checkmark" onClick={() => { setMenu("hamburgers"); setFiltered('') }}></span>
				</label>
				<label htmlFor="menu" className="container">Italok:
					<input type="radio" name="menu" id="drinks" checked={menu === "drinks"} />
					<span className="checkmark" onClick={() => { setMenu("drinks"); setFiltered('') }}></span>
				</label>
			</form>
			<div id="admin-menu-name-filter" >
				<h3>Keresés név alapján:</h3>
				<input type="text" name="name" value={filtered} onChange={e => setFiltered(e.target.value)} />
			</div>
			<div id="adminNewMenuItem">
				<button onClick={() => setShow(!show)}>{!show ? "Új terméket veszek fel" : "Inkább mégsem"}</button>
				{show && (
					<form onSubmit={e => onSubmit(e)}>
						<div className="adminNewMenuPostContainer">
							<span>
								<label htmlFor="name">Név:</label> <br />
								<input type="text" name="name" value={name} onChange={e => onChange(e)} /> <br />
							</span>
							<span>
								<label htmlFor="price">Ár: {menu === "drinks" ? "(Ft/dl)" : "(Ft)"}</label> <br />
								<input type="number" name="price" min={90} value={price} onChange={e => onChange(e)} /> <br />
							</span>
						</div>
						<div className="adminNewMenuPostContainer">
							<span>
								<label htmlFor="safe">{menu === "drinks" ? "Alkoholmentes:" : "Gluténmentes:"}</label> <br />
								<input type="text" name="safe" value={safe} onChange={e => onChange(e)} placeholder="true / false" /> <br />
							</span>
							{menu !== "drinks" && (
								<span>
									<label htmlFor="ingedients">Összetevők:</label> <br />
									<input type="text" name="ingredients" value={ingredients} onChange={e => onChange(e)} placeholder="Pl.: hagyma, só, sajt..." /> <br />
								</span>)}
							{menu !== "drinks" && (
								<span>
									<label htmlFor="ingedients">Allergének:</label> <br />
									<input type="text" name="allergens" value={allergens} onChange={e => onChange(e)} placeholder="Pl.: tej, liszt..." /> <br />
								</span>)}
						</div>
						<div className="adminNewMenuPostContainer">
							<span>
								<label htmlFor="id">Azonosító:</label> <br />
								<input type="number" name="id" value={id} onChange={e => onChange(e)} /> <br />
							</span>
							<span>
								<label htmlFor="file">Képfeltöltés: <br /> (csak .png, maximum 1 MB)</label> <br />
								<input type="file" name="picture" accept="image/png" onChange={e => { setInputs({ ...inputs, picture: e.target.files[0] }); setImageSrc(URL.createObjectURL(e.target.files[0])) }} required /> <br />
							</span>
						</div>
						<div>
							<img src={imageSrc} alt="" />
						</div>
						<input type="submit" value="Feltöltés" />
					</form>
				)}
			</div>
			<Alert />
			<div id="admin-listed-menus">
				{allData.menus &&
					allData.menus.map((item, index) => (
						<div key={index}>
							<div className="admin-listed-menu-item" style={{ color: "white" }} >
								<span>{item.name}</span>
								<span>{item.price} {menu === "drinks" ? "Ft/dl" : "Ft"}</span>
								<span style={{ textAlign: "center" }}>{menu === "drinks" ?
									item.safe === true ? "alkoholmentes" : <i className="fa fa-beer"></i>
									: item.safe === true ? "gluténmentes" : <i className="fa fa-ban"></i>}</span>
								{item.ingredients ? <span><u>Összetevők:</u> {item.ingredients.join(', ')}</span> : null}
								{item.allergens ? <span><u>Allergének:</u> {item.allergens.join(', ')}</span> : null}
								<span>
									<Link to={{ pathname: `/admin/menu/${item._id}`, state: { menu } }} >
										<button><i className="fa fa-edit"></i></button>
									</Link>
									<button onClick={() => deleteMenuItem(menu, item._id)} ><i className="fa fa-trash"></i></button>
								</span>
							</div>
							<hr />
						</div>
					))
				}
			</div>
		</div>
	)
};

AdminMenu.propTypes = {
	getMenuNoImg: PropTypes.func.isRequired,
	clearMenuData: PropTypes.func.isRequired,
	adminFilterMenu: PropTypes.func.isRequired,
	deleteMenuItem: PropTypes.func.isRequired,
	postNewMenuItem: PropTypes.func.isRequired,
	allData: PropTypes.object.isRequired,
	isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
	allData: state.allData,
	isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, {
	getMenuNoImg, clearMenuData, adminFilterMenu, deleteMenuItem, postNewMenuItem
})(AdminMenu);