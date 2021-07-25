import React, { useState, useEffect } from 'react';
import { getMenu } from '../redux/actions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const AdminMenu = ({ allData, getMenu }) => {
	const [menu, setMenu] = useState("pizzas");

	useEffect(() => {
		getMenu(menu)
	}, [getMenu, menu]);

	const onChange = (e) => setMenu(e.target.value);

	//újat lehet felvenni egy örökösen látható üres formról legalul

	//meglévőt lehet törölni módosítani
	//törlés lehetséges itt is egy törlés gombbal
	//módosításhoz is itt van egy gomb, az átvisz egy egyedi id-s oldalra
	//ott PUT request-el lehet módosítást küldeni

	return (
		<div className="adminBG" style={{ background: `url("/img/slides/bg_01.png")` }}>
			<h1>Menükínálat módosítása</h1>
			<form id='admin-menu-radios'>
				<input type="radio" name="menu" id="pizzas" value="pizzas" onChange={e => onChange(e)} checked={menu === "pizzas"} /> Pizzák
				<input type="radio" name="menu" id="hamburgers" value="hamburgers" onChange={e => onChange(e)} checked={menu === "hamburgers"} /> Hamburgerek
				<input type="radio" name="menu" id="drinks" value="drinks" onChange={e => onChange(e)} checked={menu === "drinks"} /> Italok
			</form>
			<div id="admin-listed-menus">
				{allData.menus &&
					allData.menus.map((item, index) => (
						<div className="admin-listed-menu-item" style={{ color: "white" }} key={index}>
							{JSON.stringify(item)}
						</div>
					))
				}
			</div>
		</div>
	)
};

AdminMenu.propTypes = {
	getMenu: PropTypes.func.isRequired,
	allData: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	allData: state.allData
});

export default connect(mapStateToProps, { getMenu })(AdminMenu);