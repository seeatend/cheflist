import React, {Component} from 'react';
import { FormattedMessage } from 'react-intl';
import { cart_update } from '../../reducer/cart';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { sidebar_menu_update } from '../../reducer/sidebar_menu';
import $ from 'jquery';
import { SERVER_URL } from '../../config';

import ProductList from './ProductList'
import MyFavorite from './MyFavorite'

import './style.css'

class Product extends Component {

	constructor(props) {
		super(props);
        let tokenType = localStorage.getItem('tokenType');

        this.state = {
            redirect: null,
			cartProducts: {},
			quantities: {},
			products: [],
			vendors: []
        }

        if (tokenType !== 'restaurant') {
            this.state ={
                redirect: '/login'
            }
        }
    }

	componentDidMount() {
		this.props.sidebar_menu_update({
			index: 'rest-product',
			navTitle: 'menu.product'
		});
	}

	//Helper functions for products table. Moving theme here and passing through this.props
	//so we don't have to duplicate loads of componentDidUpdate
	getVendorName = id => this.state.vendors.find( v => v.accountId === id ).meta.businessName;

	updateCartsState = () => {
        this.props.carts.carts.forEach( cart => {
            cart.products.forEach( product => {
                this.setState( prevState => ({
                    cartProducts: Object.assign({}, prevState.cartProducts, {
                        [product.product.uid]: product.quantity })
                    })
                );
            });
        });
    }

    //Currently api returns firstName + lastName. Getting all vendorNames
    //to get vendors meta in order to receive businessName
    getVendorsWithMeta = () => {
        this.getVendors().done( response => {
			const { connections } = response;
			$.ajax({
	            method: 'GET',
	            url: SERVER_URL + '/connection/vendors',
	            headers: {
	                'x-api-token': localStorage.getItem('accessToken')
	            }
	        })
	        .done( response => {
				const vendorsList = [];
	            connections.forEach( connection => {
	                const vendorWithMeta = Object.assign({}, connection);
	                const vendor = response.vendors.find( v => connection.accountId === v.uid );
	                if( vendor ) {
	                    vendorWithMeta.meta = vendor.meta;
						vendorsList.push(vendorWithMeta);
	                    this.getProducts( connection.catalog ).done( res => {
	                        this.setState( prevState => ({
								products: [...prevState.products, ...res.products]
							}));
	                    })
	                }
	            });
				this.setState({
					vendors: vendorsList
				})
	        })
		})
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
        $.ajax({
            method: 'GET',
            url: SERVER_URL + '/restaurant/carts',
            headers: {
                'x-api-token': localStorage.getItem('accessToken')
            }
        }).done( response => {
            this.props.cart_update({
                carts: response.carts
            });
			this.updateCartsState();
        })
	}

    addToCart = (product, quantity) => {
        const catalogId = this.state.vendors.find( v => v.accountId === product.vendor ).catalog;

        $.ajax({
            method: 'POST',
            url: SERVER_URL + '/restaurant/cart/add/' + catalogId,
            headers: {
                'x-api-token': localStorage.getItem('accessToken')
            },
            data: {
                productId: product.uid,
                quantity
            }
        }).done( () => {
			console.log('Added to cart');
            this.getCarts();
        });
    }

    updateCart = (product, quantity) => {
        return new Promise( (resolve, reject) => {
			this.props.carts.carts.forEach( cart => {
	            if( cart.products.find( p => p.product.uid === product.uid ) ) {
	                $.ajax({
	                    method: 'POST',
	                    url: SERVER_URL + '/restaurant/cart/update/' + cart.uid + '/' + product.uid,
	                    headers: {
	                        'x-api-token': localStorage.getItem('accessToken')
	                    },
	                    data: {
	                        quantity: quantity
	                    }
	                })
	                .done( () => {
	                    this.getCarts();
						resolve();
	                })
	            }
	        })
		});
    }

	render() {

		let { redirect, vendors, products, cartProducts } = this.state;
		if (redirect) {
			return <Redirect push to={redirect} />;
		}

		return (
			<div className="container-fluid product">
                <div className="row">
                    <div className="col-xl-12">
                        <ul className="c-tabs__list nav nav-tabs">
                            <li>
								<a className="c-tabs__link active" data-toggle="tab" href="#all-product" role="tab" aria-controls="nav-home" aria-selected="true">
									<FormattedMessage id="product.allProducts"/>
								</a>
							</li>
                            <li>
								<a className="c-tabs__link" data-toggle="tab" href="#my-favorite" role="tab" aria-controls="nav-profile" aria-selected="false">
									<FormattedMessage id="product.myList"/>
								</a>
							</li>
                        </ul>
                        <div className="c-tabs__content tab-content u-mb-large">
                            <div className="c-tabs__pane u-pb-medium active" id="all-product" role="tabpanel">
								<ProductList
									getVendorName={this.getVendorName}
									refreshCart={this.updateCartsState}
									updateCart={this.updateCart}
									addToCart={this.addToCart}
									getCarts={this.getCarts}
									getVendors={this.getVendorsWithMeta}
									vendors={vendors}
									products={products}
									cartProducts={cartProducts} />
							</div>
							<div className="c-tabs__pane u-pb-medium" id="my-favorite" role="tabpanel">
								<MyFavorite />
							</div>
                        </div>
                    </div>
                </div>
            </div>
		)
	}
}

function mapStateToProps( state ) {
	return {
		activeMenu: state.sidebarMenu,
		carts: state.carts
	}
}

export default connect(
	mapStateToProps,
	{ sidebar_menu_update, cart_update }
)(Product)
