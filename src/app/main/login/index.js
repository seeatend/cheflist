import React, {Component} from 'react'
import { FormattedMessage } from 'react-intl'
import { Redirect } from 'react-router-dom'
import { SERVER_URL, AUTH_HEADER } from '../../config'

import './style.css'

const $ = window.$;

class Login extends Component {

    constructor(props) {
		super(props);
        var tokenType = localStorage.getItem('tokenType');

        this.state = {
            redirect: null
        }

        if (tokenType === 'restaurant') {
            this.state = {
                redirect: '/restaurant/home'
            }
        }
	}

    login() {
        var scope = this;
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
        let {redirect} = this.state;
		if (this.state.redirect) {
			return <Redirect push to={redirect} />;
		}
		return (
			<div className="o-page--center">
				<div className="o-page__card o-page__card--horizontal">
                    <div className="c-card c-login-horizontal">
                        <div className="c-login__content-wrapper">
                            <header className="c-login__header">
                                <a className="c-login__icon c-login__icon--rounded c-login__icon--left">
                                    <img src="img/logo-login.svg" alt="Dashboard's Logo" />
                                </a>
                                <h2 className="c-login__title">
                                    <FormattedMessage id="signIn.signIn"/>
                                </h2>
                            </header>
                            <form className="c-login__content">
                                <div className="c-field u-mb-small">
                                    <label className="c-field__label" htmlFor="email">
                                        <FormattedMessage id="signIn.emailAddress"/>
                                    </label> 
                                    <input className="c-input" type="email" id="email" autoComplete="off"/> 
                                </div>
                                <div className="c-field u-mb-small">
                                    <label className="c-field__label" htmlFor="password">
                                        <FormattedMessage id="signIn.password"/>
                                    </label> 
                                    <input className="c-input" type="password" id="password" autoComplete="new-password" /> 
                                </div>
                                <a className="c-btn c-btn--success c-btn--fullwidth" onClick={() => this.login()}>
                                    <FormattedMessage id="signIn.signIn"/>
                                </a>
                                <span className="c-divider u-mv-small"></span>
                                <a href="/login" className="c-btn c-btn--secondary c-btn--fullwidth">
                                    <FormattedMessage id="signIn.createAccount"/>
                                </a>
                            </form>
                        </div>
                        <div className="c-login__content-image">
                            <img src="img/login2.jpg" alt="Welcome to Dashboard UI Kit" />
                            <h3><FormattedMessage id="signIn.welcomeToCheflist"/></h3>
                            <p className="u-text-large">
                                <FormattedMessage id="signIn.welcomeText"/>
                            </p>
                        </div>
                    </div>
                </div>
			</div>
		)
	}
}

export default Login;