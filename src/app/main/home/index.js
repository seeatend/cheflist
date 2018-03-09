import React, {Component} from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { sidebar_menu_update } from '../../reducer/sidebar_menu'
import './style.css'

class Home extends Component {

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
			index: 'rest-home',
			navTitle: 'Home'
		});
	}

	render() {

		let {redirect} = this.state;
		if (redirect) {
			return <Redirect push to={redirect} />;
		}

		return (
			<div id="home" className="container">
				<h1 className="welcome">Welcome!</h1>
				<div className="row">
					<a className="col-sm-12 col-lg-6 col-xl-4" href="/product">
						<div className="c-state-card" data-mh="state-cards">
							<div className="c-state-card__icon c-state-card__icon--info">
								<i className="fa fa-cutlery"></i>
							</div>

							<div className="c-state-card__content">
								<h5 className="c-state-card__number">Product</h5>
								<p className="c-state-card__meta"><span className="u-text-success">286</span></p>
							</div>
						</div>
					</a>

					<a className="col-sm-12 col-lg-6 col-xl-4" href="/order">
						<div className="c-state-card" data-mh="state-cards">
							<div className="c-state-card__icon c-state-card__icon--fancy">
								<i className="fa fa-file-text-o"></i>
							</div>

							<div className="c-state-card__content">
								<h5 className="c-state-card__number">Order List</h5>
								<p className="c-state-card__meta"><span className="u-text-success">28</span></p>
							</div>
						</div>
					</a>

					<a className="col-sm-12 col-lg-6 col-xl-4" href="/supplier">
						<div className="c-state-card" data-mh="state-cards">
							<div className="c-state-card__icon c-state-card__icon--warning">
								<i className="fa fa-truck"></i>
							</div>

							<div className="c-state-card__content">
								<h5 className="c-state-card__number">My Supplier</h5>
								<p className="c-state-card__meta"><span className="u-text-success">20</span></p>
							</div>
						</div>
					</a>
				</div>
			</div>
		)
	}
}

export default connect(
	(state) => ({activeMenu: state.sidebarMenu}),
	{ sidebar_menu_update }
)(Home)