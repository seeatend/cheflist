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

    load() {
        let scope = this;
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

    view(item) {
        let scope = this;
        this.getFavorite(item.uid).done(function(response) {
            scope.setState({
                item: item,
                products: response.products,
                page: 'view'
            })
        })
        .fail(function() {
            console.log('error');
        });
    }

    edit() {
        this.setState({
            page: 'edit'
        })
    }

    back() {
        this.load();
    }

    backToView() {
        let {item} = this.state;
        this.load();
        this.view(item);
    }

    newList() {
        this.setState({
            page: 'new'
        })
    }

	render() {
        let {page, list, item, products} = this.state;
		return (

			<div>
                {page === 'list' && <List list={list} view={(item) => this.view(item)} new={() => this.newList()}/>}
                {page === 'new'  && <NewL back={() => this.back()}/>}
                {page === 'view' && <Item item={item} products={products} back={() => this.back()} edit={() => this.edit()}/>}
                {page === 'edit' && <EditL item={item} products={products} backToView={() => this.backToView()}/>}
            </div>
		)
	}
}

export default MyFavorite;
