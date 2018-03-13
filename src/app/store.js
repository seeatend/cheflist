import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import sidebarMenuReducer from './reducer/sidebar_menu.js';
import cartReducer from './reducer/cart.js';

const reducer = combineReducers({
	sidebarMenu : sidebarMenuReducer,
	carts: cartReducer
})

export default createStore(
	reducer,
	applyMiddleware(thunk)
)