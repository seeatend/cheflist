import React, {Component} from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { sidebar_menu_update } from '../../reducer/sidebar_menu'
import { SERVER_URL } from '../../config'

import Vendor from './Vendor'

import './style.css'

const $ = window.$;
const moment = window.moment;

class Cart extends Component {

	constructor(props) {
		super(props);
        var tokenType = localStorage.getItem('tokenType');

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
			navTitle: 'Cart'
		});
		this.load();
	}

	load() {
        var scope = this;
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
		var total = 0;
		carts.forEach(function(cart) {
			cart.products.forEach(function(p) {
				total += p.product.price * p.quantity;
			})
		});
		return total;
	}

	bulkOrder() {
		var scope = this;
		scope.updateDeliveryDate();
		$.ajax({
            method: 'POST',
            url: SERVER_URL + '/restaurant/cart/bulk_checkout',
            headers: {
                'x-api-token': localStorage.getItem('accessToken')
            }
		}).done(function() {
			scope.load();
		})
	}

	updateDeliveryDate() {
		var {carts} = this.state;
		$('.delivery-date').each(function(i) {
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
				console.log(response);
			}).fail(function() {
				console.log('error');
			});
		})
    }
	
	render() {
		var {redirect} = this.state;
		if (this.state.redirect) {
			return <Redirect push to={redirect} />;
		}

		var {carts} = this.state;

		return (
			<div className="container-fluid cart">
                <div className="row cart-container">
					<div className="col-lg-4 col-sm-12 checkout-box">
						<div className="c-card u-p-medium u-mb-medium">
							<h3 className="u-mb-small">
								Checkout Summary
							</h3>
							<h3 className="u-mb-small">
								<div className="title">Total</div>
								<div className="price">&euro; {this.cartsTotal(carts).toFixed(2)}</div>
							</h3>
							<p className="u-mb-xsmall">
								<a className="c-btn c-btn--success c-btn--fullwidth" onClick={()=>this.bulkOrder()}>Send Orders</a>
							</p>
							{/* <p className="u-mb-xsmall">
								<a className="c-btn c-btn--secondary c-btn--fullwidth">Remove all orders from cart</a>
							</p> */}
						</div>
					</div>
                    <div className="col-lg-8 col-sm-12 vendor-list">
						{carts.map((c, i) =>
							<Vendor cart={c} key={i} load={() => this.load()}/>
						)}
                    </div>
                </div>
            </div>
		)
	}
}

export default connect(
	(state) => ({activeMenu: state.sidebarMenu}),
	{ sidebar_menu_update }
)(Cart)