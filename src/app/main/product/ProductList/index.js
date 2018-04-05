import React, {Component} from 'react';
import { FormattedMessage } from 'react-intl';
//import { connect } from 'react-redux';
//import { SERVER_URL } from '../../../config';
//import { cart_update } from '../../../reducer/cart';
import DropDownFilter from './DropDownFilter';
import { Input } from 'semantic-ui-react';
import ProductsTable from './ProductsTable';
//import $ from 'jquery';

import './style.css';

class ProductList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            vendorFilter: '',
            textFilter: '',
            filteredProduct: [],
            changedFields: {},
            quantities: {}         //Adding this aswell to get rid of DOM manipulations. Gross!!!
        }
    }

    componentDidMount() {
        const { refreshCart, getVendors } = this.props;

        refreshCart();
        getVendors();
    }

    componentDidUpdate( prevProps ) {
        const {vendors, cartProducts, products, refreshCart} = this.props;
        if( JSON.stringify(products) !== JSON.stringify(prevProps.products)
            || JSON.stringify(cartProducts) !== JSON.stringify(prevProps.cartProducts) ) {
            this.filterTable();
            refreshCart();
            this.getQuantities();
        }

        if( JSON.stringify(vendors) !== JSON.stringify(prevProps.vendors) )
            this.filterTable();
    }

    getQuantities = () => {
        const { products, cartProducts } = this.props;
        let quantities = {};
        products.forEach( product => {
            quantities[product.uid] = cartProducts[product.uid] || 1
        });

        this.setState({
            quantities
        })
    }

    /*addList(_vendor, _products) {
        const { cartProducts } = this.state;

        let quantities = {};
        _products.forEach( product => {
            quantities[product.uid] = (cartProducts[product.uid] && cartProducts[product.uid].quantity) || 1
        });
        this.setState( prevState => ({
                quantities: Object.assign({}, prevState.quantities, quantities),
                vendors: [...prevState.vendors, _vendor],
                vendorNames: [...prevState.vendorNames, _vendor.meta.businessName],
                products: [...prevState.products, ..._products],
                filteredProduct: [...prevState.filteredProduct, ..._products]
            })
        );
    }*/

    /*getAllProductFromCart() {
        let products = [];
        this.props.carts.carts.forEach(function(cart) {
            cart.products.forEach(function(p) {
                products.push(p.product.uid);
            })
        });
        return products;
    }*/

    qtyPlus = product => {
        this.onQuantityChange(product, this.state.quantities[product.uid]+1);
    }

    qtyMinus = product => {
        this.onQuantityChange(product, this.state.quantities[product.uid] - 1);
    }

    //????? wtf is this even for???
    germanFormat(number) {
        let nums = number.toString().split('.');
        let int = nums[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return int + ',' + nums[1];
    }

    isInCart = product => this.props.cartProducts[product.uid] !== undefined;

    onUpdateClick = (product, quantity) => {
        this.props.updateCart(product, quantity)
            .then( () => {
                this.setState( prevState => ({
                    changedFields: {
                        ...prevState.changedFields,
                        [product.uid]: false}
                }))
            })
    }

    getProductButton = product => {
        const { addToCart } = this.props;
        const { quantities } = this.state;
        const inCart = this.isInCart(product);
        return ( inCart
            ? this.state.changedFields[product.uid]
                ? ( <a className="c-btn c-btn--success product-action-button" onClick={ () => this.onUpdateClick(product, quantities[product.uid])}>
                        <i className="fa fa-pencil u-mr-xsmall"></i>
                        <FormattedMessage id="product.update"/>
                    </a>)
                : (<a className="c-btn c-btn--success product-action-button" onClick={ () => console.log('Here we shoudn\'t do anything')}>
                    <i className="fa fa-check u-mr-xsmall"></i>
                    <FormattedMessage id="product.added"/>
                </a>)
            : (<a className="c-btn c-btn--info product-action-button" onClick={ () => addToCart(product, quantities[product.uid])}>
                <i className="fa fa-shopping-cart u-mr-xsmall"></i>
                <FormattedMessage id="product.add"/>
            </a>)
        )
    };

    onQuantityChange = (product, value) => {
        const id = product.uid;
        let isChanged = false;
        this.setState( prevState => {
            isChanged = prevState.quantities[id] !== value;
            return {
                quantities: {
                    ...prevState.quantities,
                    [id]: Math.max(value, 1)
                }
            }
        }, () => {
            if ( this.props.cartProducts[id] ) {
                this.setState( prevState => ({
                    changedFields: {
                        ...prevState.changedFields,
                        [id]: isChanged
                    }
                }));
            }
        })
    }


    onDropdownChange = value => {
        this.setState({
            vendorFilter: value
        }, () => this.filterTable() )
    }

    filterTable() {
        const { products, getVendorName } = this.props;
        const { vendorFilter, textFilter } = this.state;

        const filtered = products.filter( product => {
            return ((!!vendorFilter && getVendorName(product.vendor) === vendorFilter) && (!vendorFilter && getVendorName(product.vendor).toLowerCase().includes(textFilter)))
                || (product.id.toLowerCase().includes(textFilter)
                || product.name.toLowerCase().includes(textFilter))
        });
        this.setState({
            filteredProduct: filtered.length
            ? filtered.sort( (a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1 )
            : products.slice().sort( (a,b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1 )
        })
    }

    onFilterChange = value => {
        this.setState({
            textFilter: value
        }, () => this.filterTable() )
    }

    getBusinessNames = () => {
        const { vendors } = this.props;
        if(vendors)
            return vendors.map( vendor => vendor.meta.businessName );

        return [];
    }

	render() {
        let { filteredProduct, quantities } = this.state;

        //const sortedList = filteredProduct.slice().sort( (a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1 );

		return (
            <div className="product-list">
                <DropDownFilter options={this.getBusinessNames()} action={(f) => this.onDropdownChange(f === 'All' ? '' : f)} className="vendor-filter"/>
                <Input className='products-searchbar' icon='search' placeholder='Search product, supplier or product ID' value={this.state.textFilter} onChange={ (e) => this.onFilterChange(e.target.value) } />
                <ProductsTable
                    productsList={ filteredProduct }
                    onInputChange={ this.onQuantityChange }
                    onIncrement={ this.qtyPlus }
                    onDecrement={ this.qtyMinus }
                    quantities={ quantities }
                    getVendorName={ this.props.getVendorName }
                    getButton={ this.getProductButton } />
            </div>
		)
	}
}

export default ProductList;
