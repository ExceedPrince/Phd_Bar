import { combineReducers } from 'redux';
import allData from './type-reducer';
import alert from './alert-reducer';
import auth from './auth-reducer';

const rootReducer = combineReducers({
	allData, alert, auth
});

export default rootReducer;