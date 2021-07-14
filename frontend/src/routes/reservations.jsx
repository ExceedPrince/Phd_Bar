import React, { useState, useEffect } from 'react';
import Fade from 'react-reveal/Fade';
import { getReservations, filterReservations } from '../redux/actions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Reservations = ({ allData, getReservations, filterReservations }) => {
	const [date, setDate] = useState([])

	useEffect(() => {
		getReservations()
	}, [getReservations])

	useEffect(() => {
		filterReservations(date)
	}, [date])

	function resetDateFilter() {
		setDate("");
		document.getElementById("dateFilter").value = "";
	}

	function timeZoneTime() {
		let ending = "";
		let offset = new Date().getTimezoneOffset();
		if (offset < 0) {
			ending = "GMT+00:00";
		} else {
			ending = "GMT-00:00";
		}

		let now = new Date().toString();
		let timeZone = " (" + now.replace(/.*[(](.*)[)].*/, '$1') + ")";
		let today = new Date().toString().replace(timeZone, "").slice(0, -8) + ending;

		return new Date(today);
	}
	let todayFormat = timeZoneTime().toISOString().split('T')[0];

	return (
		<div id="reservationBG" style={{ background: `url("/img/slides/bg_01.png")` }}>
			<div className="headers">
				<h2 className="headerTitle">Aktuális Foglalások</h2>
			</div>
			<div className="formflex-item">
				<span>
					<label htmlFor="date">Szűrés dátum alapján: </label>
					<input type="date" name="date" id="dateFilter" min={todayFormat} onChange={(e) => setDate(e.target.value)} />
				</span>
				<button onClick={resetDateFilter}>Összes foglalás</button>
			</div>
			<div className="reservCont">
				{allData.reserv &&
					allData.reserv.map((item, index) => (
						<Fade key={index} bottom distance="80px">
							<div className="reservCardsOut">
								<div className="reservCardsIn" >
									<span className="cardInfos"><u>Email:</u> {item.email.split("@")[0]}@<wbr />{item.email.split("@")[1]}</span>
									<span className="cardInfos"><u>Vendégek száma:</u> {item.guests}</span>
									<span className="cardInfos"><u>Dátum:</u> {item.date}</span>
									<span className="cardInfos"><u>Időpont:</u> {item.time}</span>
								</div>
							</div>
						</Fade>
					))
				}
			</div>
		</div>
	)
};

Reservations.propTypes = {
	getReservations: PropTypes.func.isRequired,
	filterReservations: PropTypes.func.isRequired,
	allData: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	allData: state.allData
})

export default connect(mapStateToProps, { getReservations, filterReservations })(Reservations);