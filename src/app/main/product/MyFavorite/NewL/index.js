import React, {Component} from 'react'
import { FormattedMessage } from 'react-intl'
import './style.css'

// Reducer
import { connect } from 'react-redux'
import { alert_add, alert_update, alert_remove } from '../../../../reducer/alert'

// API
import { SERVER_URL } from '../../../../config'

// jQuery
const $ = window.$;

class NewL extends Component {

    constructor(props) {
        super(props);
        this.state = {
            vendors: [],
            filteredVendors: [],
            products: [],
            filteredProducts: [],
            listProducts: [],
            filteredListProducts: [],
            selectedVendor : 0
        }
    }

    componentDidMount() {
        var scope = this;
        this.getAcceptedConnection().done(function(response) {
            var vendors = response.connections.sort(function(a, b) {
                if (a.accountName.toLowerCase() > b.accountName.toLowerCase()) {
                    return 1
                } else {
                    return -1
                }
            });
            if (vendors.length) {
                var catalog = vendors[0].catalog;
                scope.getProducts(catalog).done(function(response) {
                    response.products.sort(function(a, b) {
                        if (a.name.toLowerCase() > b.name.toLowerCase()) {
                            return 1
                        } else {
                            return -1
                        }
                    });
                    scope.setState({
                        vendors: vendors,
                        filteredVendors: vendors,
                        products: response.products,
                        filteredProducts: response.products,
                        selectedVendor: catalog
                    })
                });
            }
        })
    }

    create() {
        var scope = this;
        var name = $('#list-name').val();
        var {listProducts} = this.state;
        if (name !== '') {
            this.createList(name).done(function(response) {
                listProducts.forEach(function(p) {
                    scope.updateList(response.favoriteList.uid, p);
                });
            });
            this.props.back();
        } else {
            this.props.alert_add({
                index: 'create-favorite-list-name-empty',
                status: 'failed',
                message: 'product.emptyNameAlert'
            });
            setTimeout(() => {
				scope.props.alert_remove({
					index: 'create-favorite-list-name-empty'
				});
			}, 5000);
        }
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

    getProducts(catalog) {
        return $.ajax({
            method: 'GET',
            url: SERVER_URL + '/restaurant/catalog/' + catalog,
            headers: {
                'x-api-token': localStorage.getItem('accessToken')
            }
        });
    }

    createList(name) {
        return $.ajax({
            method: 'POST',
            url: SERVER_URL + '/favorites/list',
            headers: {
                'x-api-token': localStorage.getItem('accessToken')
            },
            data: {
                name: name,
                description: ''
            }
		});
    }

    updateList(listId, product) {
        var catalogId = this.state.vendors.filter(function(v) {
            return v.accountId === product.vendor
        })[0].catalog;

        return $.ajax({
            method: 'POST',
            url: SERVER_URL + '/favorites/list/' + listId + '/product',
            headers: {
                'x-api-token': localStorage.getItem('accessToken')
            },
            data: {
                catalogId: catalogId,
                productId: product.uid
            },
            async: false
		});
    }
    
    filterVendor() {
        var f = $('#supplier-filter').val();
        var filteredVendors = this.state.vendors.filter(function(v) {
            return v.accountName.toLowerCase().includes(f.toLowerCase())
        });
        this.setState({
            filteredVendors
        });
    }

    filterProduct() {
        var f = $('#product-filter').val();
        var filteredProducts = this.state.products.filter(function(p) {
            return p.name.toLowerCase().includes(f.toLowerCase())
        });
        filteredProducts.sort(function(a, b) {
            if (a.name.toLowerCase() > b.name.toLowerCase()) {
                return 1
            } else {
                return -1
            }
        });
        this.setState({
            filteredProducts
        });
    }

    filterListProduct() {
        var f = $('#list-product-filter').val();
        var filteredListProducts = this.state.listProducts.filter(function(p) {
            return p.name.toLowerCase().includes(f.toLowerCase())
        });
        filteredListProducts.sort(function(a, b) {
            if (a.name.toLowerCase() > b.name.toLowerCase()) {
                return 1
            } else {
                return -1
            }
        });
        this.setState({
            filteredListProducts
        });
    }

    selectVendor(catalog) {
        var scope = this;
        $('#product-filter').val('');
        scope.getProducts(catalog).done(function(response) {
            response.products.sort(function(a, b) {
                if (a.name.toLowerCase() > b.name.toLowerCase()) {
                    return 1
                } else {
                    return -1
                }
            });
            scope.setState({
                products: response.products,
                filteredProducts: response.products,
                selectedVendor: catalog
            });
        });
    }

    addProductToList(p) {
        var {listProducts} = this.state;
        var duplicate = listProducts.filter(function(product) {
            return product.uid === p.uid
        });
        var f = $('#list-product-filter').val();
        if (!duplicate.length) {
            listProducts.push(p);
            var filteredListProducts = listProducts.filter(function(p) {
                return p.name.toLowerCase().includes(f.toLowerCase())
            });
            filteredListProducts.sort(function(a, b) {
                if (a.name.toLowerCase() > b.name.toLowerCase()) {
                    return 1
                } else {
                    return -1
                }
            });
            this.setState({
                listProducts,
                filteredListProducts
            })
        }
    }

    removeProductFromList(p) {
        var {listProducts} = this.state;
        var f = $('#list-product-filter').val();
        var newProducts = listProducts.filter(function(product) {
            return product.uid !== p.uid
        });
        var filteredListProducts = newProducts.filter(function(p) {
            return p.name.toLowerCase().includes(f.toLowerCase())
        });
        filteredListProducts.sort(function(a, b) {
            if (a.name.toLowerCase() > b.name.toLowerCase()) {
                return 1
            } else {
                return -1
            }
        });
        this.setState({
            listProducts: newProducts,
            filteredListProducts
        });
    }
    
	render() {
        var {filteredVendors, filteredProducts, filteredListProducts, selectedVendor} = this.state;
        var {back} = this.props;

        var uidList = filteredListProducts.map(function(p){ return p.uid });

		return (
            <div className="my-favorite-create">
                <div className="buttons">
                    <a className="c-btn c-btn--info create-list" onClick={() => this.create()}>
                        Create List
                    </a>
                    <a className="c-btn c-btn--secondary cancel-create" onClick={() => back()}>
                        Cancel
                    </a>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <h3 className="u-mb-small">
                            1. Choose Supplier
                        </h3>
                        <input className="c-input" id="supplier-filter" type="text" placeholder="" onChange={() => this.filterVendor()}/>
                        <div className="c-table-responsive">
                            <table className="c-table supplier-table">
                                <tbody>
                                    {filteredVendors.map( (v, i) =>
                                        <tr className={v.catalog === selectedVendor? "c-table__row selected":"c-table__row"}
                                            key={i}
                                            onClick={() => this.selectVendor(v.catalog)}>
                                            <td className="c-table__cell">
                                                {v.accountName}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <h3 className="u-mb-small">
                            2. Products
                        </h3>
                        <input className="c-input" id="product-filter" type="text" placeholder="" onChange={() => this.filterProduct()}/>
                        <div className="c-table-responsive">
                            <table className="c-table product-table">
                                <tbody>
                                    {filteredProducts.map( (p, i) =>
                                        uidList.indexOf(p.uid) === -1 &&
                                        <tr className="c-table__row" key={i}>
                                            <td className="c-table__cell add" onClick={()=>this.addProductToList(p)}>
                                                <i className="fa fa-plus"></i>
                                            </td>
                                            <td className="c-table__cell">
                                                {p.name}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <h3 className="u-mb-small list-name-box">
                            <FormattedMessage id="product.namePlaceholder"/>
                            3. <input className="c-input" id="list-name" type="text"/>
                        </h3>
                        <input className="c-input" id="list-product-filter" type="text" onChange={() => this.filterListProduct()}/>
                        <div className="c-table-responsive">
                            <table className="c-table list-table">
                                <tbody>
                                    {filteredListProducts.map( (p, i) =>
                                        <tr className="c-table__row" key={i}>
                                            <td className="c-table__cell">
                                                {p.name}
                                            </td>
                                            <td className="c-table__cell remove" onClick={()=>this.removeProductFromList(p)}>
                                                <i className="fa fa-minus"></i>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
		)
	}
}

export default connect(
	(state) => ({
		alerts: state.alerts
	}),
	{
		alert_add,
		alert_update,
		alert_remove
	}
)(NewL)