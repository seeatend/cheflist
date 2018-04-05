import React, {Component} from 'react'
import $ from 'jquery';
import { SERVER_URL } from '../../../config'
import List from './List'
import Item from './Item'
import NewL from './NewL'
import EditL from './EditL'

class MyFavorite extends Component {

	constructor(props) {
        super(props);
        this.state = {
            list: [],
            products: [],
            page: 'list'
        }
    }

    componentDidMount() {
        this.load();
    }

    load = () => {
        this.getFavorites().done( response => {
            this.setState({
                list: response.favorites,
                page: 'list',
                item: null,
                products: null
            })
        })
        .fail(function() {
            console.log('error');
        });
    }

    getFavorites() {
        return $.ajax({
            method: 'GET',
            url: SERVER_URL + '/favorites',
            headers: {
                'x-api-token': localStorage.getItem('accessToken')
            }
        });
    }

    getFavorite(uid) {
        return $.ajax({
            method: 'GET',
            url: SERVER_URL + '/favorites/list/' + uid,
            headers: {
                'x-api-token': localStorage.getItem('accessToken')
            }
        });
    }

    view = item => {
        this.getFavorite(item.uid).done( response => {
			const productsList = this.props.products.filter( product => {
				return !!response.products.find( p => p.uid === product.uid );
			})
            this.setState({
                item: item,
                products: productsList,
                page: 'view'
            })
        })
        .fail(function() {
            console.log('error');
        });
    }

    edit = () => {
        this.setState({
            page: 'edit'
        })
    }

	deleteList = favourite => {
		$.ajax({
			method: 'GET',
			url: SERVER_URL + '/favorites/list/' + favourite.uid + '/delete',
			headers: {
				'x-api-token': localStorage.getItem('accessToken')
			}
		})
		.done( () => this.load() );
	}

    back = () => {
        this.load();
    }

    backToView = () => {
        let {item} = this.state;
        this.load();
        this.view(item);
    }

    newList = () => {
        this.setState({
            page: 'new'
        })
    }

	render() {
        const {page, list, item, products} = this.state;
		const { getVendorName, refreshCart, vendors, updateCart, addToCart, cartProducts } = this.props;
		return (
			<div>
                {page === 'list'
					&& <List deleteList={ this.deleteList }
							list={ list }
							view={ this.view }
							new={ this.newList } />
				}
                {page === 'new'  && <NewL back={ this.back }/>}
                {page === 'view'
					&& <Item getVendorName={getVendorName}
							refreshCart={refreshCart}
							vendors={vendors}
							updateCart={updateCart}
							addToCart={addToCart}
							cartProducts={cartProducts}
							item={item}
							products={products}
							back={ this.back }
							edit={ this.edit } />
				}
                {page === 'edit' && <EditL item={item} products={products} backToView={ this.backToView }/>}
            </div>
		)
	}
}

export default MyFavorite;
