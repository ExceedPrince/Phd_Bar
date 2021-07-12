import React from 'react';
import Fade from 'react-reveal/Fade';
import { Link } from 'react-router-dom';

import MenuCards from '../components/menuCards';

const Menu = () => {
	const options = ["pizzas", "hamburgers", "drinks"]

	return (
		<div id="menuBG" style={{ background: `url("/img/slides/bg_01.png")` }}>
			<div className="headers">
				<h2 className="headerTitle">Kínálataink</h2>
			</div>
			<div className="menuOptionsCont">
				{
					options.map((item, index) => (
						<Fade key={index} bottom delay={200 * index} distance="80px">
							<Link key={index} to={`/menu/${item}`}>
								<MenuCards item={item} index={index} />
							</Link>
						</Fade>
					))
				}
			</div>
		</div>
	)
}

export default Menu;