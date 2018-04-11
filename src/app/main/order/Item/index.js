import React, {Component} from 'react';
import moment from 'moment';
import { FormattedMessage } from 'react-intl'
import { formatPrice } from '../../../helpers';
import { OrderProducts } from '../OrdersTable';
import './style.css';

class Item extends Component {

	orderPrice(order) {
		let price = 0;
		order.products.forEach(function(p) {
			price += p.price * p.quantity
		});
		return price;
	}

	render() {
		let {item, back} = this.props;
		return (
			<div className="order-item">
				<a className="c-btn c-btn--secondary back-to-list" onClick={() => back()}>
					&lt; <FormattedMessage id="orderDetail.back"/>
				</a>
				<div className="row">
                    <div className="col-sm-12">
						<div className="c-card u-p-medium u-mb-medium">
							<h4 className="u-mb-small">
								<div className="vendor-name"><FormattedMessage id="orderDetail.orderNum"/> {item.orderNumber}</div>
							</h4>
							<div className='order-details-container'>
								<ul className="summary-list order-from">
									<li>
										<div className="label"><FormattedMessage id="orderDetail.submittedBy"/>:</div>
										<div className="content">{item.restaurant.firstName} {item.restaurant.lastName}</div>
										<div className="content">{item.restaurant.meta.address}</div>
									</li>
									<li>
										<div className="label"><FormattedMessage id="orderDetail.phone"/>:</div>
										<div className="content">{item.restaurant.meta.phoneNumber}</div>
									</li>
									<li>
										<div className="label"><FormattedMessage id="orderDetail.business"/>:</div>
										<div className="content">{item.restaurant.meta.businessName}</div>
									</li>
									<li>
										<div className="label"><FormattedMessage id="orderDetail.email"/>:</div>
										<div className="content"></div>
									</li>
								</ul>
								<hr className='order-details-separator' />
								<ul className="summary-list order-to">
									<li>
										<div className="label"><FormattedMessage id="orderDetail.to"/>:</div>
										<div className="content">{item.vendor.firstName} {item.vendor.lastName}</div>
										<div className="content">{item.vendor.meta.address}</div>
									</li>
									<li>
										<div className="label"><FormattedMessage id="orderDetail.phone"/>:</div>
										<div className="content">{item.vendor.meta.phoneNumber}</div>
									</li>
									<li>
										<div className="label"><FormattedMessage id="orderDetail.orderDate"/>:</div>
										<div className="content">{moment(item.creationDate).format('MMM DD, YYYY')}</div>
									</li>
									<li>
										<div className="label"><FormattedMessage id="orderDetail.deliveryDate"/>:</div>
										<div className="content">{moment(item.deliveryDate).format('MMM DD, YYYY')}</div>
									</li>
								</ul>
							</div>
							<div className="row u-mb-large item-table">
								<div className="col-sm-12">
									<OrderProducts
										products={ item.products }
										orderPrice={ this.orderPrice(item) } />
								</div>
							</div>
							<div className="c-feed__comment order-message">
								<p className="u-color-info"><FormattedMessage id="orderDetail.orderMessage"/>:</p>
								<p className="message-content">
									{item.message}
								</p>
							</div>
						</div>
                    </div>
					{/*<div className="col-lg-4 col-sm-12 summary-box">
						<div className="c-card u-p-medium u-mb-medium">
							<h3 className="u-mb-small">
								<FormattedMessage id="orderDetail.orderSummary"/>
							</h3>
							<ul className="summary-list">
								<li>
									<div className="label"><FormattedMessage id="orderDetail.orderDate"/>:</div>
									<div className="content">{moment(item.creationDate).format('MMM DD, YYYY')}</div>
								</li>
								<li>
									<div className="label"><FormattedMessage id="orderDetail.deliveryCharge"/>:</div>
									<div className="content">TBA</div>
								</li>
								<li>
									<div className="label"><FormattedMessage id="orderDetail.orderTotal"/>:</div>
									<div className="content u-text-success">
										{formatPrice(this.orderPrice(item))} &euro;
									</div>
								</li>
							</ul>
						</div>
					</div>*/}
                </div>
			</div>
		)
	}
}

export default Item;
