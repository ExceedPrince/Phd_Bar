import { combineReducers } from 'redux';
import allData from './type-reducer';
import alert from './alert-reducer';

const rootReducer = combineReducers({
	allData, alert
});

export default rootReducer;