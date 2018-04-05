import React, {Component} from 'react';
import { FormattedMessage } from 'react-intl';
import ProductsTable from '../../ProductList/ProductsTable';
import { Button } from 'semantic-ui-react';
import './style.css';

class Item extends Component {

    constructor(props) {
        super(props);
        this.state = {
            changedFields: {},
            quantities: {}
        };
    }

    componentDidMount() {
        this.getQuantities();
    }

    componentDidUpdate( prevProps ) {
        if( JSON.stringify(this.props.cartProducts) !== JSON.stringify(prevProps.cartProducts) )
            this.getQuantities();
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

    qtyPlus = product => {
        this.onQuantityChange(product, this.state.quantities[product.uid]+1);
    }

    qtyMinus = product => {
        this.onQuantityChange(product, this.state.quantities[product.uid] - 1);
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

	render() {
        let {products, back, edit, item, getVendorName} = this.props;
        const sortedList = products.slice().sort( (a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1 );

		return (
            <div className="my-favorite-item">
                <h2 className="title">{item.name}</h2>
                {/*<div className="buttons">
                    <a className="c-btn c-btn--secondary back-to-favorite" onClick={() => back()}>
                        &lt; <FormattedMessage id="product.back"/>
                    </a>
                    <a className="c-btn c-btn--info add-product" onClick={ () => edit(item) }>
                        <FormattedMessage id="product.addProductToList"/>
                    </a>
                </div>*/}
                <div>
                    <Button basic onClick={ () => back() }>&lt; <FormattedMessage id="product.back"/></Button>
                    <Button floated='right' color='blue' onClick={ () => edit(item) }><FormattedMessage id="product.addProductToList"/></Button>
                </div>
                <div className="row u-mb-large product-table">
                    <ProductsTable
                        productsList={ sortedList }
                        onInputChange={ this.onQuantityChange }
                        onIncrement={ this.qtyPlus }
                        onDecrement={ this.qtyMinus }
                        quantities={ this.state.quantities }
                        getVendorName={ getVendorName }
                        getButton={ this.getProductButton } />
                </div>
            </div>
		)
	}
}

export default Item;
