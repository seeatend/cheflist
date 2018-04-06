import React, {Component} from 'react';
import { FormattedMessage } from 'react-intl';
import { cart_update } from '../../reducer/cart';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { sidebar_menu_update } from '../../reducer/sidebar_menu';
import $ from 'jquery';
import { SERVER_URL } from '../../config';
import { Menu } from 'semantic-ui-react';

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
			vendors: [],
			activeIndex: (this.props.location.state && this.props.location.state.selectedTab) || 'products'
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
	getVendorName = id => {
		const vendor = this.state.vendors.find( v => v.accountId === id );
		return (vendor && vendor.meta.businessName) || 'None';
	}

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
    };

	handleTabChange = (e, {name}) => this.setState({activeIndex: name});

	render() {

		let { redirect, vendors, products, cartProduct, activeIndex } = this.state;
		if (redirect) {
			return <Redirect push to={redirect} />;
		}

		return (
			<div className="container-fluid product">
                <div className="row">
                    <div className="col-xl-12">
						<Menu pointing secondary color='blue'>
							<Menu.Item name='products' active={activeIndex === 'products'} onClick={this.handleTabChange}>
								<FormattedMessage id="product.allProducts"/>
							</Menu.Item>
							<Menu.Item name='favorites' active={activeIndex === 'favorites'} onClick={this.handleTabChange}>
								<FormattedMessage id="product.myList"/>
							</Menu.Item>
						</Menu>
						{ activeIndex === 'products' &&
							<ProductList
								getVendorName={this.getVendorName}
								refreshCart={this.updateCartsState}
								updateCart={this.updateCart}
								addToCart={this.addToCart}
								getCarts={this.getCarts}
								getVendors={this.getVendorsWithMeta}
								vendors={this.state.vendors}
								products={this.state.products}
								cartProducts={this.state.cartProducts} />
						}
						{ activeIndex === 'favorites' &&
							<MyFavorite
								getVendorName={this.getVendorName}
								refreshCart={this.updateCartsState}
								updateCart={this.updateCart}
								addToCart={this.addToCart}
								getCarts={this.getCarts}
								getVendors={this.getVendorsWithMeta}
								vendors={this.state.vendors}
								products={this.state.products}
								cartProducts={this.state.cartProducts} />
						}
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
