import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { getMenu } from '../redux/actions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const AdminMenu = ({ allData, getMenu, isAuthenticated }) => {
	const [menu, setMenu] = useState("pizzas");

	useEffect(() => {
		getMenu(menu)
	}, [getMenu, menu]);


	//újat lehet felvenni egy örökösen látható üres formról legalul
	//típusváltásnál a kereső mező stringje legyen ''
	//meglévőt lehet törölni módosítani
	//törlés lehetséges itt is egy törlés gombbal
	//módosításhoz is itt van egy gomb, az átvisz egy egyedi id-s oldalra
	//ott PUT request-el lehet módosítást küldeni

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
					<span className="checkmark" onClick={() => setMenu("pizzas")}></span>
				</label>
				<label htmlFor="menu" className="container">Hamburgerek:
					<input type="radio" name="menu" id="hamburgers" checked={menu === "hamburgers"} />
					<span className="checkmark" onClick={() => setMenu("hamburgers")}></span>
				</label>
				<label htmlFor="menu" className="container">Italok:
					<input type="radio" name="menu" id="drinks" checked={menu === "drinks"} />
					<span className="checkmark" onClick={() => setMenu("drinks")}></span>
				</label>
			</form>
			<div id="admin-menu-name-filter" >
				<h3>Keresés név alapján:</h3>
				<input type="text" name="name" /* value={email} onChange={e => setFormData({ ...formData, email: e.target.value })} */ />
			</div>
			<div id="adminNewMenuItem">
				<button>új terméket veszek fel</button>
			</div>
			<div id="admin-listed-menus">
				{allData.menus &&
					allData.menus.map((item, index) => (
						<>
							<div className="admin-listed-menu-item" style={{ color: "white" }} key={index}>
								<span>{item.name}</span>
								<span>{item.price} {menu === "drinks" ? "Ft/dl" : "Ft"}</span>
								<span style={{ textAlign: "center" }}>{menu === "drinks" ?
									item.safe === true ? "alkoholmentes" : <i class="fa fa-beer"></i>
									: item.safe === true ? "gluténmentes" : <i class="fa fa-ban"></i>}</span>
								{item.ingredients ? <span><u>Összetevők:</u> {item.ingredients.join(', ')}</span> : null}
								{item.allergens ? <span><u>Allergének:</u> {item.allergens.join(', ')}</span> : null}
								<span>
									<Link to={`/admin/menu/${item._id}`} >
										<button><i class="fa fa-edit"></i></button>
									</Link>
									<button /*onClick={() => deleteReservation(item._id)}*/ ><i class="fa fa-trash"></i></button>
								</span>
							</div>
							<hr />
						</>
					))
				}
			</div>
		</div>
	)
};

AdminMenu.propTypes = {
	getMenu: PropTypes.func.isRequired,
	allData: PropTypes.object.isRequired,
	isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
	allData: state.allData,
	isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { getMenu })(AdminMenu);