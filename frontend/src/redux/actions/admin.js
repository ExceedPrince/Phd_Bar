import axios from 'axios';
import {
	ADMIN_RESERV_LIST, ADMIN_UNIQUE_OPEN, ADMIN_UNIQUE_OPEN_ERROR, OPENING_CHANGE_SUCCESS,
	OPENING_CHANGE_ERROR, DELETE_RESERVATION, DELETE_RESERVATION_ERROR, ADMIN_RESERV_UNIQUE,
	CLEAR_RESERVATION_DATA, RESERVATION_CHANGE_SUCCESS, RESERVATION_CHANGE_ERROR, ADMIN_FILTER_RESERVATION
} from "../types";
import { setAlert } from '../actions/alert';

export const URL = "http://localhost:8080/api"

//Basic GET requests

export const getAdminReservations = () => async dispatch => {

	const request = await axios.get(`${URL}/admin/reservations`)

	dispatch({
		type: ADMIN_RESERV_LIST,
		payload: request.data
	});
};

export const adminFilterReservation = (formData) => async dispatch => {

	const config = {
		headers: {
			'Content-Type': 'application/json'
		}
	};

	const res = await axios.post(`${URL}/admin/reservation-filter`, formData, config);

	dispatch({
		type: ADMIN_FILTER_RESERVATION,
		payload: res.data
	});
};

export const getAdminUniqueReservation = (id) => async dispatch => {

	const request = await axios.get(`${URL}/admin/reservations/${id}`)

	dispatch({
		type: ADMIN_RESERV_UNIQUE,
		payload: request.data
	});
};

export const clearReservationData = () => async dispatch => {

	dispatch({
		type: CLEAR_RESERVATION_DATA,
		payload: null
	});
};

export const upDateReservation = (formData) => async dispatch => {

	const config = {
		headers: {
			'Content-Type': 'application/json'
		}
	};

	try {
		const res = await axios.put(`${URL}/admin/reservations/`, formData, config);
		dispatch({
			type: RESERVATION_CHANGE_SUCCESS,
			payload: res.data
		});

		await dispatch(setAlert(res.data, 'success'));
	} catch (err) {
		const errors = err.response.data.errors;
		if (errors) {
			errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
		}
		dispatch({
			type: RESERVATION_CHANGE_ERROR
		});
	}
};

export const deleteReservation = (id) => async dispatch => {

	try {
		const res = await axios.delete(`${URL}/admin/reservations/${id}`);

		dispatch({
			type: DELETE_RESERVATION,
			payload: res.data
		});

	} catch (err) {
		const errors = err.response.data.errors;
		if (errors) {
			errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
		}
		dispatch({
			type: DELETE_RESERVATION_ERROR
		});
	}
};

export const adminGetUniqueOpening = (id) => async dispatch => {

	try {
		const request = await axios.get(`${URL}/admin/openings/${id}`)

		dispatch({
			type: ADMIN_UNIQUE_OPEN,
			payload: request.data
		});
	} catch (err) {
		const errors = err.response.data.errors;
		if (errors) {
			errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
		}
		dispatch({
			type: ADMIN_UNIQUE_OPEN_ERROR
		});
	}
};

export const adminChangeOpenings = (formData) => async dispatch => {

	const config = {
		headers: {
			'Content-Type': 'application/json'
		}
	};

	try {
		const res = await axios.put(`${URL}/admin/openings`, formData, config);
		dispatch({
			type: OPENING_CHANGE_SUCCESS,
			payload: res.data
		});

		await dispatch(setAlert(res.data, 'success'));
	} catch (err) {
		const errors = err.response.data.errors;
		if (errors) {
			errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
		}
		dispatch({
			type: OPENING_CHANGE_ERROR
		});
	}
};
