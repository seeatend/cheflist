import React, {Component} from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';
import { SERVER_URL } from '../../config'
import './style.css'
const $ = window.$;

class Navbar extends Component {

	constructor(props) {
        super(props);
        this.state = {
            name: "User"
        }
    }

	componentDidMount() {
		var scope = this;
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

				<h2 className="c-navbar__title u-mr-auto">{this.props.activeMenu.navTitle}</h2>
				
				{/* <a className="c-btn c-btn--success to-cart">
					<i className="fa fa-shopping-cart u-mr-xsmall"></i>Cart
				</a> */}
				<Link className="c-btn c-btn--success to-cart" to="/restaurant/cart">
					<i className="fa fa-shopping-cart u-mr-xsmall"></i>Cart
				</Link>

				<a className="c-btn c-btn--secondary to-cart">
					<i className="fa fa-user-o u-mr-xsmall"></i>{this.state.name}
				</a>
			</header>
		)
	}
}

export default connect(
	(state) => ({activeMenu: state.sidebarMenu}),
)(Navbar)