import React, {Component} from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'

// Reducer
import { cart_update } from '../../reducer/cart'
import { alert_add, alert_update, alert_remove } from '../../reducer/alert'

// Style
import './style.css'

class Alert extends Component {

	constructor(props) {
        super(props);
        this.state = {
        }
	}
	
	getClassNameFromStatus(status) {
		switch (status) {
			case 'process':
				return "c-alert c-alert--info"
			case 'success':
				return "c-alert c-alert--success"
			case 'failed':
				return "c-alert c-alert--danger"
			default:
				break;
		}
	}

	getIconFromStatus(status) {
		switch (status) {
			case 'process':
				return <i className="c-alert__icon fa fa-info-circle"></i>
			case 'success':
				return <i className="c-alert__icon fa fa-check-circle"></i>
			case 'failed':
				return <i className="c-alert__icon fa fa-times-circle"></i>
			default:
				break;
		}
	}

	render() {
		return (
			<div className="alert-container">
				{this.props.alerts.map((alert, i) =>
					<div className={this.getClassNameFromStatus(alert.status)} key={i}>
						{this.getIconFromStatus(alert.status)} <FormattedMessage id={alert.message} />
					</div>
				)}				
			</div>
		)
	}
}

export default connect(
	(state) => ({
		activeMenu: state.sidebarMenu,
		carts: state.carts,
		alerts: state.alerts
	}),
	{
		cart_update,
		alert_add,
		alert_update,
		alert_remove
	}
)(Alert)