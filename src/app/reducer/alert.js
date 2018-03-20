const initState = []

const ALERT_ADD = 'ALERT_ADD'
const ALERT_UPDATE = 'ALERT_UPDATE'
const ALERT_REMOVE = 'ALERT_REMOVE'

export default function(state = initState, action) {
	switch(action.type) {
		case ALERT_ADD:
			return [...state, action.payload]
		case ALERT_UPDATE:
			const updatedItems = state.map(item => {
				if(item.index === action.payload.index){
					return action.payload
				}
				return item
			})
			return updatedItems
        case ALERT_REMOVE:
			return state.filter(f => {
				return f.index !== action.payload.index
			})
		default:
			return state
	}
}

export const alert_add = (alert) => {
	return (dispatch) => {
		dispatch({
			type: ALERT_ADD,
			payload: alert
		})
	}
}

export const alert_update = (alert) => {
	return (dispatch) => {
		dispatch({
			type: ALERT_UPDATE,
			payload: alert
		})
	}
}

export const alert_remove = (alert) => {
	return (dispatch) => {
		dispatch({
			type: ALERT_REMOVE,
			payload: alert
		})
	}
}