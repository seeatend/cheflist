const initState = {
	index: '',
	navTitle: 'menu.home'
}

const SIDEBAR_MENU_UPDATE = 'SIDEBAR_MENU_UPDATE'

export default function(state = initState, action) {
	switch(action.type) {
		case SIDEBAR_MENU_UPDATE:
			if (JSON.stringify(state) === JSON.stringify(action.payload)) {
				return state;
			}
			return action.payload
		default:
			return state
	}
}

export const sidebar_menu_update = (menu) => {
	return (dispatch) => {
		dispatch({
			type: SIDEBAR_MENU_UPDATE,
			payload: menu
		})
	}
}