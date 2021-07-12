import React, { useState } from 'react';
import Fade from 'react-reveal/Fade';
import styled from 'styled-components';

const OpeningSection = ({ allData }) => {

	const [clicked, setClicked] = useState(false);
	const [openClose, setOpenClose] = useState("");
	const [counter, setCounter] = useState("");
	const [bg, setBg] = useState("");

	const OpenDiv = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 0 10px;
	width: 100%;
	padding: 2% 0;
	background-color: ${bg};
	font-size: 25px;
	font-weight: 700;
	`;

	//Give a "0" to short numbers
	function checkTime(num) {
		if (num < 10) {
			return num = "0" + num;
		} else {
			return num
		}
	}

	//Write out the countdown in every seconds
	function startTime(deadline) {
		let today = new Date();
		let hour = today.getHours();
		let min = today.getMinutes();
		let sec = today.getSeconds();

		console.log(deadline, hour)

		setCounter(checkTime(deadline - hour) + ":" + checkTime(59 - min) + ":" + checkTime(59 - sec));
		setTimeout(function () {
			startTime(deadline);
		}, 1000);
	}

	//Checking opening hours and call the countdown
	function openSection(open, close, nextOpen) {
		let today = new Date()
		let hour = today.getHours();

		if (open === null && close === null) {
			setBg("#a31818");
			setOpenClose("Ma zárva vagyunk!");
		} else {
			if (open - hour > 1) {
				startTime(open - 1);
				setBg("#a31818");
				setOpenClose(" múlva nyitunk!");
			} else if (open - hour === 1) {
				startTime(open - 1);
				setBg("#eb8a1a");
				setOpenClose(" múlva nyitunk!");
			} else if (hour >= open && close - hour > 1) {
				startTime(close - 1);
				setBg("green");
				setOpenClose(" múlva zárunk!");
			} else if (hour >= open && close - hour === 1) {
				startTime(close - 1);
				setBg("#eb8a1a");
				setOpenClose(" múlva zárunk!");
			} else if (hour >= close && nextOpen === null) {
				setBg("#a31818");
				setOpenClose("Hétfő reggel nyitunk!");
			} else if (hour >= close && nextOpen !== null) {
				startTime(hour + (23 - hour) + nextOpen);
				setBg("#a31818");
				setOpenClose(" múlva nyitunk");
			}
		}
	}

	//Call and pass this day's and next day's open-close data
	function openingBtn() {
		setClicked(true);

		let today = new Date();
		let todayIndex = today.getDay();
		let thisDay = "";
		let nextDay = "";

		if (allData.openings) {
			thisDay = allData.openings.filter(day => day.index === todayIndex)[0];
			if (todayIndex === 6) {
				nextDay = allData.openings.filter(day => day.index === 0)[0];
				openSection(thisDay.open[0], thisDay.close[0], nextDay.open);
			} else if (todayIndex === 0) {
				nextDay = allData.openings.filter(day => day.index === todayIndex + 1)[0];
				openSection(thisDay.open, thisDay.close, nextDay.open[0]);
			} else {
				nextDay = allData.openings.filter(day => day.index === todayIndex + 1)[0];
				openSection(thisDay.open[0], thisDay.close[0], nextDay.open[0]);
			}
		}
	}

	return (
		<>
			<Fade left>
				<h2>Nyitvatartásunk:</h2>
			</Fade>
			<div id="downerhalfInner">
				<div id="openingList">
					{allData.openings ?
						allData.openings.map((item, index) => (
							<Fade key={index} bottom delay={80 * index} distance="80px">
								<div className="uniqueDays" key={index}>
									<span className="openingDay">{item.day}: </span>
									<span>
										{item.open !== null && String(item.open[0]).length === 1 ? "0" + item.open.join(":") + "0 - " + item.close.join(":") + "0"
											: item.open !== null && String(item.open[0]).length === 2 ? item.open.join(":") + "0 - " + item.close.join(":") + "0"
												: "Zárva"}
									</span>
								</div>
							</Fade>
						))
						: null}
				</div>
				<Fade bottom delay={100} distance="80px">
					<div id="actualOpening">
						<h3>Kíváncsi vagy aktuális nyitvatartásunkra? <br />Kattints az alábbi gombra!</h3>
						<button onClick={openingBtn}>Nyitva vagytok most?</button>
						{clicked ?
							<Fade right distance="80px">
								<OpenDiv className="openDiv">
									<span>{counter}</span><span>{openClose}</span>
								</OpenDiv>
							</Fade>
							: null}
					</div>
				</Fade>
			</div>
		</>
	)
}

export default OpeningSection
