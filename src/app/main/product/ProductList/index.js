import React, {Component} from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { SERVER_URL } from '../../../config'
import { cart_update } from '../../../reducer/cart'
import DropDownFilter from './DropDownFilter'

import './style.css'

const $ = window.$;

class ProductList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            vendors: [],
            vendorNames: [],
            products: [],
            vendorFilter: 'All',
            filteredProduct: []
        }
    }

    componentDidMount() {
        var scope = this;
        this.getVendors().done(function(response) {
            response.connections.forEach(function(d) {
                scope.getProducts(d.catalog).done(function(response) {
                    scope.addList(d, response.products);
                })
            });
        })
        .fail(function() {
            console.log('error');
        });
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

    addToCart(p) {
        var scope = this;

        var catalogId = this.state.vendors.filter(function(v) {
            return v.accountId === p.vendor
        })[0].catalog;

        $.ajax({
            method: 'POST',
            url: SERVER_URL + '/restaurant/cart/add/' + catalogId,
            headers: {
                'x-api-token': localStorage.getItem('accessToken')
            },
            data: {
                productId: p.uid,
                quantity: $('#'+p.uid).val()
            }
        }).done(function() {
            scope.getCarts();
        })
    }

    addList(_vendor, _products) {
        var {vendors, vendorNames, products, filteredProduct} = this.state;

        vendors.push(_vendor);
        vendorNames.push(_vendor.accountName);
        products = products.concat(_products);
        filteredProduct = filteredProduct.concat(_products);

        this.setState({
            vendors,
            vendorNames,
            products,
            filteredProduct
        });
    }

    filter(f) {
        var {vendors, products} = this.state;
        var filteredProduct;
        if (f === 'All') {
            filteredProduct = products;
        } else {
            var vendor = vendors.filter(function(v) {
                return v.accountName === f
            })[0];
            filteredProduct = this.state.products.filter(function(p) {
                return p.vendor === vendor.accountId
            });
        }
        this.setState({
            vendorFilter: f,
            filteredProduct
        })
    }

    getAllProductFromCart() {
        var products = [];
        this.props.carts.carts.forEach(function(cart) {
            cart.products.forEach(function(p) {
                products.push(p.product.uid);
            })
        });
        return products;
    }

    qtyPlus(id) {
        var qty = parseInt($('#' + id).val(),10) + 1;
        $('#' + id).val(qty);
    }

    qtyMinus(id) {
        var qty = parseInt($('#' + id).val(),10);
        qty = qty>1 ? qty-1 : 1;
        $('#' + id).val(qty);
    }

    germanFormat(number) {
        var nums = number.toString().split('.');
        var int = nums[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return int + ',' + nums[1];
    }

	render() {
        var {vendorNames, filteredProduct} = this.state;
        var products = this.getAllProductFromCart();

        filteredProduct.sort(function(a, b) {
            if (a.name.toLowerCase() > b.name.toLowerCase()) {
                return 1
            } else {
                return -1
            }
        });

		return (
            <div className="product-list">
                <DropDownFilter options={vendorNames} action={(f) => this.filter(f)} className="vendor-filter"/>
                <div className="row u-mb-large product-table">
                    <div className="col-sm-12">
                        <div className="c-table-responsive">
                            <p className="u-color-success">{filteredProduct.length} <FormattedMessage id="product.productTotal"/></p>
                            <table className="c-table">
                                <thead className="c-table__head c-table__head--slim">
                                    <tr className="c-table__row">
                                        <th className="c-table__cell c-table__cell--head"><FormattedMessage id="product.no"/></th>
                                        <th className="c-table__cell c-table__cell--head"><FormattedMessage id="product.productName"/></th>
                                        <th className="c-table__cell c-table__cell--head"><FormattedMessage id="product.price"/></th>
                                        <th className="c-table__cell c-table__cell--head"><FormattedMessage id="product.packagingUnit"/></th>
                                        <th className="c-table__cell c-table__cell--head"><FormattedMessage id="product.qty"/></th>
                                        <th className="c-table__cell c-table__cell--head">
                                            <span className="u-hidden-visually">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProduct.map( (p, i) =>
                                        <tr className="c-table__row" key={i}>
                                            <td className="c-table__cell no">
                                                {i+1}
                                            </td>
                                            <td className="c-table__cell name">
                                                {p.name} ({p.quantity} {p.unit})
                                            </td>
                                            <td className="c-table__cell price">
                                                {this.germanFormat(p.price.toFixed(2))} &euro;
                                            </td>
                                            <td className="c-table__cell package">
                                                {p.packaging}
                                            </td>
                                            <td className="c-table__cell qty">
                                                <div className="c-btn-group">
                                                    <a className="c-btn c-btn--secondary" onClick={() => this.qtyMinus(p.uid)}>-</a>
                                                    <input className="c-input" type="text" value={1} onChange={()=>{}} id={p.uid}/>
                                                    <a className="c-btn c-btn--secondary" onClick={() => this.qtyPlus(p.uid)}>+</a>
                                                </div>
                                            </td>
                                            <td className="c-table__cell add-action">
                                                <a className={products.indexOf(p.uid)===-1?"c-btn c-btn--info":"c-btn c-btn--success"} onClick={()=>this.addToCart(p)}>
                                                    <i className="fa fa-plus u-mr-xsmall"></i>
                                                    <FormattedMessage id="product.add"/>
                                                </a>
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
)(ProductList)