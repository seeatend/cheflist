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
            url: SERVER_URL + '/restaurant/cart/add/'+catalogId,
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
    
	render() {
        var {vendorNames, filteredProduct} = this.state;
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
                                        <th className="c-table__cell c-table__cell--head"><FormattedMessage id="product.unit"/></th>
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
                                            <td className="c-table__cell">
                                                {p.name}
                                            </td>
                                            <td className="c-table__cell price">
                                                &euro; {p.price.toFixed(2)}
                                            </td>
                                            <td className="c-table__cell unit">
                                                {p.unit}
                                            </td>
                                            <td className="c-table__cell qty">
                                                <input className="c-input" type="text" placeholder="Qty" id={p.uid}/>
                                            </td>
                                            <td className="c-table__cell add-action">
                                                <a className="c-btn c-btn--success" onClick={()=>this.addToCart(p)}>
                                                    <i className="fa fa-plus u-mr-xsmall"></i>Add
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