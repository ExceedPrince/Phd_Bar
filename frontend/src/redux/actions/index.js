import axios from 'axios';
import {
	MENU_ITEMS, UNIQUE_ITEMS, RESERV_LIST, RESERV_POST, RESERV_ERROR, RESERV_OK, RESERV_FAIL, OPENINGS,
	CLEAR_MENU_DATA, NEW_PASSWORD, NEW_PASSWORD_FAIL, VALIDATE_PASSWORD, VALIDATE_PASSWORD_FAIL,
	LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT, USER_LOADED, AUTH_ERROR
} from "../types";
import { setAlert } from '../actions/alert';
import setAuthToken from '../../setAuthToken';

export const URL = process.env.REACT_APP_BE_URL;

//Basic GET requests

export const getMenu = (item) => async dispatch => {

	const request = await axios.get(`${URL}/api/menu/${item}`)

	dispatch({
		type: MENU_ITEMS,
		payload: request.data
	});
}

export const getMenuItem = (item, id) => async dispatch => {

	const request = await axios.get(`${URL}/api/menu/${item}/${id}`)

	dispatch({
		type: UNIQUE_ITEMS,
		payload: request.data
	});
}

export const getReservations = () => async dispatch => {

	const request = await axios.get(`${URL}/api/reservations`)

	dispatch({
		type: RESERV_LIST,
		payload: request.data
	});
}

export const filterReservations = (date) => async dispatch => {

	const request = await axios.get(`${URL}/api/reservations/${date}`)

	dispatch({
		type: RESERV_LIST,
		payload: request.data
	});
}

export const getOpenings = () => async dispatch => {

	const request = await axios.get(`${URL}/api/openings`);
	dispatch({
		type: OPENINGS,
		payload: request.data
	});
}

export const clearMenuData = () => async dispatch => {

	dispatch({
		type: CLEAR_MENU_DATA,
		payload: null
	});
};

//reservation functions

export const postData = (formData, resetData) => async dispatch => {
	const config = {
		header: {
			'Content-Type': 'application/json'
		}
	}
	try {
		const res = await axios.post(`${URL}/api/reservations/`, formData, config);

		dispatch({
			type: RESERV_POST,
			payload: res.data
		});

		if (res.data[0] === true) {
			dispatch(setAlert(res.data[1], 'success'));
			await resetData();
		} else {
			dispatch(setAlert(res.data[1], 'danger'));
		}

	} catch (err) {
		dispatch({
			type: RESERV_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status }
		});

		dispatch(setAlert(err.response.statusText, 'danger'));
	}
};

export const reservValidate = (formData, history) => async dispatch => {
	const config = {
		header: {
			'Content-Type': 'application/json'
		}
	}

	try {
		const res = await axios.post(`${URL}/api/reservations/validate/`, formData, config);

		dispatch({
			type: RESERV_OK,
			payload: res.data
		});

		if (res.data[0] === true) {
			dispatch(setAlert(res.data[1], 'success'));
			setTimeout(() => {
				history.push('/');
			}, 5000);
		} else {
			dispatch(setAlert(res.data[1], 'danger'));
			setTimeout(() => {
				history.push('/');
			}, 5000);
		}

	} catch (err) {
		dispatch({
			type: RESERV_FAIL,
			payload: { msg: err.response.statusText, status: err.response.status }
		});

		dispatch(setAlert(err.response.data.errors[0].msg, 'danger'));
	}
};

//Reset password

export const askNewPassword = (formData) => async dispatch => {
	const config = {
		header: {
			'Content-Type': 'application/json'
		}
	}

	try {
		const res = await axios.post(`${URL}/api/admin/newpass/`, formData, config);

		dispatch({
			type: NEW_PASSWORD,
			payload: res.data
		});

		dispatch(setAlert(res.data, 'success'));

	} catch (err) {
		dispatch({
			type: NEW_PASSWORD_FAIL,
			payload: { msg: err.response.statusText, status: err.response.status }
		});

		dispatch(setAlert(err.response.data.errors[0].msg, 'danger'));
	}
};

export const validateNewPassword = (formData, history) => async dispatch => {
	const config = {
		header: {
			'Content-Type': 'application/json'
		}
	}

	try {
		const res = await axios.post(`${URL}/api/admin/validatepass/`, formData, config);

		dispatch({
			type: VALIDATE_PASSWORD,
			payload: res.data
		});

		dispatch(setAlert(res.data, 'success'));
		setTimeout(() => {
			history.push('/');
		}, 5000);

	} catch (err) {
		dispatch({
			type: VALIDATE_PASSWORD_FAIL,
			payload: { msg: err.response.statusText, status: err.response.status }
		});

		dispatch(setAlert(err.response.data.errors[0].msg, 'danger'));
	}
};

//Authentication

export const loadUser = () => async dispatch => {
	if (localStorage.token) {
		setAuthToken(localStorage.token);
	}

	try {
		setAuthToken(localStorage.token);
		const res = await axios.get(`${URL}/api/admin/auth`);
		dispatch({
			type: USER_LOADED,
			payload: res.data
		});

	} catch (err) {
		dispatch({
			type: AUTH_ERROR
		})
	}
};

export const login = (email, password, history, clickevent) => async dispatch => {
	const config = {
		headers: {
			'Content-Type': 'application/json'
		}
	};

	const body = JSON.stringify({ email, password });

	try {
		const res = await axios.post(`${URL}/api/admin/login`, body, config);
		dispatch({
			type: LOGIN_SUCCESS,
			payload: res.data
		});

		dispatch(loadUser());
		await clickevent();

		history.push('/admin');
	} catch (err) {
		const errors = err.response.data.errors;
		if (errors) {
			errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
		}
		dispatch({
			type: LOGIN_FAIL
		});
	}
};

export const logout = () => dispatch => {
	dispatch({ type: LOGOUT })
};