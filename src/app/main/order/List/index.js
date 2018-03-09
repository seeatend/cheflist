import React, {Component} from 'react'
import './style.css'

const moment = window.moment;

class List extends Component {

	constructor(props) {
        super(props);
        this.state = {
			list: props.list,
			check: null,
			filtered: props.list,
			totalPrice: this.totalPrice(props.list)
		}
	}
	
	componentWillReceiveProps(newProps) {
        this.setState({
			list: newProps.list,
			check: newProps.check,
			filtered: newProps.list,
			totalPrice: this.totalPrice(newProps.list)
		});
    }

	totalPrice(list) {
		var total = 0;
		list.forEach(d => {
			d.products.forEach(p => {
				total += p.price * p.quantity
			})
		});
		return total;
	}

	orderPrice(order) {
		var price = 0;
		order.products.forEach(function(p) {
			price += p.price * p.quantity
		});
		return price;
	}

	render() {
		var {list, check, filtered, totalPrice} = this.state;
		return (
			<div className="order-list">
				<div className="row">
					<div className="col-sm-12 col-lg-6 col-xl-3">
						<div className="c-state-card total-order">
							<div className="c-state-card__content">
								<h5 className="c-state-card__number u-text-info">{list.length}</h5>
								<p>Total Orders</p>
							</div>
						</div>
					</div>
					<div className="col-sm-12 col-lg-6 col-xl-3">
						<div className="c-state-card total-order">
							<div className="c-state-card__content">
								<h5 className="c-state-card__number u-text-success">&euro; {totalPrice.toFixed(2)}</h5>
								<p>Total Purchases</p>
							</div>
						</div>
					</div>
				</div>
                {/* <div className="row">
					<div className="col-sm-12">
						<div className="c-state-card filter">
							<div className="c-state-card__content">
                                <div className="c-form-field search-filter">
                                    <label className="c-field__label" htmlFor="input17">Search</label>
                                    <input className="c-input" id="input17" type="text" placeholder="Search for orders here ..." />
                                </div>
                                <div className="c-dropdown dropdown status-filter">
									<button className="c-btn c-btn--secondary has-dropdown dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">All Statuses</button>
									<div className="c-dropdown__menu dropdown-menu">
										<a className="c-dropdown__item dropdown-item">Statu1</a>
										<a className="c-dropdown__item dropdown-item">Statu2</a>
										<a className="c-dropdown__item dropdown-item">Statu3</a>
									</div>
								</div>
                                <div className="c-dropdown dropdown supplier-filter">
									<button className="c-btn c-btn--secondary has-dropdown dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">All Suppliers</button>
									<div className="c-dropdown__menu dropdown-menu">
										<a className="c-dropdown__item dropdown-item">Supplier1</a>
										<a className="c-dropdown__item dropdown-item">Supplier2</a>
										<a className="c-dropdown__item dropdown-item">Supplier3</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div> */}
				<div className="row u-mb-large order-table">
					<div className="col-sm-12">
						<div className="c-table-responsive">
							<table className="c-table">
								<caption className="c-table__title">
                                    {filtered.length} orders
								</caption>
								<thead className="c-table__head c-table__head--slim">
									<tr className="c-table__row">
										<th className="c-table__cell c-table__cell--head">Status</th>
										<th className="c-table__cell c-table__cell--head">Order #</th>
										<th className="c-table__cell c-table__cell--head">Creation Date</th>
										<th className="c-table__cell c-table__cell--head">Supplier</th>
										<th className="c-table__cell c-table__cell--head">Delivery Date</th>
										<th className="c-table__cell c-table__cell--head">Order Total</th>
										<th className="c-table__cell c-table__cell--head">More</th>
									</tr>
								</thead>
								<tbody>
									{filtered.map((order, i) =>
										<tr className="c-table__row" key={i}>
											<td className="c-table__cell status">
												{order.status}
											</td>
											<td className="c-table__cell order-number">
												{order.uid}
											</td>
											<td className="c-table__cell creation-date">
												{moment(order.creationDate).format('MMM DD, YYYY hh:mm:ss A')}
											</td>
											<td className="c-table__cell supplier">
												{order.vendor.meta.businessName}
											</td>
											<td className="c-table__cell delivery-date">
												{moment(order.deliveryDate).format('MMM DD, YYYY hh:mm:ss A')}
											</td>
											<td className="c-table__cell u-text-success order-total">
												&euro; {this.orderPrice(order).toFixed(2)}
											</td>
											<td className="c-table__cell more">
												<a className="c-btn c-btn--info" onClick={() => check(order)}>
													Check-in
												</a>
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>
						{/* <nav className="c-pagination u-mt-small u-justify-between">
							<a className="c-pagination__control">
								<i className="fa fa-caret-left"></i>
							</a>

							<p className="c-pagination__counter">Page 1 of 3</p>

							<a className="c-pagination__control">
								<i className="fa fa-caret-right"></i>
							</a>
						</nav> */}
					</div>
				</div>
			</div>
		)
	}
}

export default List;