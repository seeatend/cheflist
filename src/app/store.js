import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import sidebarMenuReducer from './reducer/sidebar_menu.js';

const reducer = combineReducers({
	sidebarMenu : sidebarMenuReducer,
})

export default createStore(
	reducer,
	applyMiddleware(thunk)
)