import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { SIDEBAR_MENU_LIST } from '../../config';

const Sidebar = (props) => {
	return(
	<div className="o-page__sidebar js-page-sidebar">
		<div className="c-sidebar">
			<a className="c-sidebar__brand" href="/home">
				<img className="c-sidebar__brand-img" src="/ui-kit/img/logo.png" alt="Logo" /> CHEFSLIST
			</a>
			<h4 className="c-sidebar__title">Restaurant</h4>
			<ul className="c-sidebar__list">
				{SIDEBAR_MENU_LIST.map((m, i) =>
					<li className="c-sidebar__item" key={i}>
						<Link className={props.activeMenu.index === m.index?"c-sidebar__link is-active":"c-sidebar__link"} to={m.link}>
							<i className={"fa " + m.icon + " u-mr-xsmall"}></i>{m.title}
						</Link>
					</li>
				)}
			</ul>
		</div>
	</div>
	)
}

export default connect(
	(state) => ({activeMenu: state.sidebarMenu}),
)(Sidebar)