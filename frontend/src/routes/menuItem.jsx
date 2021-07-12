import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Fade from 'react-reveal/Fade';
import { getMenu, clearMenuData, getMenuItem } from '../redux/actions';
import { useSelector, useDispatch } from 'react-redux';

import Modal from '../components/modal';

const MenuItem = (props) => {
	const [clicked, setClicked] = useState(false);
	const [chosen, setChosen] = useState(1);

	const allData = useSelector(state => state.allData);
	const dispatch = useDispatch();

	const [glutenFiltered, setGlutenFiltered] = useState(null);
	const [nameFiltered, setNameFiltered] = useState([]);
	const [numberFiltered, setNumberFiltered] = useState("");

	useEffect(() => {
		async function loadData() {
			await dispatch(getMenu(props.match.params.id));
			dispatch(getMenuItem(props.match.params.id, chosen));
			if (props.match.params.id === "pizzas" || props.match.params.id === "hamburgers" || props.match.params.id === "drinks") {
				const btn = document.getElementById('resetBtn');
				btn.click();
			}
		}
		loadData()
		return () => {
			dispatch(clearMenuData());
		}
	}, [])

	useEffect(() => {
		dispatch(getMenuItem(props.match.params.id, chosen));
	}, [clicked])

	//Filtered by glutenfree in all cases
	useEffect(() => {
		if (allData.menus) {
			let glutenFilter = allData.menus;
			if (nameFiltered && glutenFiltered !== null && numberFiltered !== "") {
				glutenFilter = glutenFilter.filter(item => {
					return (
						item.glutenfree === glutenFiltered && item.name.toLowerCase().includes(document.getElementById("textFilter").value.toLowerCase()) && item.price <= numberFiltered
					)
				});
				setNameFiltered(glutenFilter);
			} else if (nameFiltered && glutenFiltered !== null) {
				glutenFilter = glutenFilter.filter(item => {
					return (
						item.glutenfree === glutenFiltered && item.name.toLowerCase().includes(document.getElementById("textFilter").value.toLowerCase())
					)
				});
				setNameFiltered(glutenFilter);
			} else if (numberFiltered !== "" && glutenFiltered !== null) {
				glutenFilter = glutenFilter.filter(item => {
					return (
						item.glutenfree === glutenFiltered && item.price <= numberFiltered
					)
				});
				setNameFiltered(glutenFilter);
			} else if (glutenFiltered !== null) {
				glutenFilter = glutenFilter.filter(item => {
					return (
						item.glutenfree === glutenFiltered
					)
				});
				setNameFiltered(glutenFilter);
			}
		}
	}, [glutenFiltered])

	//Filtered by prices in all cases
	useEffect(() => {
		if (allData.menus) {
			let priceArr = [];
			allData.menus.map(item => priceArr.push(item.price));
			let lowestPrice = priceArr.sort()[0];
			let numberFilter = allData.menus;

			if (numberFiltered.length === 0 || numberFiltered <= lowestPrice) {
				if (nameFiltered && glutenFiltered !== null) {
					numberFilter = numberFilter.filter(item => {
						return (
							item.name.toLowerCase().includes(document.getElementById("textFilter").value.toLowerCase()) && item.glutenfree === glutenFiltered
						)
					});
					setNameFiltered(numberFilter);
				} else if (nameFiltered) {
					numberFilter = numberFilter.filter(item => {
						return (
							item.name.toLowerCase().includes(document.getElementById("textFilter").value.toLowerCase())
						)
					});
					setNameFiltered(numberFilter);
				} else if (glutenFiltered !== null) {
					numberFilter = numberFilter.filter(item => {
						return (
							item.glutenfree === glutenFiltered
						)
					});
					setNameFiltered(numberFilter);
				} else {
					setNameFiltered(allData.menus)
				}
			} else if (numberFiltered.length !== 0 && numberFiltered >= lowestPrice) {
				if (nameFiltered && glutenFiltered !== null) {
					numberFilter = numberFilter.filter(item => {
						return (
							item.price <= numberFiltered && item.name.toLowerCase().includes(document.getElementById("textFilter").value.toLowerCase()) && item.glutenfree === glutenFiltered
						)
					});
					setNameFiltered(numberFilter);
				} else if (nameFiltered) {
					numberFilter = numberFilter.filter(item => {
						return (
							item.price <= numberFiltered && item.name.toLowerCase().includes(document.getElementById("textFilter").value.toLowerCase())
						)
					});
					setNameFiltered(numberFilter);
				} else if (glutenFiltered !== null) {
					numberFilter = numberFilter.filter(item => {
						return (
							item.price <= numberFiltered && item.glutenfree === glutenFiltered
						)
					});
					setNameFiltered(numberFilter);
				} else {
					numberFilter = numberFilter.filter(item => {
						return (
							item.price <= numberFiltered
						)
					});
					setNameFiltered(numberFilter);
				}
			}
		}

	}, [numberFiltered])


	if (props.match.params.id !== "pizzas" && props.match.params.id !== "hamburgers" && props.match.params.id !== "drinks") {
		return (
			<div className="notExist">
				<h1>Ez az oldal nem létezik!</h1>
				<Link to="/menu"><button>Visszalépek a menükhöz</button></Link>
			</div>
		)
	}

	function mainTitle(id) {
		if (id === "pizzas") return "Pizzák"
		if (id === "hamburgers") return "Hamburgerek"
		if (id === "drinks") return "Italok"
	}

	function choseItem(boolean, id) {
		setClicked(boolean);
		setChosen(id);
	}

	//Filtered by name in all cases
	const editSearch = (e) => {
		let keywords = e.target.value.toLowerCase();
		let filtered = allData.menus;

		if (keywords.length !== 0 && numberFiltered.length !== 0 && glutenFiltered !== null) {
			filtered = filtered.filter(item => {
				return (
					item.name.toLowerCase().includes(keywords) && item.price <= numberFiltered && item.glutenfree === glutenFiltered
				)
			})
			setNameFiltered(filtered);
		} else if (keywords.length !== 0 && numberFiltered.length !== 0) {
			filtered = filtered.filter(item => {
				return (
					item.name.toLowerCase().includes(keywords) && item.price <= numberFiltered
				)
			})
			setNameFiltered(filtered);
		} else if (keywords.length !== 0 && glutenFiltered !== null) {
			filtered = filtered.filter(item => {
				return (
					item.name.toLowerCase().includes(keywords) && item.glutenfree === glutenFiltered
				)
			})
			setNameFiltered(filtered);
		} else if (keywords.length !== 0) {
			filtered = filtered.filter(item => {
				return (
					item.name.toLowerCase().includes(keywords)
				)
			})
			setNameFiltered(filtered);
		} else if (keywords.length === 0 && numberFiltered.length !== 0 && glutenFiltered !== null) {
			filtered = filtered.filter(item => {
				return (
					item.name.toLowerCase().includes(keywords) && item.price <= numberFiltered && item.glutenfree === glutenFiltered
				)
			})
			setNameFiltered(filtered);
		} else if (keywords.length === 0 && numberFiltered.length !== 0) {
			filtered = filtered.filter(item => {
				return (
					item.name.toLowerCase().includes(keywords) && item.price <= numberFiltered
				)
			})
			setNameFiltered(filtered);
		} else if (keywords.length === 0 && glutenFiltered !== null) {
			filtered = filtered.filter(item => {
				return (
					item.name.toLowerCase().includes(keywords) && item.glutenfree === glutenFiltered
				)
			})
			setNameFiltered(filtered);
		} else if (keywords.length === 0) {
			filtered = filtered.filter(item => {
				return (
					item.name.toLowerCase().includes(keywords) && item.glutenfree === glutenFiltered
				)
			})
			setNameFiltered(allData.menus);
		}
	}

	//reset all filter to default state
	const resetAll = () => {
		let radios = document.querySelectorAll(".itemFilter")
		for (let i = 0; i < radios.length; i++) {
			radios[i].checked = false;
		}
		setGlutenFiltered(null);

		document.getElementById("textFilter").value = "";
		setNameFiltered(allData.menus)

		document.getElementById("numberFilter").value = "";
		setNumberFiltered("");
	}

	let highestPrice = "";
	let lowestPrice = "";
	if (allData.menus) {
		let priceArr = [];
		allData.menus.map(item => priceArr.push(item.price));
		highestPrice = priceArr.sort((a, b) => { return a - b })[priceArr.length - 1];
		lowestPrice = priceArr.sort((a, b) => { return a - b })[0];
	}

	console.log(nameFiltered)

	return (
		<div id="menuItemBG" style={{ background: `url("/img/slides/bg_01.png")` }}>
			<div className="headers"  >
				<h2 className={`headerTitle${props.match.params.id === "hamburgers" ? " responsiveHeader" : ""}`}>
					<Link to="/menu"><img src="/img/slides/backArrow.png" alt="backArrow" /></Link>
					{mainTitle(props.match.params.id)}
				</h2>
			</div>
			<div id="filters">
				{props.match.params.id === "drinks" ?
					null
					: <span id="searchRadios" className="menuFilterCont">
						<h3>Gluténmentes?</h3>
						<div id="radioButtons">
							<label className="container">Igen
								<input type="radio" name="item" id="itemFilter1" className="itemFilter" onChange={() => setGlutenFiltered(true)} />
								<span className="checkmark"></span>
							</label>
							<label className="container">Nem
								<input type="radio" name="item" id="itemFilter2" className="itemFilter" onChange={() => setGlutenFiltered(false)} />
								<span className="checkmark"></span>
							</label>
						</div>
					</span>
				}
				<span id="searchName" className="menuFilterCont">
					<h3>Keress név alapján:</h3>
					<input type="text" id="textFilter" onChange={(e) => editSearch(e)} />
				</span>
				<span id="searchNum" className="menuFilterCont">
					<h3>Legyen olcsóbb, mint:</h3>
					<input type="number" id="numberFilter" min={lowestPrice} max={highestPrice}
						value={numberFiltered === "" || numberFiltered > highestPrice ? highestPrice : numberFiltered}
						onChange={(e) => setNumberFiltered(e.target.value)}
						onBlur={() => numberFiltered === "" || numberFiltered < lowestPrice ? setNumberFiltered(highestPrice) : numberFiltered} />
				</span>
			</div>
			<div id="menuReset">
				<button id="resetBtn" onClick={resetAll}>Szűrők törlése</button>
			</div>
			<div id="menuItemsCont">
				{nameFiltered ?
					nameFiltered.map((item, index) => (
						<Fade key={index} bottom delay={80 * index} distance="80px">
							<div className="littleCards" key={index} onClick={() => choseItem(true, item.id)}>
								{item.glutenfree === true ? <span className="glutenFree">Gluténmentes</span> : null}
								<img className={`cardImages ${props.match.params.id}`} src={`/img/${props.match.params.id}/${item.pic}.png`} alt={item.pic} /> <br />
								<span className="itemName">{item.name}</span><br />
								<div className="itemNamePrice">
									<span>{item.price}{props.match.params.id === "drinks" ? " Ft/dl" : " Ft"}</span>
								</div>
							</div>
						</Fade>
					))
					: null
				}
			</div>
			{ clicked === true ?
				<Modal itemData={allData.unique} type={props.match.params.id} close={() => setClicked} />
				: null}
		</div>
	)
}

export default MenuItem;