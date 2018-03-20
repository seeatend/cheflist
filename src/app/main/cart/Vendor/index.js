import React, {Component} from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { SERVER_URL } from '../../../config'
import { cart_update } from '../../../reducer/cart'
import './style.css'

const $ = window.$;
const moment = window.moment;

class Vendor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showTable: false,
        }
    }

    componentDidMount() {
        $('[data-toggle="datepicker"]').datepicker();
    }

    cartPrice(cart) {
		var price = 0;
		cart.products.forEach(function(p) {
			price += p.product.price * p.quantity
		});
		return price;
    }

    getAccountInfo() {
        return $.ajax({
            method: 'GET',
            url: SERVER_URL + '/account/profile',
            headers: {
                'x-api-token': localStorage.getItem('accessToken')
            }
        });
    }
    
    placeOrder(cart) {
        this.updateDeliveryDate();
        var scope = this;
        this.getAccountInfo().done(function(response) {
            $.ajax({
                method: 'POST',
                url: SERVER_URL + '/restaurant/cart/checkout/' + cart.uid,
                headers: {
                    'x-api-token': localStorage.getItem('accessToken')
                },
                data: {
                    'deliveryAddress': response.account.meta.address
                }
            }).done(function() {
                scope.props.load();
                scope.getCarts();
            });
        });
    }

    updateDeliveryDate() {
        $.ajax({
            method: 'POST',
            url: SERVER_URL + '/restaurant/cart/update/' + this.props.cart.uid,
            headers: {
                'x-api-token': localStorage.getItem('accessToken')
            },
            data: {
                deliveryDate: moment(this.refs.deliveryDate.value, 'MM/DD/YYYY').format('YYYY-MM-DD')
            }
        }).done(function(response) {
        }).fail(function() {
            console.log('error');
        });
    }

    updateQty(product, qty) {
        var scope = this;
        var {cart} = this.props;
        var {uid} = product.product;

        cart.products.forEach(function(p) {
            if (p.product.uid === uid) {
                p.quantity = qty;
            }
        });
        this.setState({});

        $.ajax({
            method: 'POST',
            url: SERVER_URL + '/restaurant/cart/update/' + cart.uid + '/' + uid,
            headers: {
                'x-api-token': localStorage.getItem('accessToken')
            },
            data: {
                message: '',
                quantity: qty
            }
        }).done(function(response) {
            scope.getCarts();
        }).fail(function() {
            console.log('error');
        });
    }

    updateMessage(e) {
        $.ajax({
            method: 'POST',
            url: SERVER_URL + '/restaurant/cart/update/' + this.props.cart.uid,
            headers: {
                'x-api-token': localStorage.getItem('accessToken')
            },
            data: {
                message: e.target.value
            }
        }).done(function(response) {
        }).fail(function() {
            console.log('error');
        });
    }

    removeOrder(cart) {
        var scope = this;
        $.ajax({
            method: 'GET',
            url: SERVER_URL + '/restaurant/cart/delete/' + cart.uid,
            headers: {
                'x-api-token': localStorage.getItem('accessToken')
            }
        }).done(function() {
            scope.props.load();
            scope.getCarts();
        });
    }

    removeProduct(cart, product) {
        var scope = this;
        $.ajax({
            method: 'GET',
            url: SERVER_URL + '/restaurant/cart/delete/' + cart.uid +'/' + product.product.uid,
            headers: {
                'x-api-token': localStorage.getItem('accessToken')
            }
        }).done(function() {
            scope.props.load();
            scope.getCarts();
        });
    }

    toggleTable() {
        this.setState({
            showTable: !this.state.showTable
        })
    }

    getCarts() {
        var scope = this;
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
    
    qtyPlus(id, product) {
        var input = $('#' + id + ' .quantity input');
        var qty = parseInt(input.val(),10) + 1;
        input.val(qty);
        this.updateQty(product, qty);
    }

    qtyMinus(id, product) {
        var input = $('#' + id + ' .quantity input');
        var qty = parseInt(input.val(),10);
        qty = qty>0 ? qty-1 : 0;
        input.val(qty);
        this.updateQty(product, qty);
    }

    germanFormat(number) {
        var nums = number.toFixed(2).toString().split('.');
        var int = nums[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return int + ',' + nums[1];
    }

	render() {
        var {cart} = this.props;
        var {showTable} = this.state;
        var products = cart.products;

        products.sort(function(a, b) {
            if (a.product.name.toLowerCase() > b.product.name.toLowerCase()) {
                return 1
            } else {
                return -1
            }
        });

		return (
            <div className="c-card u-p-medium u-mb-medium vendor">
                <h4 className="u-mb-small">
                    <div className="vendor-name">{cart.vendor.firstName} {cart.vendor.lastName}</div>
                    <div className="total-price">
                        {this.germanFormat(this.cartPrice(cart))} &euro;
                    </div>
                </h4>
                {/* <p className="u-mb-xsmall valid-message">
                    <i className="fa fa-check-circle u-mr-xsmall"></i> Order minimum is met!
                </p>
                <p className="u-mb-xsmall invalid-message">
                    Order minimum is not met!
                </p> */}
                <div className="actions">
                    <a className="c-btn c-btn--secondary toggle-items" onClick={() => this.toggleTable()}>
                        {showTable
                            ?<FormattedMessage id="cart.hideList" values={{number: cart.products.length}}/>
                            :<FormattedMessage id="cart.showList" values={{number: cart.products.length}}/>
                        }
                    </a>
                    <div className="delivery-date">
                        <input className="c-input"
                            data-toggle="datepicker"
                            type="text"
                            placeholder="Delivery Date"
                            ref="deliveryDate"
                            defaultValue={moment(cart.deliveryDate).format('MM/DD/YYYY')}/>
                        <span className="u-color-info">
                            <FormattedMessage id="cart.deliveryDate"/>
                        </span>
                    </div>
                    <div className="order-action">
                        <a className="c-btn c-btn--success place-order" onClick={() => this.placeOrder(cart)}>
                            <FormattedMessage id="cart.placeOrder"/>
                        </a>
                        <a className="c-btn c-btn--danger remove-order" onClick={() => this.removeOrder(cart)}>
                            <FormattedMessage id="cart.remove"/>
                        </a>
                    </div>
                </div>
                {showTable &&
                    <div className="row u-mb-large item-table">
                        <div className="col-sm-12">
                            <div className="c-table-responsive table-container">
                                <p className="u-color-success">
                                    {products.length} <FormattedMessage id="cart.item"/>
                                </p>
                                <table className="c-table">
                                    <thead className="c-table__head c-table__head--slim">
                                        <tr className="c-table__row">
                                            <th className="c-table__cell c-table__cell--head">
                                                <FormattedMessage id="cart.no"/>
                                            </th>
                                            <th className="c-table__cell c-table__cell--head">
                                                <FormattedMessage id="cart.item"/>
                                            </th>
                                            <th className="c-table__cell c-table__cell--head">
                                                <FormattedMessage id="cart.quantity"/>
                                            </th>
                                            <th className="c-table__cell c-table__cell--head">
                                                <FormattedMessage id="cart.total"/>
                                            </th>
                                            <th className="c-table__cell c-table__cell--head">
                                                <span className="u-hidden-visually">Actions</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map((p, i) =>
                                            <tr className="c-table__row" key={i} id={p.product.uid}>
                                                <td className="c-table__cell no">
                                                    {i+1}
                                                </td>
                                                <td className="c-table__cell">
                                                    {p.product.name}
                                                </td>
                                                <td className="c-table__cell quantity">
                                                    <div className="c-btn-group">
                                                        <a className="c-btn c-btn--secondary" onClick={() => this.qtyMinus(p.product.uid, p)}>-</a>
                                                        <input className="c-input" type="text" placeholder="Qty"
                                                            defaultValue={p.quantity}
                                                            onBlur={(e) => this.updateQty(p, e.target.value)}/>
                                                        <a className="c-btn c-btn--secondary" onClick={() => this.qtyPlus(p.product.uid, p)}>+</a>
                                                    </div>
                                                </td>
                                                <td className="c-table__cell price">
                                                    {this.germanFormat(p.product.price * p.quantity)} &euro;
                                                </td>
                                                <td className="c-table__cell action">
                                                    <div className="c-btn-group">
                                                        {/* <a className="c-btn c-btn--secondary">Add note</a> */}
                                                        <a className="c-btn c-btn--secondary" onClick={() => this.removeProduct(cart, p)}>
                                                            <FormattedMessage id="cart.remove"/>
                                                        </a>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                }
                {showTable &&
                    <div>
                        <p className="u-mb-xsmall">
                            <FormattedMessage id="cart.orderMessage"/>
                        </p>
                        <p>
                            <textarea className="c-input" onBlur={(e) => this.updateMessage(e)} defaultValue={cart.message}/>
                        </p>
                    </div>
                }
            </div>
		)
	}
}

export default connect(
	(state) => ({carts: state.carts}),
	{ cart_update }
)(Vendor)