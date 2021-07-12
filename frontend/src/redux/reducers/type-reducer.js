import { MENU_ITEMS, UNIQUE_ITEMS, RESERV_LIST, OPENINGS, CLEAR_MENU_DATA } from "../types"

export default function (state = [], action) {
	switch (action.type) {
		case MENU_ITEMS:
			return { ...state, menus: action.payload };
		case UNIQUE_ITEMS:
			return { ...state, unique: action.payload };
		case RESERV_LIST:
			return { ...state, reserv: action.payload };
		case OPENINGS:
			return { ...state, openings: action.payload };
		case CLEAR_MENU_DATA:
			return { ...state, menus: action.payload };
		default:
			return state;
	}
}