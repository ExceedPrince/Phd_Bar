import axios from 'axios';

import { MENU_ITEMS, UNIQUE_ITEMS, RESERV_LIST, OPENINGS, CLEAR_MENU_DATA } from "../types"

export const URL = "http://localhost:8080"

export function getMenu(item) {

	const request = axios.get(`${URL}/menu/${item}`)
		.then(response => response.data)

	return {
		type: MENU_ITEMS,
		payload: request
	}
}

export function getMenuItem(item, id) {

	const request = axios.get(`${URL}/menu/${item}/${id}`)
		.then(response => response.data)

	return {
		type: UNIQUE_ITEMS,
		payload: request
	}
}

export function getReservations() {

	const request = axios.get(`${URL}/reservations`)
		.then(response => response.data)

	return {
		type: RESERV_LIST,
		payload: request
	}
}

export function filterReservations(date) {

	const request = axios.get(`${URL}/reservations/${date}`)
		.then(response => response.data)

	return {
		type: RESERV_LIST,
		payload: request
	}
}

export function getOpenings() {

	const request = axios.get(`${URL}/openings`)
		.then(response => response.data)

	return {
		type: OPENINGS,
		payload: request
	}
}

export function clearMenuData() {

	return {
		type: CLEAR_MENU_DATA,
		payload: null
	}
}
