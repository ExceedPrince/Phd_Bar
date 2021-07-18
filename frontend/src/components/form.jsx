import React, { useState, useEffect } from 'react';
import Fade from 'react-reveal/Fade';
import Alert from './Alert';
import { setAlert } from '../redux/actions/alert';
import { getOpenings, postData } from '../redux/actions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

let date = new Date();
let today = date.toISOString().split('T')[0];

const Form = ({ setAlert, allData, getOpenings, postData }) => {
	const [formOpen, setFormOpen] = useState(false);
	const [inputs, setInputs] = useState({ username: '', email: '', persons: '', date: '', time: '' });
	const [nameOK, setNameOk] = useState(false);
	const [emailOK, setEmailOk] = useState(false);
	const [dateOK, setDateOk] = useState(false);
	const [timeOK, setTimeOk] = useState(false);
	const [numberOK, setNumberOK] = useState(false);

	const { username, email, persons, date, time } = inputs;

	const onChange = (e) => setInputs({ ...inputs, [e.target.name]: e.target.value });

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
		console.log(nameOK, emailOK, numberOK, dateOK, timeOK);
	}, [nameOK, emailOK, dateOK, timeOK, numberOK])

	const scrollDown = () => {
		setFormOpen(true);
		setTimeout(() => {
			document.getElementById("form_container").scrollIntoView(false)
		}, 300);
	}

	const checkSubmit = () => {
		if (nameOK && emailOK && dateOK && timeOK && numberOK) {
			document.getElementById("submit_Btn").disabled = false;
		}
	};

	const checkName = (e) => {
		if (formOpen && username.length < 5) {
			setAlert('Legalább 5 karaktert írjon be!', 'danger');
			setNameOk(false)
			document.getElementById("submit_Btn").disabled = true;
			e.target.focus();
		} else {
			setNameOk(true);
		}
	}

	const checkEmail = (e) => {
		let mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

		if (formOpen && email.match(mailformat) && email.length > 5) {
			setEmailOk(true);
		} else {
			setAlert('Az emailcím hibásan van megadva.', 'danger');
			setEmailOk(false);
			document.getElementById("submit_Btn").disabled = true;
			e.target.focus();
		}
	}

	const checkGuest = (e) => {
		if (formOpen && +persons > 0 && +persons < 11) {
			setNumberOK(true);
		} else {
			setAlert('1 és 10 között válasszon!', 'danger');
			setNumberOK(false);
			document.getElementById("submit_Btn").disabled = true;
			e.target.focus();
		}
	}

	const checkDate = (e) => {
		if (formOpen && new Date(date).getDay() === 0) {
			setAlert('Vasárnapra nem lehet foglalni!', 'danger');
			setDateOk(false);
			document.getElementById("submit_Btn").disabled = true;
			document.querySelector("input[name='time']").disabled = true;
			e.target.focus();
		} else {
			document.querySelector("input[name='time']").disabled = false;
			setDateOk(true);
		}
	}

	const minTime = () => {
		let bookedDayIndex;
		let hour;
		let minute;
		if (formOpen && date !== "" && date !== today) {
			bookedDayIndex = new Date(date).getDay();
			let selectedDay = allData.openings.filter(day => day.index === bookedDayIndex)[0];

			if (String(selectedDay.open[0]).length === 1) {
				hour = "0" + selectedDay.open[0];
			} else {
				hour = selectedDay.open[0];
			}

			minute = selectedDay.open[1] + "0";

			document.querySelector("input[name='time']").setAttribute("min", hour + ":" + minute);
		} else if (formOpen && date !== "" && date === today) {
			bookedDayIndex = new Date().getDay();
			let selectedDay = allData.openings.filter(day => day.index === bookedDayIndex)[0];

			if (String(selectedDay.open[0]).length === 1) {
				hour = "0" + selectedDay.open[0];
			} else {
				hour = selectedDay.open[0];
			}

			minute = selectedDay.open[1] + "0";

			document.querySelector("input[name='time']").setAttribute("min", hour + ":" + minute);
		} else if (formOpen && date === "") {
			return null;
		}
	}

	const maxTime = () => {
		let bookedDayIndex;
		let hour;
		let min;

		if (formOpen && date !== "" && date !== today) {
			bookedDayIndex = new Date(date).getDay();
			let selectedDay = allData.openings.filter(day => day.index === bookedDayIndex)[0];

			if (String(selectedDay.close[0]).length === 1) {
				hour = "0" + selectedDay.close[0];
			} else {
				hour = selectedDay.close[0];
			}

			min = selectedDay.close[1] + "0";

			document.querySelector("input[name='time']").setAttribute("max", hour + ":" + min);
		} else if (formOpen && date !== "" && date === today) {
			bookedDayIndex = new Date().getDay();
			let selectedDay = allData.openings.filter(day => day.index === bookedDayIndex)[0];

			if (String(selectedDay.close[0]).length === 1) {
				hour = "0" + selectedDay.close[0];
			} else {
				hour = selectedDay.close[0];
			}

			min = selectedDay.close[1] + "0";

			document.querySelector("input[name='time']").setAttribute("max", hour + ":" + min);
		} else if (formOpen && (date === "" || new Date(date).getDay() === 0)) {
			return null;
		}
	}

	const checkIsDate = () => {
		if (formOpen && (date === "" || new Date(date).getDay() === 0)) {
			setAlert('Előbb válasszon dátumot!', 'danger');
			setTimeOk(false);
			document.getElementById("submit_Btn").disabled = true;
			document.querySelector("input[name='time']").disabled = true;
		} else {
			minTime();
			maxTime();
		}
	}

	const checkTime = (e) => {
		let minTime = document.querySelector("input[name='time']").min;
		let maxTime = document.querySelector("input[name='time']").max;
		let thisHour = new Date().getHours();
		let thismin = new Date().getMinutes();

		if (formOpen && date !== today) {
			if (+time.split(":")[0] >= +minTime.split(":")[0] && +time.split(":")[0] < +maxTime.split(":")[0] - 1) {
				setTimeOk(true);
			} else {
				setAlert('A megadott időpont nem megfelelő!', 'danger');
				setTimeOk(false);
				document.getElementById("submit_Btn").disabled = true;
				e.target.focus();
			}
		} else if (formOpen && date === today) {
			if (+time.split(":")[0] >= +minTime.split(":")[0] && +time.split(":")[0] < +maxTime.split(":")[0] - 1) {
				if (+time.split(":")[0] - thisHour > 1) {
					setTimeOk(true);
				} else if (+time.split(":")[0] - thisHour === 1 && +time.split(":")[1] > thismin) {
					setTimeOk(true);
				} else {
					setAlert('Legalább 1 órával előre lehet csak asztalt foglalni!', 'danger');
					setTimeOk(false);
					document.getElementById("submit_Btn").disabled = true;
					e.target.focus();
				}
			} else {
				setAlert('A megadott időpont nem megfelelő!', 'danger');
				setTimeOk(false);
				document.getElementById("submit_Btn").disabled = true;
				e.target.focus();
			}
		}
	}


	const onSubmit = async (e) => {
		e.preventDefault();
		if (formOpen && nameOK && emailOK && dateOK && timeOK && numberOK) {
			const resetData = () => {
				setInputs({ username: "", email: "", persons: "", date: "", time: "" })

				document.getElementById("submit_Btn").disabled = true;
			}

			let formData = {
				name: username, email: email, date: date, time: time, guests: +persons
			}

			postData(formData, resetData);
		}
		console.log(username, email, date, time, +persons)
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
							<form onSubmit={e => onSubmit(e)}>
								<label htmlFor="name">Név:</label> <br />
								<input type="text" name="username" required value={username} onChange={e => onChange(e)} onBlur={(e) => { checkName(e) }} /> <br />
								<label htmlFor="email">Email cím:</label> <br />
								<input type="email" name="email" required value={email} onChange={e => onChange(e)} onBlur={(e) => { checkEmail(e) }} /> <br />
								<div className="formflex">
									<div className="formflex-item">
										<label htmlFor="persons">Vendégek:</label>
										<input type="number" id="number_input" min="1" max="10" name="persons" required value={persons} onChange={e => onChange(e)} onBlur={(e) => { checkGuest(e) }} />
									</div>
									<div className="formflex-item">
										<label htmlFor="date">Dátum:</label>
										<input type="date" name="date" min={today} required value={date} onChange={e => onChange(e)} onBlur={(e) => { checkDate(e) }} />
									</div>
									<div className="formflex-item">
										<label htmlFor="time">Időpont:</label>
										<input type="time" id="time_input" name="time" required value={time} onChange={e => onChange(e)} onFocus={() => { checkIsDate() }} onBlur={(e) => { checkTime(e) }} />
									</div>
								</div>
								<input type="submit" id="submit_Btn" value="Lefoglalom" />
								<Alert />
							</form>
						</div>
					</Fade>
					: null}
			</div>

		</>
	)
};

Form.propTypes = {
	setAlert: PropTypes.func.isRequired,
	getOpenings: PropTypes.func.isRequired,
	postData: PropTypes.func.isRequired,
	allData: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	allData: state.allData
});

export default connect(mapStateToProps, { setAlert, getOpenings, postData })(Form);

