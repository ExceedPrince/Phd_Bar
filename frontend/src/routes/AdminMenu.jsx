import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { getMenu, clearMenuData } from '../redux/actions';
import { adminFilterMenu, deleteMenuItem } from '../redux/actions/admin';
import Alert from '../components/Alert';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const AdminMenu = ({ allData, getMenu, clearMenuData, adminFilterMenu, isAuthenticated, deleteMenuItem }) => {
	const [menu, setMenu] = useState("pizzas");
	const [filtered, setFiltered] = useState("");

	useEffect(() => {
		getMenu(menu);

		return () => {
			clearMenuData()
		}
	}, [getMenu, menu, clearMenuData]);

	useEffect(() => {
		let formData = { name: filtered, type: menu }
		adminFilterMenu(formData)
	}, [filtered, adminFilterMenu])



	//újat lehet felvenni egy örökösen látható üres formról legalul


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
				<button>új terméket veszek fel</button>
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
	getMenu: PropTypes.func.isRequired,
	clearMenuData: PropTypes.func.isRequired,
	adminFilterMenu: PropTypes.func.isRequired,
	deleteMenuItem: PropTypes.func.isRequired,
	allData: PropTypes.object.isRequired,
	isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
	allData: state.allData,
	isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { getMenu, clearMenuData, adminFilterMenu, deleteMenuItem })(AdminMenu);