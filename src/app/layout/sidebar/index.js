import React, {Component} from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { SIDEBAR_MENU_LIST } from '../../config'
import './style.css'

const $ = window.$;

class Sidebar extends Component {

	hideMenu() {
		$('.js-page-sidebar').removeClass('is-visible');
	}

	render() {
		return(
			<div className="o-page__sidebar js-page-sidebar sidebar">
				<div className="c-sidebar">
					<a className="c-sidebar__brand" href="/home">
						<img className="c-sidebar__brand-img logo" src="/ui-kit/img/logo.png" alt="Logo" />
					</a>
					<h4 className="c-sidebar__title">Restaurant</h4>
					<ul className="c-sidebar__list">
						{SIDEBAR_MENU_LIST.map((m, i) =>
							<li className="c-sidebar__item" key={i}>
								<Link	
									className={this.props.activeMenu.index === m.index?"c-sidebar__link is-active":"c-sidebar__link"}
									to={m.link}
									onClick={() => this.hideMenu()}>
									<i className={"fa " + m.icon + " u-mr-xsmall"}></i>
									<FormattedMessage id={m.title} />
									{/* {m.title} */}
								</Link>
							</li>
						)}
					</ul>
				</div>
			</div>
		)
	}
}

export default connect(
	(state) => ({activeMenu: state.sidebarMenu}),
)(Sidebar)