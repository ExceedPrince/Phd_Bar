import {
	MENU_ITEMS, UNIQUE_ITEMS, RESERV_LIST, RESERV_POST, RESERV_ERROR, OPENINGS, CLEAR_MENU_DATA,
	NEW_PASSWORD, NEW_PASSWORD_FAIL, VALIDATE_PASSWORD, VALIDATE_PASSWORD_FAIL, DELETE_MENUITEM,
	DELETE_MENUITEM_ERROR
} from "../types"

const initialState = {
	loading: true
};

export default function (state = initialState, action) {
	switch (action.type) {
		case MENU_ITEMS:
		case DELETE_MENUITEM:
			return { ...state, menus: action.payload, loading: false };
		case UNIQUE_ITEMS:
			return { ...state, unique: action.payload, loading: false };
		case RESERV_LIST:
			return { ...state, reserv: action.payload, loading: false };
		case RESERV_POST:
			return { ...state, post: action.payload, loading: false };
		case RESERV_ERROR:
		case NEW_PASSWORD_FAIL:
		case VALIDATE_PASSWORD_FAIL:
			return { ...state, error: action.payload, loading: false };
		case OPENINGS:
			return { ...state, openings: action.payload, loading: false };
		case CLEAR_MENU_DATA:
			return { ...state, menus: action.payload, loading: false };
		case NEW_PASSWORD:
		case VALIDATE_PASSWORD:
		case DELETE_MENUITEM_ERROR:
			return { ...state, loading: false };
		default:
			return state;
	}
}