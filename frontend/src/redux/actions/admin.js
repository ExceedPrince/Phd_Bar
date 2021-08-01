import axios from 'axios';
import {
	MENU_ITEMS, ADMIN_RESERV_LIST, ADMIN_UNIQUE_OPEN, ADMIN_UNIQUE_OPEN_ERROR, OPENING_CHANGE_SUCCESS,
	OPENING_CHANGE_ERROR, DELETE_RESERVATION, DELETE_RESERVATION_ERROR, ADMIN_RESERV_UNIQUE,
	CLEAR_RESERVATION_DATA, RESERVATION_CHANGE_SUCCESS, RESERVATION_CHANGE_ERROR, ADMIN_FILTER_RESERVATION,
	DELETE_MENUITEM, DELETE_MENUITEM_ERROR, ADMIN_UNIQUE_MENU, CLEAR_MENUITEM_DATA, NEW_MENUITEM_SUCCESS,
	NEW_MENUITEM_ERROR
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

export const adminFilterMenu = (formData) => async dispatch => {

	const config = {
		headers: {
			'Content-Type': 'application/json'
		}
	};

	const res = await axios.post(`${URL}/admin/menu-filter`, formData, config);

	dispatch({
		type: MENU_ITEMS,
		payload: res.data
	});
};

export const getAdminUniqueMenuItem = (menu, id) => async dispatch => {

	const request = await axios.get(`${URL}/admin/menu/${menu}/${id}`)

	dispatch({
		type: ADMIN_UNIQUE_MENU,
		payload: request.data
	});
};

export const clearMenuItemData = () => async dispatch => {

	dispatch({
		type: CLEAR_MENUITEM_DATA,
		payload: null
	});
};

export const postNewMenuItem = (menu, formData, setShow, setInputs) => async dispatch => {

	try {
		const res = await axios.post(`${URL}/admin/menu/${menu}`, formData)

		dispatch({
			type: NEW_MENUITEM_SUCCESS,
			payload: res.data
		});

		dispatch(setAlert(res.data, 'success'));
		setShow(false);
		setInputs({ name: '', price: '', safe: '', ingredients: '', allergens: '', id: '', picture: '' })
	} catch (err) {
		const errors = err.response.data.errors;
		if (errors) {
			errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
		}
		dispatch({
			type: NEW_MENUITEM_ERROR
		});
	}
};

//update
export const upDateMenuItem = (formData) => async dispatch => {

	/* 	const config = {
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
		} */
};

export const deleteMenuItem = (type, id) => async dispatch => {

	try {
		const res = await axios.delete(`${URL}/admin/menu/${type}/${id}`);

		dispatch({
			type: DELETE_MENUITEM,
			payload: res.data
		});

	} catch (err) {
		const errors = err.response.data.errors;
		if (errors) {
			errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
		}
		dispatch({
			type: DELETE_MENUITEM_ERROR
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
