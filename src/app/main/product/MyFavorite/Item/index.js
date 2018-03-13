import React, {Component} from 'react'
import { connect } from 'react-redux'
import { SERVER_URL } from '../../../../config'
import { cart_update } from '../../../../reducer/cart'
import './style.css'

const $ = window.$;

class Item extends Component {

    constructor(props) {
        super(props);
        this.state = {
            connections: [],
        }
        this.getConnections();
    }

    addToCart(p) {
        $.ajax({
            method: 'POST',
            url: SERVER_URL + '/restaurant/cart/add/'+p.catalog,
            headers: {
                'x-api-token': localStorage.getItem('accessToken')
            },
            data: {
                productId: p.uid,
                quantity: $('#'+p.uid).val()
            }
        });
        this.getCarts();
    }

    getConnections() {
        var scope = this;
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
        var connection = this.state.connections.filter(function(con) {
            return con.catalog === p.catalog
        });
        return connection.length?connection[0].accountName:'None'
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

	render() {
        var {item, products, back} = this.props;
		return (
            <div className="my-favorite-item">
                <a className="c-btn c-btn--info add-product">Add a product to list</a>
                <a className="c-btn c-btn--secondary back-to-favorite" onClick={() => back()}>Back &gt;</a>
                <div className="row u-mb-large product-table">
                    <div className="col-sm-12">
                        <div className="c-table-responsive">
                            <table className="c-table">
                                <caption className="c-table__title">
                                    {item.name}
                                    <small>{products.length} Product</small>
                                </caption>
                                <thead className="c-table__head c-table__head--slim">
                                    <tr className="c-table__row">
                                        <th className="c-table__cell c-table__cell--head">No</th>
                                        <th className="c-table__cell c-table__cell--head">Product Name</th>
                                        <th className="c-table__cell c-table__cell--head">Supplier</th>
                                        <th className="c-table__cell c-table__cell--head">Price</th>
                                        <th className="c-table__cell c-table__cell--head">Qty</th>
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
                                            <td className="c-table__cell">
                                                {p.name}
                                            </td>
                                            <td className="c-table__cell">
                                                {this.getSupplier(p)}
                                            </td>
                                            <td className="c-table__cell price">
                                                &euro; {p.price.toFixed(2)}/{p.unit}
                                            </td>
                                            <td className="c-table__cell qty">
                                                <input className="c-input" type="text" placeholder="Qty" defaultValue={p.quantity} id={p.uid}/>
                                            </td>
                                            <td className="c-table__cell action">
                                                <div className="c-btn-group">
                                                    {/* <a className="c-btn c-btn--secondary">
                                                        <i className="fa fa-plus u-mr-xsmall"></i>Note
                                                    </a> */}
                                                    <a className="c-btn c-btn--success" onClick={() => this.addToCart(p)}>
                                                        <i className="fa fa-plus u-mr-xsmall"></i>Add
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