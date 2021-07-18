import { MENU_ITEMS, UNIQUE_ITEMS, RESERV_LIST, RESERV_POST, RESERV_ERROR, OPENINGS, CLEAR_MENU_DATA } from "../types"

const initialState = {
	loading: true
};

export default function (state = initialState, action) {
	switch (action.type) {
		case MENU_ITEMS:
			return { ...state, menus: action.payload, loading: false };
		case UNIQUE_ITEMS:
			return { ...state, unique: action.payload, loading: false };
		case RESERV_LIST:
			return { ...state, reserv: action.payload, loading: false };
		case RESERV_POST:
			return { ...state, post: action.payload, loading: false };
		case RESERV_ERROR:
			return { ...state, error: action.payload, loading: false };
		case OPENINGS:
			return { ...state, openings: action.payload, loading: false };
		case CLEAR_MENU_DATA:
			return { ...state, menus: action.payload, loading: false };
		default:
			return state;
	}
}