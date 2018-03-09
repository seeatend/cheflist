import React, {Component} from 'react'
import { SERVER_URL } from '../../../config'
import List from './List'
import Item from './Item'

const $ = window.$;

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

    load() {
        var scope = this;
        this.getFavorites().done(function(response) {
            scope.setState({
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

    edit(item) {
        var scope = this;
        this.getFavorite(item.uid).done(function(response) {
            scope.setState({
                item: item,
                products: response.products,
                page: 'edit'
            })
        })
        .fail(function() {
            console.log('error');
        });
    }

    back() {
        // this.load();
        this.setState({
            // list: response.favorites,
            page: 'list',
            item: null,
            products: null
        })
    }

	render() {
        var {page, list, item, products} = this.state;
		return (
			<div>
                {page === 'list'?
                    <List list={list} edit={(item) => this.edit(item)}/>:
                    <Item item={item} products={products} back={() => this.back()}/>
                }
            </div>
		)
	}
}

export default MyFavorite;