import React, {Component} from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import $ from 'jquery';
import { SERVER_URL } from '../../../../config'
import { cart_update } from '../../../../reducer/cart'
import './style.css'

class Item extends Component {

    constructor(props) {
        super(props);
        this.state = {
            connections: [],
        }
        this.getConnections();
    }

    addToCart(p) {
        let scope = this;
        $.ajax({
            method: 'POST',
            url: SERVER_URL + '/restaurant/cart/add/'+p.catalog,
            headers: {
                'x-api-token': localStorage.getItem('accessToken')
            },
            data: {
                productId: p.uid,
                quantity: $('#fav-'+p.uid).val()
            }
        }).done(function(response) {
            scope.getCarts();
        }).fail(function(err) {
            console.log(err);
        });
    }

    getConnections() {
        let scope = this;
        $.ajax({
            method: 'GET',
            url: SERVER_URL + '/connection/accepted',
            headers: {
                'x-api-token': localStorage.getItem('accessToken')
            }
        }).done(function(response) {
            // console.log(response.connections);
            scope.setState({
                connections: response.connections
            })
        })
    }

    getSupplier(p) {
        let connection = this.state.connections.filter(function(con) {
            return con.catalog === p.catalog
        });
        return connection.length?connection[0].accountName:'None'
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

    getAllProductFromCart() {
        let products = [];
        this.props.carts.carts.forEach(function(cart) {
            cart.products.forEach(function(p) {
                products.push(p.product.uid);
            })
        });
        return products;
    }

    qtyPlus(id) {
        let qty = parseInt($('#' + id).val(),10) + 1;
        $('#' + id).val(qty);
    }

    qtyMinus(id) {
        let qty = parseInt($('#' + id).val(),10);
        qty = qty>1 ? qty-1 : 1;
        $('#' + id).val(qty);
    }

    germanFormat(number) {
        let nums = number.toString().split('.');
        let int = nums[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return int + ',' + nums[1];
    }

	render() {
        let {products, back, item} = this.props;
        let purchased = this.getAllProductFromCart();
        products.sort(function(a, b) {
            if (a.name.toLowerCase() > b.name.toLowerCase()) {
                return 1
            } else {
                return -1
            }
        });

		return (
            <div className="my-favorite-item">
                <h2 className="title">{item.name}</h2>
                <div className="buttons">
                    <a className="c-btn c-btn--secondary back-to-favorite" onClick={() => back()}>
                        &lt; <FormattedMessage id="product.back"/>
                    </a>
                    <a className="c-btn c-btn--info add-product" onClick={()=>this.props.edit(item)}>
                        <FormattedMessage id="product.addProductToList"/>
                    </a>
                </div>
                <div className="row u-mb-large product-table">
                    <div className="col-sm-12">
                        <div className="c-table-responsive">
                            <p className="u-color-success">{products.length} Product</p>
                            <table className="c-table">
                                <thead className="c-table__head c-table__head--slim">
                                    <tr className="c-table__row">
                                        <th className="c-table__cell c-table__cell--head">
                                            <FormattedMessage id="product.no"/>
                                        </th>
                                        <th className="c-table__cell c-table__cell--head">
                                            <FormattedMessage id="product.productName"/>
                                        </th>
                                        <th className="c-table__cell c-table__cell--head">
                                            <FormattedMessage id="product.supplier"/>
                                        </th>
                                        <th className="c-table__cell c-table__cell--head">
                                            <FormattedMessage id="product.price"/>
                                        </th>
                                        <th className="c-table__cell c-table__cell--head">
                                            <FormattedMessage id="product.unit"/>
                                        </th>
                                        <th className="c-table__cell c-table__cell--head">
                                            <FormattedMessage id="product.qty"/>
                                        </th>
                                        <th className="c-table__cell c-table__cell--head">
                                            <span className="u-hidden-visually">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((p, i) =>
                                        <tr className="c-table__row" key={i}>
                                            <td className="c-table__cell no">
                                                {i+1}
                                            </td>
                                            <td className="c-table__cell name">
                                                {p.name} ({p.quantity} {p.unit})
                                            </td>
                                            <td className="c-table__cell supplier">
                                                {this.getSupplier(p)}
                                            </td>
                                            <td className="c-table__cell price">
                                                {this.germanFormat(p.price.toFixed(2))} &euro;
                                            </td>
                                            <td className="c-table__cell unit">
                                                {p.unit}
                                            </td>
                                            <td className="c-table__cell price-unit">
                                                {this.germanFormat(p.price.toFixed(2))} &euro; / {p.unit}
                                            </td>
                                            <td className="c-table__cell qty">
                                                <div className="c-btn-group">
                                                    <a className="c-btn c-btn--secondary" onClick={() => this.qtyMinus('fav-'+p.uid)}>-</a>
                                                    <input className="c-input" type="text" defaultValue="1" id={'fav-'+p.uid}/>
                                                    <a className="c-btn c-btn--secondary" onClick={() => this.qtyPlus('fav-'+p.uid)}>+</a>
                                                </div>
                                            </td>
                                            <td className="c-table__cell action">
                                                <div className="c-btn-group">
                                                    <a className={purchased.indexOf(p.uid) === -1?"c-btn c-btn--info":"c-btn c-btn--success"} onClick={() => this.addToCart(p)}>
                                                        <i className="fa fa-plus u-mr-xsmall"></i>
                                                        <FormattedMessage id="product.add"/>
                                                    </a>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {/* <nav className="c-pagination u-mt-small u-justify-between">
                            <a className="c-pagination__control">
                                <i className="fa fa-caret-left"></i>
                            </a>

                            <p className="c-pagination__counter">Page 1 of 3</p>

                            <a className="c-pagination__control">
                                <i className="fa fa-caret-right"></i>
                            </a>
                        </nav> */}
                    </div>
                </div>
            </div>
		)
	}
}

export default connect(
	(state) => ({carts: state.carts}),
	{ cart_update }
)(Item)
