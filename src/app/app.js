import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'
import Sidebar from './layout/sidebar'
import NavBar from './layout/navbar'
import Alert from './layout/alert'
import Home from './main/home'
import Product from './main/product'
import Order from './main/order'
import Supplier from './main/supplier'
import Cart from './main/cart'
import Login from './main/login'
import Logout from './main/logout'
import { setHeaders } from './helpers';

class App extends Component {

	componentWillMount() {
		this.initializeUser();
	}

	initializeUser = () => {
		const token = localStorage.getItem('accessToken');
		if( token ) {
			setHeaders(token);
		}
	}

	render() {
		return (
			<Router>
				<Switch>
					<Redirect exact from="/" to="/login"/>
					<Route exact path='/login' component={Login}/>
					<Route exact path='/logout' component={Logout}/>
					<div>
						<Sidebar />
						<main className="o-page__content">
							<NavBar />
							<Alert/>
							<Route exact path='/restaurant/home' component={Home}/>
							<Route exact path='/restaurant/product' component={Product}/>
							<Route exact path='/restaurant/order' component={Order}/>
							<Route exact path='/restaurant/supplier' component={Supplier}/>
							<Route exact path='/restaurant/cart' component={Cart}/>
						</main>
					</div>
				</Switch>
			</Router>
		);
	}
}

export default App;
