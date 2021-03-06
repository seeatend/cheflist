import React, {Component} from 'react'
import { Redirect } from 'react-router-dom'
import $ from 'jquery';
import moment from 'moment';
import CheckoutBox from './Checkout';
// Reducer
import { connect } from 'react-redux'
import { sidebar_menu_update } from '../../reducer/sidebar_menu'
import { cart_update } from '../../reducer/cart'
import { alert_add, alert_update, alert_remove } from '../../reducer/alert'

// API
import { SERVER_URL } from '../../config'

// Component
import Vendor from './Vendor'

// Style
import './style.css'

class Cart extends Component {

	constructor(props) {
		super(props);
        let tokenType = localStorage.getItem('tokenType');

        this.state = {
			redirect: null,
			carts: []
        }

        if (tokenType !== 'restaurant') {
            this.state ={
                redirect: '/login'
            }
        }
	}

	componentDidMount() {
		this.props.sidebar_menu_update({
			index: 'rest-cart',
			navTitle: 'menu.cart'
		});
		this.load();
	}

	load() {
        let scope = this;
        this.getCarts().done(function(response) {
            scope.setState({
                carts: response.carts,
            });
        })
        .fail(function() {
            console.log('error');
        });
    }

	getCarts() {
        return $.ajax({
            method: 'GET',
            url: SERVER_URL + '/restaurant/carts',
            headers: {
                'x-api-token': localStorage.getItem('accessToken')
            }
        });
	}

	cartsTotal(carts) {
		let total = 0;
		carts.forEach(function(cart) {
			cart.products.forEach(function(p) {
				total += p.product.price * p.quantity;
			})
		});
		return total;
	}

	bulkOrder() {
		let scope = this;
		scope.updateDeliveryDate();
		this.props.alert_add({
			index: 'bulk-order',
			status: 'process',
			message: 'cart.orderBulkProgressAlert'
		});
		$.ajax({
            method: 'POST',
            url: SERVER_URL + '/restaurant/cart/bulk_checkout',
            headers: {
                'x-api-token': localStorage.getItem('accessToken')
            }
		}).done(function() {
			scope.props.alert_update({
				index: 'bulk-order',
				status: 'success',
				message: 'Successfully sent out all orders'
			});
			setTimeout(() => {
				scope.props.alert_remove({
					index: 'bulk-order'
				});
			}, 5000);
			scope.load();
			scope.getUpdatedCarts();
		})
		.fail(function() {
            scope.props.alert_update({
				index: 'bulk-order',
				status: 'failed',
				message: 'cart.orderFailedAlert'
			});
			setTimeout(() => {
				scope.props.alert_remove({
					index: 'bulk-order'
				});
			}, 5000);
        });
	}

	updateDeliveryDate() {
		let {carts} = this.state;
		$('.delivery-date input').each(function(i) {
			$.ajax({
				method: 'POST',
				url: SERVER_URL + '/restaurant/cart/update/' + carts[i].uid,
				headers: {
					'x-api-token': localStorage.getItem('accessToken')
				},
				data: {
					message: '',
					deliveryDate: moment($(this).val(), 'MM/DD/YYYY').format('YYYY-MM-DD')
				}
			}).done(function(response) {
			}).fail(function() {
				console.log('error');
			});
		});
	}

	getUpdatedCarts() {
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
		let {redirect} = this.state;
		if (this.state.redirect) {
			return <Redirect push to={redirect} />;
		}

		let {carts} = this.state;

		return (
			<div className="container-fluid cart">
				{carts.length === 0
					? <h2 className="empty-cart">Cart is Empty</h2>
					: <div className="row cart-container">
						<div className="col-xl-8 col-sm-12 vendor-list">
							{carts.map((c, i) =>
								<Vendor cart={c} key={i} load={() => this.load()}/>
							)}
						</div>
						<div className="col-xl-4 col-sm-12 checkout-box">
							<CheckoutBox
								totalPrice={this.cartsTotal(carts)} />
						</div>
					</div>
				}
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
		sidebar_menu_update,
		cart_update,
		alert_add,
		alert_update,
		alert_remove
	}
)(Cart)
