import React, {Component} from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { SERVER_URL } from '../../config'
import { cart_update } from '../../reducer/cart'
import $ from 'jquery';
import './style.css'

class Navbar extends Component {

	constructor(props) {
        super(props);
        this.state = {
			name: "User",
			cartAmount: 0
        }
    }

	componentDidMount() {
		let scope = this;
		$.ajax({
            method: 'GET',
            url: SERVER_URL + '/account/profile',
            headers: {
                'x-api-token': localStorage.getItem('accessToken')
            }
		}).done(function(d) {
			scope.setState({
				name: d.account.firstName + ' ' + d.account.lastName
			})
		});
		this.getCarts();
	}

	cartAmount() {
		let cartAmount = 0;
		this.props.carts.carts.forEach(function(cart) {
			cartAmount += cart.products.length;
		});
		return cartAmount
	}

	getCarts() {
        let scope = this;
        $.ajax({
            method: 'GET',
            url: SERVER_URL + '/restaurant/carts',
            headers: {
                'x-api-token': localStorage.getItem('accessToken')
            }
        }).done(function(response) {
            scope.props.cart_update({
                carts: response.carts
            });
        })
	}

	render() {
		return (
			<header className="c-navbar u-mb-medium navbar">
				<button className="c-sidebar-toggle u-mr-small">
					<span className="c-sidebar-toggle__bar"></span>
					<span className="c-sidebar-toggle__bar"></span>
					<span className="c-sidebar-toggle__bar"></span>
				</button>

				<h2 className="c-navbar__title u-mr-auto">
					<FormattedMessage id={this.props.activeMenu.navTitle} />
				</h2>
				<div className="right-pane">
					<Link className="c-btn c-btn--success to-cart" to="/restaurant/cart">
						<i className="fa fa-shopping-cart u-mr-xsmall"></i>
						<FormattedMessage id="menu.cart"/> ({this.cartAmount()})
					</Link>
					<a className="c-btn c-btn--secondary to-cart">
						<i className="fa fa-user-o u-mr-xsmall"></i>{this.state.name}
					</a>
				</div>
			</header>
		)
	}
}

export default connect(
	(state) => ({
		activeMenu: state.sidebarMenu,
		carts: state.carts
	}),
	{cart_update}
)(Navbar)
