import React, { useState, useEffect } from 'react';
import Fade from 'react-reveal/Fade';
import { getOpenings } from '../redux/actions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import axios from 'axios';
import { URL } from '../redux/actions/index';

let date = new Date();
let today = date.toISOString().split('T')[0];

const Form = ({ allData, getOpenings }) => {
	const [formOpen, setFormOpen] = useState(false);

	const [nameInput, setNameInput] = useState("");
	const [emailInput, setEmailInput] = useState("");
	const [guestInput, setGuestInput] = useState("");
	const [dateInput, setDateInput] = useState("");
	const [timeInput, setTimeInput] = useState("");

	const [nameOK, setNameOk] = useState(false);
	const [emailOK, setEmailOk] = useState(false);
	const [dateOK, setDateOk] = useState(false);
	const [timeOK, setTimeOk] = useState(false);
	const [numberOK, setNumberOK] = useState(false);

	useEffect(() => {
		getOpenings();
	}, [getOpenings])

	useEffect(() => {
		if (formOpen) {
			document.getElementById("submit_Btn").disabled = true;
		}
	}, [formOpen])

	useEffect(() => {
		checkSubmit();
	}, [nameOK, emailOK, dateOK, timeOK, numberOK])

	function scrollDown() {
		setFormOpen(true);
		setTimeout(() => {
			document.getElementById("form_container").scrollIntoView(false)
		}, 300);
	}

	function message(x, text) {
		if (formOpen) {
			const m = document.getElementById("message" + x);
			m.className = "messageDiv appear";
			m.innerHTML = text;
			setTimeout(() => {
				m.innerHTML = "";
				m.className = "messageDiv appear";
			}, 3000);
		}
	}

	function checkSubmit() {
		if (nameOK && emailOK && dateOK && timeOK && numberOK) {
			document.getElementById("submit_Btn").disabled = false;
		}
	}

	console.log(nameOK, emailOK, numberOK, dateOK, timeOK);

	function checkName(e) {
		if (formOpen && nameInput.length < 6) {
			message(1, "Legalább 5 karaktert írjon be!");
			setNameOk(false)
			document.getElementById("submit_Btn").disabled = true;
			e.target.focus();
		} else {
			setNameOk(true);
		}
	}

	function checkEmail(e) {
		let mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

		if (formOpen && emailInput.match(mailformat) && emailInput.length > 5) {
			setEmailOk(true);
		} else {
			message(2, "Az emailcím hibásan van megadva.")
			setEmailOk(false);
			document.getElementById("submit_Btn").disabled = true;
			e.target.focus();
		}
	}

	function checkGuest(e) {
		if (formOpen && guestInput > 0 && guestInput < 11) {
			setNumberOK(true);
		} else {
			message(3, "1 és 10 között válasszon!")
			setNumberOK(false);
			document.getElementById("submit_Btn").disabled = true;
			e.target.focus();
		}
	}

	function checkDate(e) {
		if (formOpen && new Date(dateInput).getDay() === 0) {
			message(4, "Vasárnapra nem lehet foglalni!");
			setDateOk(false);
			document.getElementById("submit_Btn").disabled = true;
			document.querySelector("input[name='time']").disabled = true;
			e.target.focus();
		} else {
			document.querySelector("input[name='time']").disabled = false;
			setDateOk(true);
		}
	}

	function minTime() {
		let bookedDayIndex;
		let hour;
		let minute;
		if (formOpen && dateInput !== "" && dateInput !== today) {
			bookedDayIndex = new Date(dateInput).getDay();
			let selectedDay = allData.openings.filter(day => day.index === bookedDayIndex)[0];

			if (String(selectedDay.open[0]).length === 1) {
				hour = "0" + selectedDay.open[0];
			} else {
				hour = selectedDay.open[0];
			}

			minute = selectedDay.open[1] + "0";

			document.querySelector("input[name='time']").setAttribute("min", hour + ":" + minute);
		} else if (formOpen && dateInput !== "" && dateInput === today) {
			bookedDayIndex = new Date().getDay();
			let selectedDay = allData.openings.filter(day => day.index === bookedDayIndex)[0];

			if (String(selectedDay.open[0]).length === 1) {
				hour = "0" + selectedDay.open[0];
			} else {
				hour = selectedDay.open[0];
			}

			minute = selectedDay.open[1] + "0";

			document.querySelector("input[name='time']").setAttribute("min", hour + ":" + minute);
		} else if (formOpen && dateInput === "") {
			return null;
		}
	}

	function maxTime() {
		let bookedDayIndex;
		let hour;
		let min;

		if (formOpen && dateInput !== "" && dateInput !== today) {
			bookedDayIndex = new Date(dateInput).getDay();
			let selectedDay = allData.openings.filter(day => day.index === bookedDayIndex)[0];

			if (String(selectedDay.close[0]).length === 1) {
				hour = "0" + selectedDay.close[0];
			} else {
				hour = selectedDay.close[0];
			}

			min = selectedDay.close[1] + "0";

			document.querySelector("input[name='time']").setAttribute("max", hour + ":" + min);
		} else if (formOpen && dateInput !== "" && dateInput === today) {
			bookedDayIndex = new Date().getDay();
			let selectedDay = allData.openings.filter(day => day.index === bookedDayIndex)[0];

			if (String(selectedDay.close[0]).length === 1) {
				hour = "0" + selectedDay.close[0];
			} else {
				hour = selectedDay.close[0];
			}

			min = selectedDay.close[1] + "0";

			document.querySelector("input[name='time']").setAttribute("max", hour + ":" + min);
		} else if (formOpen && (dateInput === "" || new Date(dateInput).getDay() === 0)) {
			return null;
		}
	}

	function checkIsDate() {
		if (formOpen && (dateInput === "" || new Date(dateInput).getDay() === 0)) {
			message(5, "Előbb válasszon dátumot!");
			setTimeOk(false);
			document.getElementById("submit_Btn").disabled = true;
			document.querySelector("input[name='time']").disabled = true;
		} else {
			minTime();
			maxTime();
		}
	}

	function checkTime(e) {
		let minTime = document.querySelector("input[name='time']").min;
		let maxTime = document.querySelector("input[name='time']").max;
		let thisHour = new Date().getHours();
		let thismin = new Date().getMinutes();

		if (formOpen && dateInput !== today) {
			if (+timeInput.split(":")[0] >= +minTime.split(":")[0] && +timeInput.split(":")[0] < +maxTime.split(":")[0] - 1) {
				setTimeOk(true);
			} else {
				message(5, "A megadott időpont nem megfelelő.");
				setTimeOk(false);
				document.getElementById("submit_Btn").disabled = true;
				e.target.focus();
			}
		} else if (formOpen && dateInput === today) {
			if (+timeInput.split(":")[0] >= +minTime.split(":")[0] && +timeInput.split(":")[0] < +maxTime.split(":")[0] - 1) {
				if (+timeInput.split(":")[0] - thisHour > 1) {
					setTimeOk(true);
				} else if (+timeInput.split(":")[0] - thisHour === 1 && +timeInput.split(":")[1] > thismin) {
					setTimeOk(true);
				} else {
					message(5, "Legalább 1 órával előre lehet csak asztalt foglalni.")
					setTimeOk(false);
					document.getElementById("submit_Btn").disabled = true;
					e.target.focus();
				}
			} else {
				message(5, "A megadott időpont nem megfelelő.");
				setTimeOk(false);
				document.getElementById("submit_Btn").disabled = true;
				e.target.focus();
			}
		}
	}

	function postData() {
		if (formOpen && nameOK && emailOK && dateOK && timeOK && numberOK) {
			function resetData() {
				let inputs = document.querySelectorAll("input");
				for (let i = 0; i < inputs.length; i++) {
					inputs[i].value = ""
				}
				document.getElementById("submit_Btn").disabled = true;
			}

			let formData = {
				name: nameInput, email: emailInput, date: dateInput, time: timeInput, guests: guestInput
			}

			axios.post(`${URL}/reservations`, formData)
				.then(response => {
					response.data[0] === true ? (function () { message(6, response.data[1]); console.log(formData); resetData() })()
						: message(6, response.data[1])
				},
					error => {
						console.log(error);
					})
		}
	}

	return (
		<>
			<div id="form_container" style={{ backgroundImage: `url("/img/slides/bg_02.png")` }}>
				<div>
					<button id="formOpenBtn" onClick={scrollDown}>Asztalt foglalok!</button>
				</div>
				{formOpen ?
					<Fade bottom delay={200} distance="40px">
						<div id="form_div">
							<form>
								<label htmlFor="name">Név:</label> <br />
								<input type="text" name="username" required value={nameInput} onChange={(e) => setNameInput(e.target.value)} onBlur={(e) => { checkName(e) }} /> <br />
								<div id="message1" className="messageDiv"></div>
								<label htmlFor="email">Email cím:</label> <br />
								<input type="email" name="email" required value={emailInput} onChange={(e) => setEmailInput(e.target.value)} onBlur={(e) => { checkEmail(e) }} /> <br />
								<div id="message2" className="messageDiv"></div>
								<div className="formflex">
									<div className="formflex-item">
										<label htmlFor="persons">Vendégek:</label>
										<input type="number" id="number_input" min="1" max="10" name="persons" required value={guestInput} onChange={(e) => setGuestInput(+e.target.value)} onBlur={(e) => { checkGuest(e) }} />
										<div id="message3" className="messageDiv"></div>
									</div>
									<div className="formflex-item">
										<label htmlFor="date">Dátum:</label>
										<input type="date" name="date" min={today} required value={dateInput} onChange={(e) => setDateInput(e.target.value)} onBlur={(e) => { checkDate(e) }} />
										<div id="message4" className="messageDiv"></div>
									</div>
									<div className="formflex-item">
										<label htmlFor="time">Időpont:</label>
										<input type="time" id="time_input" name="time" required value={timeInput} onChange={(e) => setTimeInput(e.target.value)} onFocus={() => { checkIsDate() }} onBlur={(e) => { checkTime(e) }} />
										<div id="message5" className="messageDiv"></div>
									</div>
								</div>
								<button id="submit_Btn" type="button" onClick={postData}><b>Lefoglalom az asztalt!</b></button>
								<div id="message6" className="messageDiv"></div>
							</form>
						</div>
					</Fade>
					: null}
			</div>

		</>
	)
};

Form.propTypes = {
	getOpenings: PropTypes.func.isRequired,
	allData: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	allData: state.allData
});

export default connect(mapStateToProps, { getOpenings })(Form);

