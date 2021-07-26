import {
	ADMIN_RESERV_LIST, ADMIN_UNIQUE_OPEN, ADMIN_UNIQUE_OPEN_ERROR, OPENING_CHANGE_SUCCESS,
	OPENING_CHANGE_ERROR
} from "../types";

const initialState = {
	loading: true
};

export default function (state = initialState, action) {
	switch (action.type) {
		case ADMIN_RESERV_LIST:
			return { ...state, reservations: action.payload, loading: false };
		case ADMIN_UNIQUE_OPEN:
			return { ...state, openings: action.payload, loading: false };
		case ADMIN_UNIQUE_OPEN_ERROR:
			return { ...state, loading: false };
		case OPENING_CHANGE_SUCCESS:
		case OPENING_CHANGE_ERROR:
			return { ...state, loading: false };
		default:
			return state;
	}
};