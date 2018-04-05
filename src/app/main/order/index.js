import React, {Component} from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import $ from 'jquery';
import { SERVER_URL } from '../../config'
import { sidebar_menu_update } from '../../reducer/sidebar_menu'

import List from './List'
import Item from './Item'

import './style.css'

class Order extends Component {

	constructor(props) {
        super(props);

        let tokenType = localStorage.getItem('tokenType');
        this.state = {
            redirect: null,
            list: [],
            item: [],
            page: 'list'
        }

        if (tokenType !== 'restaurant') {
            this.state ={
                redirect: '/login'
            }
        }
    }

    componentDidMount() {
		this.props.sidebar_menu_update({
			index: 'rest-order',
			navTitle: 'menu.orderHistory'
		});
        this.load();
    }

    load() {
        let scope = this;
        this.getOrders().done(function(response) {
            scope.setState({
                list: response.orders,
                page: 'list',
                item: null
            });
        })
        .fail(function() {
            console.log('error');
        });
    }

    getOrders() {
        return $.ajax({
            method: 'GET',
            url: SERVER_URL + '/order/all',
            headers: {
                'x-api-token': localStorage.getItem('accessToken')
            }
        });
    }

    check(item) {
		this.setState({
			item: item,
			page: 'item'
		});
    }

    back() {
        this.setState({
            page: 'list',
            item: null
        })
    }

	render() {
        let {redirect, list, item, page} = this.state;
		if (redirect) {
			return <Redirect push to={redirect} />;
        }

		return (
			<div className="container-fluid order">
				{page === 'list'?
					<List list={list} check={(item) => this.check(item)}/>:
					<Item item={item} back={() => this.back()}/>
				}
			</div>
		)
	}
}

export default connect(
	(state) => ({activeMenu: state.sidebarMenu}),
	{ sidebar_menu_update }
)(Order)
