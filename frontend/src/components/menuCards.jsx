import React from 'react';

const MenuCards = ({ item, index }) => {

	return (
		<>
			<div id={item + "Button"} className="menuCards" key={index}>
				<img className="iconPic" src={`/img/slides/icon_${item}.png`} alt={item} />
				<span className="iconName">{item === "pizzas" ? "Pizzák" : item === "hamburgers" ? "Hamburgerek" : "Italok"}</span>
			</div>
		</>
	)
}

export default MenuCards
