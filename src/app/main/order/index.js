import React, {Component} from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import $ from 'jquery';
import { SERVER_URL } from '../../config'
import { sidebar_menu_update } from '../../reducer/sidebar_menu'
import axios from 'axios';

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
            page: 'list',
			email: ''
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

    load = () => {
		axios.get(`${SERVER_URL}/account/profile`)
			.then( res => {
				const {email} = res.data.user;
				this.getOrders().done( response => {
		            this.setState({
		                list: response.orders,
		                page: 'list',
		                item: null,
						email
		            });
		        })
		        .fail( () => {
		            console.log('error');
		        });
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

    check = item => {
		this.setState({
			item: item,
			page: 'item'
		});
    }

    back = () => {
        this.setState({
            page: 'list',
            item: null
        })
    }

	render() {
        let {redirect, list, item, page, email} = this.state;
		if (redirect) {
			return <Redirect push to={redirect} />;
        }

		return (
			<div className="container-fluid order">
				{page === 'list'?
					<List list={list} check={this.check}/>:
					<Item item={item} email={email} back={this.back}/>
				}
			</div>
		)
	}
}

export default connect(
	(state) => ({activeMenu: state.sidebarMenu}),
	{ sidebar_menu_update }
)(Order)
