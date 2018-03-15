import React, {Component} from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { sidebar_menu_update } from '../../reducer/sidebar_menu'

import ProductList from './ProductList'
import MyFavorite from './MyFavorite'

import './style.css'

class Product extends Component {

	constructor(props) {
		super(props);
        var tokenType = localStorage.getItem('tokenType');

        this.state = {
            redirect: null
        }

        if (tokenType !== 'restaurant') {
            this.state ={
                redirect: '/login'
            }
        }
    }

	componentDidMount() {
		this.props.sidebar_menu_update({
			index: 'rest-product',
			navTitle: 'menu.product'
		});
	}

	render() {

		let {redirect} = this.state;
		if (redirect) {
			return <Redirect push to={redirect} />;
		}

		return (
			<div className="container-fluid product">
                <div className="row">
                    <div className="col-xl-12">
                        <ul className="c-tabs__list nav nav-tabs">
                            <li>
								<a className="c-tabs__link active" data-toggle="tab" href="#all-product" role="tab" aria-controls="nav-home" aria-selected="true">
									<FormattedMessage id="product.allProducts"/>
								</a>
							</li>
                            <li>
								<a className="c-tabs__link" data-toggle="tab" href="#my-favorite" role="tab" aria-controls="nav-profile" aria-selected="false">
									<FormattedMessage id="product.myList"/>
								</a>
							</li>
                        </ul>
                        <div className="c-tabs__content tab-content u-mb-large">
                            <div className="c-tabs__pane u-pb-medium active" id="all-product" role="tabpanel">
								<ProductList />
							</div>
							<div className="c-tabs__pane u-pb-medium" id="my-favorite" role="tabpanel">
								<MyFavorite />
							</div>
                        </div>
                    </div>
                </div>
            </div>
		)
	}
}

export default connect(
	(state) => ({activeMenu: state.sidebarMenu}),
	{ sidebar_menu_update }
)(Product)