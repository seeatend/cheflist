import React, {Component} from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import $ from 'jquery';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import { Input, Button } from 'semantic-ui-react';
import { SERVER_URL } from '../../../config'
import { cart_update } from '../../../reducer/cart'
import CartProductsList from '../CartProductsList';
import { formatPrice } from '../../../helpers';
import { alert_add, alert_update, alert_remove } from '../../../reducer/alert'
import './style.css'

class Vendor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showTable: false,
            cart: props.cart,
            message: props.cart.message,
            selectedDate: this.selectStartingDate(),
            quantities: {}
        }
    }

    componentDidMount() {
        this.getQuantities();
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            cart: newProps.cart,
            message: newProps.cart.message
		});
    }

    cartPrice(cart) {
		let price = 0;
		cart.products.forEach( p => {
			price += p.product.price * this.state.quantities[p.product.uid];
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
        let date = moment(this.state.selectedDate).format('YYYY-MM-DD');
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
        let {uid} = product;

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

    qtyPlus = product => {
        this.onQuantityChange(product, this.state.quantities[product.uid]+1);
    }

    qtyMinus = product => {
        this.onQuantityChange(product, this.state.quantities[product.uid] - 1);
    }

    onQuantityChange = (product, quantity) => {
        this.setState( prevState => ({
            quantities: {
                ...prevState.quantities,
                [product.uid]: Math.max(quantity, 1)
            }
        }), () => {
            //TODO: get rid of this. Why on Earth we send request to backend each time we click button?
            this.updateQty(product, quantity);
        });
    }

    getQuantities = () => {
        let quantities = {};
        this.state.cart.products.forEach( product => {
            quantities[product.product.uid] = product.quantity;
        });
        this.setState({
            quantities
        });
    }

    filterDates = date => {
        const { vendor } = this.props.cart;
        return vendor.meta.deadlineHours
            && vendor.meta.deadlineHours[moment(date).isoWeekday() === 7 ? 0 : moment(date).isoWeekday()].activeDay
            && moment(date.format('YYYY-MM-DD')).isSameOrAfter(moment().format('YYYY-MM-DD'));
    }

    fillDates = dateRange => {
        //Don't even waste time and RAM if array is empty or not exist
        if( !dateRange || !dateRange.length )
            return [];

        let result = [];
        dateRange.forEach( range => {
            const { from: fromDate, to: toDate } = range;
            let currentDate = moment(fromDate);
            while( currentDate.isSameOrBefore( moment(toDate) ) ) {
                result.push( moment(currentDate) );
                currentDate.add(1, 'd');
            }
        });

        return result;
    }

    handleDateChange = date => {
        this.setState({
            selectedDate: moment(date)
        })
    }

    selectStartingDate = () => {
        let tryDate = moment().minutes(0).seconds(0);
        while( !this.dateIsAvailable(tryDate) ) {
            tryDate.add(1, 'd');
        }

        return tryDate;
    }

    dateIsAvailable = date => {
        return this.filterDates(date)
            && !this.fillDates(this.props.cart.vendor.meta.holidays).includes(date)
    }

	render() {
        let {cart} = this.props;
        let {showTable, message, quantities} = this.state;

        const sortedList = cart.products.slice().sort(function(a, b) {
            if (a.product.name.toLowerCase() > b.product.name.toLowerCase()) {
                return 1
            } else {
                return -1
            }
        });

		return (
            <div className="c-card u-p-medium u-mb-medium vendor">
                <h4 className="u-mb-small">
                    <div className="vendor-name">{cart.vendor.meta.businessName}</div>
                    <div className="total-price">
                        {formatPrice(this.cartPrice(cart))} &euro;
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
                            ?<FormattedMessage id="cart.hideList" values={{number: sortedList.length}}/>
                        :<FormattedMessage id="cart.showList" values={{number: sortedList.length}}/>
                        }
                    </a>
                    <div className="delivery-date">
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
                        <Button.Group>
                            <Button color='red' onClick={() => this.removeOrder(cart)} > <FormattedMessage id="cart.remove" /> </Button>
                            <Button color='green' onClick={() => this.placeOrder(cart)} > <FormattedMessage id="cart.placeOrder" /> </Button>
                        </Button.Group>
                    </div>
                </div>
                {showTable &&
                    <div className="row u-mb-large item-table">
                        <CartProductsList
                            products={ cart.products.map( product => product.product ) }
                            quantities={ quantities }
                            onIncrement={ this.qtyPlus }
                            onDecrement={ this.qtyMinus }
                            onInputChange={ this.onQuantityChange }
                            cart={ cart }
                            removeProduct={ this.removeProduct } />
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
