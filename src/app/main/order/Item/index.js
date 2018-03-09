import React, {Component} from 'react'
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
				<a className="c-btn c-btn--secondary back-to-list" onClick={() => back()}>&lt; Back</a>
				<div className="row">
                    <div className="col-lg-8 col-sm-12">
						<div className="c-card u-p-medium u-mb-medium">
							<h4 className="u-mb-small">
								<div className="vendor-name">Order #{item.uid}</div>
							</h4>
							<ul className="summary-list order-from">
								<li>
									<div className="label">Submitted By:</div>
									<div className="content">{item.restaurant.firstName} {item.restaurant.lastName}</div>
									<div className="content">{item.restaurant.meta.address}</div>
								</li>
								<li>
									<div className="label">Phone:</div>
									<div className="content">{item.restaurant.meta.phoneNumber}</div>
								</li>
								<li>
									<div className="label">Placed By:</div>
									<div className="content">{item.restaurant.meta.businessName}</div>
								</li>
								<li>
									<div className="label">Email:</div>
									<div className="content"></div>
								</li>
								<li>
									<div className="label">Requested Delivery Date:</div>
									<div className="content">{moment(item.deliveryDate).format('MMM DD, YYYY hh:mm:ss A')}</div>
								</li>
							</ul>
							<ul className="summary-list order-to">
								<li>
									<div className="label">To:</div>
									<div className="content">{item.vendor.firstName} {item.vendor.lastName}</div>
									<div className="content">{item.vendor.meta.address}</div>
								</li>
								<li>
									<div className="label">Phone:</div>
									<div className="content">{item.vendor.meta.phoneNumber}</div>
								</li>
								<li>
									<div className="label">Order Date:</div>
									<div className="content">{moment(item.creationDate).format('MMM DD, YYYY hh:mm:ss A')}</div>
								</li>
								<li>
									<div className="label">Delivery Date:</div>
									<div className="content">{moment(item.deliveryDate).format('MMM DD, YYYY hh:mm:ss A')}</div>
								</li>
							</ul>
							<div className="row u-mb-large item-table">
								<div className="col-sm-12">
									<div className="c-table-responsive">
										<table className="c-table">
											<thead className="c-table__head c-table__head--slim">
												<tr className="c-table__row">
													<th className="c-table__cell c-table__cell--head">Quantity</th>
													<th className="c-table__cell c-table__cell--head">Product</th>
													<th className="c-table__cell c-table__cell--head">Price/Unit</th>
													<th className="c-table__cell c-table__cell--head">Total Price</th>
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
								<p className="u-color-info">Order Messages:</p>
								<p className="message-content">
									{item.message}
								</p>
							</div>
						</div>
                    </div>
					<div className="col-lg-4 col-sm-12 summary-box">
						<div className="c-card u-p-medium u-mb-medium">
							<h3 className="u-mb-small">
								Order Summary
							</h3>
							<ul className="summary-list">
								<li>
									<div className="label">Order Date:</div>
									<div className="content">{moment(item.creationDate).format('MMM DD, YYYY hh:mm:ss A')}</div>
								</li>
								<li>
									<div className="label">Delivery Charge:</div>
									<div className="content">TBD</div>
								</li>
								<li>
									<div className="label">Order Total:</div>
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