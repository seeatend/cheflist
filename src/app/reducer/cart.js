const initState = {
	carts: [],
}

const CART_UPDATE = 'CART_UPDATE'

export default function(state = initState, action) {
	switch(action.type) {
		case CART_UPDATE:
			if (JSON.stringify(state) === JSON.stringify(action.payload)) {
				return state;
			}
			return action.payload
		default:
			return state
	}
}

export const cart_update = (carts) => {
	return (dispatch) => {
		dispatch({
			type: CART_UPDATE,
			payload: carts
		})
	}
}