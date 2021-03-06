import React, {Component} from 'react'
import $ from 'jquery';
// import { FormattedMessage } from 'react-intl'
import { SERVER_URL } from '../../../../config'
import './style.css'

class EditL extends Component {

    constructor(props) {
        super(props);
        this.state = {
            vendors: [],
            filteredVendors: [],
            products: [],
            filteredProducts: [],
            existingProducts: JSON.parse(JSON.stringify(this.props.products)),
            listProducts: this.props.products,
            filteredListProducts: this.props.products,
            selectedVendor : 0
        };
    }

    componentDidMount() {
        let scope = this;
        this.getAcceptedConnection().done(function(response) {
            let vendors = response.connections.sort(function(a, b) {
                if (a.accountName.toLowerCase() > b.accountName.toLowerCase()) {
                    return 1
                } else {
                    return -1
                }
            });
            if (vendors.length) {
                let catalog = vendors[0].catalog;
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
        });
        $('#list-name').html(this.props.item.name);
    }

    update() {
        let scope = this;
        let {listProducts, existingProducts} = this.state;
        let {item, backToView} = this.props;

        // Add New Product
        let pList = existingProducts.map(function(p) {
            return p.uid
        });
        listProducts.forEach(function(p) {
            if (pList.indexOf(p.uid) === -1) {
                scope.updateList(item.uid, p);
            }
        });

        // Deleted Product
        let dList = listProducts.map(function(p) {
            return p.uid
        });
        existingProducts.forEach(function(p) {
            if (dList.indexOf(p.uid) === -1) {
                scope.deleteProduct(item.uid, p);
            }
        })

        backToView();
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

    updateList(listId, product) {
        let catalogId = this.state.vendors.filter(function(v) {
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

    deleteProduct(ListId, product) {
        return $.ajax({
            method: 'GET',
            url: SERVER_URL + '/favorites/list/' + ListId + '/product/' + product.uid + '/delete',
            headers: {
                'x-api-token': localStorage.getItem('accessToken')
            },
            async: false
		});
    }

    filterVendor() {
        let f = $('#supplier-filter').val();
        let filteredVendors = this.state.vendors.filter(function(v) {
            return v.accountName.toLowerCase().includes(f.toLowerCase())
        });
        this.setState({
            filteredVendors
        });
    }

    filterProduct() {
        let f = $('#product-filter').val();
        let filteredProducts = this.state.products.filter(function(p) {
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
        let f = $('#list-product-filter').val();
        let filteredListProducts = this.state.listProducts.filter(function(p) {
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
        let scope = this;
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
        let {listProducts} = this.state;
        let duplicate = listProducts.filter(function(product) {
            return product.uid === p.uid
        });
        let f = $('#list-product-filter').val();
        if (!duplicate.length) {
            listProducts.push(p);
            let filteredListProducts = listProducts.filter(function(p) {
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
        let {listProducts} = this.state;
        let f = $('#list-product-filter').val();
        let newProducts = listProducts.filter(function(product) {
            return product.uid !== p.uid
        });
        let filteredListProducts = newProducts.filter(function(p) {
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
        let {filteredVendors, filteredProducts, filteredListProducts, selectedVendor} = this.state;
        let {backToView} = this.props;
        let uidList = filteredListProducts.map(function(p){ return p.uid });

		return (
            <div className="my-favorite-create">
                <div className="buttons">
                    <a className="c-btn c-btn--info create-list" onClick={() => this.update()}>
                        Update List
                    </a>
                    <a className="c-btn c-btn--secondary cancel-create" onClick={() => backToView()}>
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
                        <h3 className="u-mb-small" id="list-name">Name</h3>
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

export default EditL;
