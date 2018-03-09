import React from 'react'
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'
import Sidebar   from './layout/sidebar'
import NavBar    from './layout/navbar'
import Home from './main/home'
import Product from './main/product'
import Order from './main/order'
import Supplier from './main/supplier'
import Cart from './main/cart'
import Login from './main/login'
import Logout from './main/logout'

const Wrapper = (props) => (
	<div>
		{props.children}
	</div>
)

const App = (props) => (
	<Router>
		<Switch>
			<Redirect exact from="/" to="/login"/>
			<Route exact path='/login' component={Login}/>
			<Route exact path='/logout' component={Logout}/>
			<Wrapper>
				<Sidebar />
				<main className="o-page__content">
					<NavBar />
					<Route exact path='/restaurant/home' component={Home}/>
					<Route exact path='/restaurant/product' component={Product}/>
					<Route exact path='/restaurant/order' component={Order}/>
					<Route exact path='/restaurant/supplier' component={Supplier}/>
					<Route exact path='/restaurant/cart' component={Cart}/>
				</main>
			</Wrapper>
		</Switch>
	</Router>
)

export default App;