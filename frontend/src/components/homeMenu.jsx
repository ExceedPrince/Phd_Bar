import React, { useState, useEffect } from 'react';
import Fade from 'react-reveal/Fade';
import { getMenu } from '../redux/actions';
import { useSelector, useDispatch } from 'react-redux';

import MenuCards from '../components/menuCards';;

const HomeMenu = () => {
	const [menu, setMenu] = useState("pizzas");

	const allData = useSelector(state => state.allData);
	const dispatch = useDispatch();


	useEffect(() => {
		dispatch(getMenu(menu))
	}, [])

	useEffect(() => {
		dispatch(getMenu(menu))
	}, [menu])

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
}

export default HomeMenu;
