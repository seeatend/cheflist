import React, {Component} from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import $ from 'jquery';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import { sidebar_menu_update } from '../../reducer/sidebar_menu';
import { SERVER_URL } from '../../config';
import './style.css';

class Home extends Component {

	constructor(props) {
		super(props);
        let tokenType = localStorage.getItem('tokenType');

        this.state = {
			redirect: null,
			products: 0,
			orders: 0,
			suppliers: 0
        }

        if (tokenType !== 'restaurant') {
            this.state ={
                redirect: '/login'
            }
        }
    }

	componentDidMount() {
		this.props.sidebar_menu_update({
			index: 'rest-home',
			navTitle: 'menu.home'
		});
		this.load();
		window.Sidebar();
	}

	load() {
		let scope = this;
        this.getVendors().done(function(response) {
            response.connections.forEach(function(d) {
                scope.getProducts(d.catalog).done(function(response) {
					scope.setState({
						products: scope.state.products + response.products.length
					})
                })
            });
        });

		this.getOrders().done(function(response) {
			scope.setState({
				orders: response.orders.length
			})
		});

		this.getAcceptedConnection().done(function(response) {
			scope.setState({
				suppliers: response.connections.length
			})
		})
	}

	getVendors() {
        return $.ajax({
            method: 'GET',
            url: SERVER_URL + '/connection/accepted',
            headers: {
                'x-api-token': localStorage.getItem('accessToken')
            }
        });
    }

    getProducts(catalog) {
        return $.ajax({
            method: 'GET',
            url: SERVER_URL + '/restaurant/catalog/'+catalog,
            headers: {
                'x-api-token': localStorage.getItem('accessToken')
            }
        });
	}

	getOrders() {
        return $.ajax({
            method: 'GET',
            url: SERVER_URL + '/order/all',
            headers: {
                'x-api-token': localStorage.getItem('accessToken')
            }
        });
	}

	getAcceptedConnection() {
        return $.ajax({
            method: 'GET',
            url: SERVER_URL + '/connection/accepted',
            headers: {
                'x-api-token': localStorage.getItem('accessToken')
            }
		});
	}

	render() {

		let {redirect, products, orders, suppliers} = this.state;
		if (redirect) {
			return <Redirect push to={redirect} />;
		}

		return (
			<div id="home" className="container">
				<h1 className="welcome"><FormattedMessage id="home.welcome"/></h1>
				<div className="row">
					<Link className="col-sm-12 col-lg-6 col-xl-4 box" to="/restaurant/product">
						<div className="c-state-card" data-mh="state-cards">
							<div className="c-state-card__icon c-state-card__icon--info">
								<i className="fa fa-cutlery"></i>
							</div>

							<div className="c-state-card__content">
								<h5 className="c-state-card__number">
									<FormattedMessage id="home.product"/>
								</h5>
								<p className="c-state-card__meta"><span className="u-text-success">{products}</span></p>
							</div>
						</div>
					</Link>

					<Link className="col-sm-12 col-lg-6 col-xl-4 box" to="/restaurant/order">
						<div className="c-state-card" data-mh="state-cards">
							<div className="c-state-card__icon c-state-card__icon--fancy">
								<i className="fa fa-file-text-o"></i>
							</div>

							<div className="c-state-card__content">
								<h5 className="c-state-card__number">
									<FormattedMessage id="home.orderList"/>
								</h5>
								<p className="c-state-card__meta"><span className="u-text-success">{orders}</span></p>
							</div>
						</div>
					</Link>

					<Link className="col-sm-12 col-lg-6 col-xl-4 box" to="/restaurant/supplier">
						<div className="c-state-card" data-mh="state-cards">
							<div className="c-state-card__icon c-state-card__icon--warning">
								<i className="fa fa-truck"></i>
							</div>

							<div className="c-state-card__content">
								<h5 className="c-state-card__number">
									<FormattedMessage id="home.mySuppliers"/>
								</h5>
								<p className="c-state-card__meta"><span className="u-text-success">{suppliers}</span></p>
							</div>
						</div>
					</Link>
				</div>
			</div>
		)
	}
}

export default connect(
	(state) => ({activeMenu: state.sidebarMenu}),
	{ sidebar_menu_update }
)(Home)
