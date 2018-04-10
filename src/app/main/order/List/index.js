import React, {Component} from 'react'
import moment from 'moment';
import { FormattedMessage } from 'react-intl'
import { sortBy } from 'lodash';
import OrdersTable from '../OrdersTable';
import './style.css'

class List extends Component {

	constructor(props) {
        super(props);
        this.state = {
			list: this.prepareTableData(),
			check: props.check,
			filtered: props.list,
			totalPrice: this.totalPrice(props.list),
			column: null,
			direction: null
		}
	}

	componentWillReceiveProps(newProps) {
        this.setState({
			totalPrice: this.totalPrice(newProps.list)
		});
    }

	componentDidUpdate(prevProps) {
		if( JSON.stringify(this.props.list) !== JSON.stringify(prevProps.list) )
			this.setState({
				list: this.prepareTableData()
			})
	}

	totalPrice(list) {
		let total = 0;
		list.forEach(d => {
			d.products.forEach(p => {
				total += p.price * p.quantity
			})
		});
		return total;
	}

	orderPrice(order) {
		let price = 0;
		order.products.forEach(function(p) {
			price += p.price * p.quantity
		});
		return price;
	}

	//Probably this can be optimized, i'm just too tired for today, to figure it out
	handleSort = ( clickedColumn, clickedDirection = '' ) => {
		const { column, direction, list } = this.state;
		const sortedList = sortBy(list, o => {
			if( clickedColumn === 'creationDate' || clickedColumn === 'deliveryDate' )
				return new moment(o[clickedColumn]).format('YYYYMMDD');

			return o[clickedColumn];
		});
		if( column !== clickedColumn ) {
			this.setState({
				column: clickedColumn,
				list: clickedDirection === 'descending' ? sortedList.reverse() : sortedList,
				direction: clickedDirection || 'ascending'
			});

			return;
		}

		this.setState({
			column: clickedColumn,
			list: clickedDirection
				? clickedDirection !== direction ? list.reverse() : list
				: list.reverse(),
			direction: clickedDirection || (!clickedDirection && (direction === 'ascending' ? 'descending' : 'ascending'))
		});
	}

	getReadableStatus = status => {
		switch(status) {
			case 0:
				return <FormattedMessage id="orderHistory.pending"/>;
			case 1:
				return <FormattedMessage id="orderHistory.confirmed"/>;
			case 2:
				return <FormattedMessage id="orderHistory.canceled"/>;
			default:
				return <FormattedMessage id="orderHistory.pending"/>;
		}
	}

	prepareTableData = () => {
		const preparedData = this.props.list.map( item => ({
			status: item.status,
			orderNumber: item.uid,
			creationDate: item.creationDate,
			supplier: item.vendor.meta.businessName,
			deliveryDate: item.deliveryDate,
			orderTotal: this.orderPrice(item),
			restaurant: item.restaurant,
			products: item.products,
			vendor: item.vendor
		}));
		return preparedData;
	}

	render() {
		let {list, check, column, direction} = this.state;
		return (
			<div className="order-list">
				<div className="row">
					<div className="col-sm-12 col-lg-6 col-xl-3">
						<div className="c-state-card total-order">
							<div className="c-state-card__content">
								<h5 className="c-state-card__number u-text-info">{list.length}</h5>
								<p>
									<FormattedMessage id="orderHistory.totalOrders"/>
								</p>
							</div>
						</div>
					</div>
				</div>
				<div className="row u-mb-large order-table">
					<div className='col-sm-12'>
						<OrdersTable
							orders={ list }
							handleSort={ this.handleSort }
							detailsClick={ check }
							column={ column }
							direction={ direction }
							getReadableStatus={ this.getReadableStatus } />
					</div>
				</div>
			</div>
		)
	}
}

export default List;
