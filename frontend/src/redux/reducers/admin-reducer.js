import {
	ADMIN_RESERV_LIST, ADMIN_UNIQUE_OPEN, ADMIN_UNIQUE_OPEN_ERROR, OPENING_CHANGE_SUCCESS,
	OPENING_CHANGE_ERROR, DELETE_RESERVATION, DELETE_RESERVATION_ERROR, ADMIN_RESERV_UNIQUE,
	CLEAR_RESERVATION_DATA, RESERVATION_CHANGE_SUCCESS, RESERVATION_CHANGE_ERROR
} from "../types";

const initialState = {
	loading: true
};

export default function (state = initialState, action) {
	switch (action.type) {
		case ADMIN_RESERV_LIST:
		case DELETE_RESERVATION:
			return { ...state, reservations: action.payload, loading: false };
		case ADMIN_RESERV_UNIQUE:
			return { ...state, reservation: action.payload, loading: false };
		case ADMIN_UNIQUE_OPEN:
			return { ...state, openings: action.payload, loading: false };
		case CLEAR_RESERVATION_DATA:
			return { loading: false };
		case RESERVATION_CHANGE_SUCCESS:
		case ADMIN_UNIQUE_OPEN_ERROR:
		case OPENING_CHANGE_SUCCESS:
		case OPENING_CHANGE_ERROR:
		case DELETE_RESERVATION_ERROR:
		case RESERVATION_CHANGE_ERROR:
			return { ...state, loading: false };
		default:
			return state;
	}
};