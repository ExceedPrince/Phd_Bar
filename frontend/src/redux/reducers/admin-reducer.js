import { ADMIN_RESERV_LIST } from "../types";

const initialState = {
	loading: true
};

export default function (state = initialState, action) {
	switch (action.type) {
		case ADMIN_RESERV_LIST:
			return { ...state, openings: action.payload, loading: false };
		default:
			return state;
	}
};