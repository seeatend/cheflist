import React, {Component} from 'react'
import { FormattedMessage } from 'react-intl'
import $ from 'jquery'
import { SERVER_URL } from '../../../config'
import './style.css'

class MyConnection extends Component {

	constructor(props) {
        super(props);
        this.state = {
            connections: props.connections,
            filtered: props.connections,
            refresh: props.refresh
        }
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            connections: newProps.connections,
            filtered: newProps.connections,
            refresh: newProps.refresh
		});
    }

    addConnection(connection) {
        let scope = this;
        $.ajax({
            method: 'POST',
            url: SERVER_URL + '/connection/connect/',
            headers: {
                'x-api-token': localStorage.getItem('accessToken')
            },
            data: {
                accountId: connection.uid,
                message: ''
            }
		}).done(function() {
            scope.state.refresh();
        })
    }

    filter() {
        let f = $('#vendor-filter').val();
        let filtered = this.state.connections.filter(function(con) {
            return con.meta.businessName.includes(f)
        })
        this.setState({
            filtered
        })
    }

    render() {
        let {filtered} = this.state;

        filtered.sort(function(a, b) {
            if (a.meta.businessName.toLowerCase() > b.meta.businessName.toLowerCase()) {
                return 1
            } else {
                return -1
            }
        })

		return (
            <div className="new-connection">
                <h3 className="u-mb-small">
                    <FormattedMessage id="mySuppliers.otherAvailableSuppliers"/>
                </h3>
                <input className="c-input" id="vendor-filter" type="text" placeholder="" onChange={() => this.filter()}/>
                <div className="c-table-responsive">
                    <p className="u-color-success">
                        {filtered.length} <FormattedMessage id="mySuppliers.connections"/>
                    </p>
                    <table className="c-table new-connection-table">
                        <thead className="c-table__head c-table__head--slim">
                            <tr className="c-table__row">
                                <th className="c-table__cell c-table__cell--head"><FormattedMessage id="mySuppliers.supplierName"/></th>
                                <th className="c-table__cell c-table__cell--head"><FormattedMessage id="mySuppliers.contact"/></th>
                                <th className="c-table__cell c-table__cell--head"><FormattedMessage id="mySuppliers.status"/></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map( (con, i) =>
                                <tr className="c-table__row" key={i}>
                                    <td className="c-table__cell name">
                                        {con.meta.businessName}
                                    </td>
                                    <td className="c-table__cell email">
                                        <small className="u-block u-text-info">{con.meta.address}</small>
                                        <small className="u-block u-text-info">{con.meta.phoneNumber}</small>
                                    </td>
                                    <td className="c-table__cell action">
                                        <a className="c-btn c-btn--secondary" onClick={()=>this.addConnection(con)}>
                                            <i className="fa fa-plus u-mr-xsmall"></i>
                                            <FormattedMessage id="mySuppliers.add"/>
                                        </a>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
		)
	}
}

export default MyConnection
