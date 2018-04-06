import React, {Component} from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import $ from 'jquery';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import { Input, Card } from 'semantic-ui-react';
import { SERVER_URL } from '../../../config'
import { cart_update } from '../../../reducer/cart'
import { alert_add, alert_update, alert_remove } from '../../../reducer/alert'
import './style.css'

class Vendor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showTable: false,
            cart: props.cart,
            message: props.cart.message,
            selectedDate: moment(props.cart.deliveryDate)
        }
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            cart: newProps.cart,
            message: newProps.cart.message
		});
    }

    cartPrice(cart) {
		let price = 0;
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
        this.props.alert_add({
			index: 'place-order' + cart.uid,
			status: 'process',
			message: 'cart.orderProgressAlert'
		});
        this.updateDeliveryDate();
        let scope = this;
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
                scope.props.alert_update({
                    index: 'place-order' + cart.uid,
                    status: 'success',
                    message: `Successflly sent order (${cart.vendor.firstName} ${cart.vendor.lastName})`
                });
                setTimeout(() => {
                    scope.props.alert_remove({
                        index: 'place-order' + cart.uid
                    });
                }, 5000);
                scope.props.load();
                scope.getCarts();
            }).fail(function(error) {
                scope.props.alert_update({
                    index: 'place-order' + cart.uid,
                    status: 'failed',
                    message: 'cart.orderFailedAlert'
                });
                setTimeout(() => {
                    scope.props.alert_remove({
                        index: 'place-order' + cart.uid
                    });
                }, 5000);
            });
        });
    }

    updateDeliveryDate() {
        let date = moment(this.refs.deliveryDate.value, 'MM/DD/YYYY').format('YYYY-MM-DD');
        $.ajax({
            method: 'POST',
            url: SERVER_URL + '/restaurant/cart/update/' + this.props.cart.uid,
            headers: {
                'x-api-token': localStorage.getItem('accessToken')
            },
            data: {
                deliveryDate: date
            }
        }).done(function(response) {
        }).fail(function() {
            console.log('error');
        });
    }

    updateQty(product, qty) {
        let scope = this;
        let {cart} = this.props;
        let {uid} = product.product;

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
        let newMsg = e.target.value;
        this.setState({
            message : newMsg
        })

        $.ajax({
            method: 'POST',
            url: SERVER_URL + '/restaurant/cart/update/' + this.props.cart.uid,
            headers: {
                'x-api-token': localStorage.getItem('accessToken')
            },
            data: {
                message: newMsg
            }
        }).done(function(response) {
        }).fail(function(err) {
            console.log(err);
        });
    }

    handleMessage(e) {
        this.setState({
            message: e.target.value
        })
    }

    removeOrder(cart) {
        let scope = this;
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
        let scope = this;
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

    qtyPlus(id, product) {
        let input = $('#' + id + ' .quantity input');
        let qty = parseInt(input.val(),10) + 1;
        input.val(qty);
        this.updateQty(product, qty);
    }

    qtyMinus(id, product) {
        let input = $('#' + id + ' .quantity input');
        let qty = parseInt(input.val(),10);
        qty = qty>0 ? qty-1 : 0;
        input.val(qty);
        this.updateQty(product, qty);
    }

    germanFormat(number) {
        let nums = number.toFixed(2).toString().split('.');
        let int = nums[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return int + ',' + nums[1];
    }

    filterDates = date => {
        const { vendor } = this.props.cart;
        return vendor.meta.deadlineHours
            && vendor.meta.deadlineHours[moment(date).isoWeekday()-1].activeDay;
    }

    fillDates = dateRange => {
        //Don't even waste time and RAM if array is empty or not exist
        if( !dateRange || !dateRange.length )
            return [];

        const { from: fromDate, to: toDate } = dateRange;
        let result = [];
        let currentDate = moment(fromDate);
        while( currentDate.isSameOrBefore( moment(toDate) ) ) {
            result.push( moment(currentDate) );
            currentDate.add(1, 'd');
        }

        return result;
    }

    handleDateChange = date => {
        this.setState({
            selectedDate: moment(date)
        })
    }

	render() {
        let {cart} = this.props;
        let {showTable, message} = this.state;
        let products = cart.products;

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
                        {/*<input className="c-input"
                            data-toggle="datepicker"
                            type="text"
                            placeholder="Delivery Date"
                            ref="deliveryDate"
                            defaultValue={moment(cart.deliveryDate).format('MM/DD/YYYY')}/>*/}
                        <DatePicker
                            dateFormat='DD/MM/YYYY'
                            customInput={ <Input icon='calendar' placeholder='Select delivery date' /> }
                            selected={this.state.selectedDate}
                            onChange={this.handleDateChange}
                            filterDate={this.filterDates}
                            excludeDates={ this.fillDates(cart.vendor.meta.holidays) } />
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
                            <textarea className="c-input" onBlur={(e) => this.updateMessage(e)} value={message} onChange={(e) => this.handleMessage(e)}/>
                        </p>
                    </div>
                }
            </div>
		)
	}
}

export default connect(
	(state) => ({
        carts: state.carts,
        alerts: state.alerts
    }),
	{
        cart_update,
        alert_add,
		alert_update,
		alert_remove
    }
)(Vendor)
