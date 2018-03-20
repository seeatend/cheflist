import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'

import sidebarMenuReducer from './reducer/sidebar_menu.js'
import cartReducer from './reducer/cart.js'
import alertReducer from './reducer/alert.js'
import { composeWithDevTools } from 'redux-devtools-extension'

const reducer = combineReducers({
	sidebarMenu : sidebarMenuReducer,
	carts: cartReducer,
	alerts: alertReducer
})

export default createStore(
	reducer,
	composeWithDevTools(applyMiddleware(thunk))
)