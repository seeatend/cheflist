import React, {Component} from 'react'
import { FormattedMessage } from 'react-intl'
import './style.css'

const moment = window.moment;

class Item extends Component {

	orderPrice(order) {
		var price = 0;
		order.products.forEach(function(p) {
			price += p.price * p.quantity
		});
		return price;
	}

	render() {
		var {item, back} = this.props;
		return (
			<div className="order-item">
				<a className="c-btn c-btn--secondary back-to-list" onClick={() => back()}>
					&lt; <FormattedMessage id="orderDetail.back"/>
				</a>
				<div className="row">
                    <div className="col-lg-8 col-sm-12">
						<div className="c-card u-p-medium u-mb-medium">
							<h4 className="u-mb-small">
								<div className="vendor-name"><FormattedMessage id="orderDetail.orderNum"/> {item.uid}</div>
							</h4>
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
								<li>
									<div className="label"><FormattedMessage id="orderDetail.requestedDeliveryDate"/>:</div>
									<div className="content">{moment(item.deliveryDate).format('MMM DD, YYYY')}</div>
								</li>
							</ul>
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
							<div className="row u-mb-large item-table">
								<div className="col-sm-12">
									<div className="c-table-responsive">
										<table className="c-table">
											<thead className="c-table__head c-table__head--slim">
												<tr className="c-table__row">
													<th className="c-table__cell c-table__cell--head"><FormattedMessage id="orderDetail.quantity"/></th>
													<th className="c-table__cell c-table__cell--head"><FormattedMessage id="orderDetail.product"/></th>
													<th className="c-table__cell c-table__cell--head"><FormattedMessage id="orderDetail.priceUnit"/></th>
													<th className="c-table__cell c-table__cell--head"><FormattedMessage id="orderDetail.totalPrice"/></th>
												</tr>
											</thead>
											<tbody>
												{item.products.map((p,i) =>
													<tr className="c-table__row" key={i}>
														<td className="c-table__cell quantity">
															{p.quantity}
														</td>
														<td className="c-table__cell product-details">
															<div className="u-color-info">{p.name}</div>
														</td>
														<td className="c-table__cell price-unit">
															&euro; {p.price.toFixed(2)}/{p.unit}
														</td>
														<td className="c-table__cell total-price">
															<div className="u-color-success">&euro; {(p.price * p.quantity).toFixed(2)}</div>
														</td>
													</tr>
												)}
											</tbody>
										</table>
									</div>
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
					<div className="col-lg-4 col-sm-12 summary-box">
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
									<div className="content u-text-success">&euro; {this.orderPrice(item).toFixed(2)}</div>
								</li>
							</ul>
						</div>
					</div>
                </div>
			</div>
		)
	}
}

export default Item;