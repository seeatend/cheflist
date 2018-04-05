import React, {Component} from 'react'
import { Redirect } from 'react-router-dom'
import $ from 'jquery';
import { SERVER_URL, AUTH_HEADER } from '../../config'

import './style.css'

class Logout extends Component {

    constructor(props) {
        super(props);
        $.ajax({
            method: 'GET',
            url: SERVER_URL + '/user/destroy_token',
            headers: {
                'x-api-token': localStorage.getItem('accessToken')
            }
        });
        localStorage.removeItem('accessToken');
        localStorage.removeItem('tokenType');
	}

    login() {
        let scope = this;
        $.ajax({
            method: 'POST',
            url: SERVER_URL + '/user/login',
            headers: AUTH_HEADER,
            data: {
                'email': $('#email').val(),
                'password': $('#password').val()
            }
        }).done(function(data) {
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('tokenType', data.tokenType);
            if (data.tokenType === 'restaurant') {
                scope.setState({
                    redirect: '/restaurant/home'
                })
            } else {
                scope.setState({
                    redirect: '/vendor/home'
                })
            }
        })
        .fail(function() {
            console.log('error');
        });
    }

	render() {
		return <Redirect push to='/login' />
	}
}

export default Logout;
