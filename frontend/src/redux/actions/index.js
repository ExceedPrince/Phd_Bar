import axios from 'axios';
import { MENU_ITEMS, UNIQUE_ITEMS, RESERV_LIST, RESERV_POST, RESERV_ERROR, OPENINGS, CLEAR_MENU_DATA, } from "../types";
import { setAlert } from '../actions/alert';

export const URL = "http://localhost:8080/api"

export const getMenu = (item) => async dispatch => {

	const request = await axios.get(`${URL}/menu/${item}`)

	dispatch({
		type: MENU_ITEMS,
		payload: request.data
	});
}

export const getMenuItem = (item, id) => async dispatch => {

	const request = await axios.get(`${URL}/menu/${item}/${id}`)

	dispatch({
		type: UNIQUE_ITEMS,
		payload: request.data
	});
}

export const getReservations = () => async dispatch => {

	const request = await axios.get(`${URL}/reservations`)

	dispatch({
		type: RESERV_LIST,
		payload: request.data
	});
}

export const filterReservations = (date) => async dispatch => {

	const request = await axios.get(`${URL}/reservations/${date}`)

	dispatch({
		type: RESERV_LIST,
		payload: request.data
	});
}

export const getOpenings = () => async dispatch => {

	const request = await axios.get(`${URL}/openings`);
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

export const postData = (formData, resetData) => async dispatch => {
	const config = {
		header: {
			'Content-Type': 'application/json'
		}
	}
	try {
		const res = await axios.post(`${URL}/reservations/`, formData, config);

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
