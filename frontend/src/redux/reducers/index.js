import { combineReducers } from 'redux';
import allData from './type-reducer';
import alert from './alert-reducer';
import auth from './auth-reducer';
import admin from './admin-reducer';

const rootReducer = combineReducers({
	allData, alert, auth, admin
});

export default rootReducer;