import React, { useState, useEffect } from 'react';
import Fade from 'react-reveal/Fade';
import { getMenuNoImg } from '../redux/actions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import MenuCards from '../components/menuCards';;

const HomeMenu = ({ allData, getMenuNoImg }) => {
	const [menu, setMenu] = useState("pizzas");

	useEffect(() => {
		getMenuNoImg(menu)
	}, [getMenuNoImg, menu])

	const options = ["pizzas", "hamburgers", "drinks"]

	return (
		<>
			<div id="homeMenuCont">
				<div className="chooseMenuCont">
					{
						options.map((item, index) => (
							<Fade key={index} bottom delay={200 * index} distance="100px">
								<span onClick={() => setMenu(item)} >
									<MenuCards item={item} index={index} />
								</span>
							</Fade>
						))
					}
				</div>
				<div id="TwoColMenu">
					<div id="leftCol">
						{allData.menus ?
							allData.menus.slice(0, Math.ceil(allData.menus.length / 2)).map((item, index) => (
								<div className="innerMenu" key={index}>
									<span>{item.name}</span>
									<span><b>{item.price}{menu === "drinks" ? " Ft/dl" : " Ft"}</b></span>
								</div>
							))
							: null}
					</div>
					<div id="rightCol">
						{allData.menus && allData.menus.length % 2 === 0 ?
							allData.menus.slice(-Math.ceil(allData.menus.length / 2)).map((item, index) => (
								<div className="innerMenu" key={index}>
									<span>{item.name}</span>
									<span><b>{item.price}{menu === "drinks" ? " Ft/dl" : " Ft"}</b></span>
								</div>
							))
							: allData.menus && allData.menus.length % 2 !== 0 ?
								allData.menus.slice(-(Math.ceil(allData.menus.length / 2) - 1)).map((item, index) => (
									<div className="innerMenu" key={index}>
										<span>{item.name}</span>
										<span><b>{item.price}{menu === "drinks" ? " Ft/dl" : " Ft"}</b></span>
									</div>
								))
								: null}
					</div>
				</div>
			</div>
		</>
	)
};

HomeMenu.propTypes = {
	getMenuNoImg: PropTypes.func.isRequired,
	allData: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	allData: state.allData
});

export default connect(mapStateToProps, { getMenuNoImg })(HomeMenu);
