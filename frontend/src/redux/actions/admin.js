import axios from 'axios';
import { ADMIN_RESERV_LIST } from "../types";

export const URL = "http://localhost:8080/api"

//Basic GET requests

export const getAdminReservations = () => async dispatch => {

	const request = await axios.get(`${URL}/admin/reservations`)

	dispatch({
		type: ADMIN_RESERV_LIST,
		payload: request.data
	});
}