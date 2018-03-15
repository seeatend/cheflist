import React, {Component} from 'react'
import { FormattedMessage } from 'react-intl'
import { SERVER_URL } from '../../../config'
import './style.css'

const $ = window.$;

class MyConnection extends Component {

	constructor(props) {
        super(props);
        this.state = {
            connections: props.connections,
            refresh: props.refresh
        }
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            connections: newProps.connections,
            refresh: newProps.refresh
		});
    }

    removeConnection(connection) {
        var scope = this;
        $.ajax({
            method: 'POST',
            url: SERVER_URL + '/connection/remove/'+connection.connectionId,
            headers: {
                'x-api-token': localStorage.getItem('accessToken')
            }
		}).done(function() {
            scope.state.refresh();
        })
    }

    render() {
        var {connections} = this.state;
		return (
            <div className="my-connection">
                <h3 className="u-mb-small">
                    <FormattedMessage id="mySuppliers.myConnections"/>
                </h3>
                <div className="c-table-responsive">
                    <p className="u-color-success">{connections.length} <FormattedMessage id="mySuppliers.connections"/></p>
                    <table className="c-table my-connection-table">
                        <thead className="c-table__head c-table__head--slim">
                            <tr className="c-table__row">
                                <th className="c-table__cell c-table__cell--head"><FormattedMessage id="mySuppliers.supplierName"/></th>
                                <th className="c-table__cell c-table__cell--head"><FormattedMessage id="mySuppliers.status"/></th>
                                <th className="c-table__cell c-table__cell--head">
                                    <span className="u-hidden-visually">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {connections.map( (con, i) =>
                                <tr className="c-table__row" key={i}>
                                    <td className="c-table__cell name">
                                        {con.meta.businessName}
                                    </td>
                                    <td className="c-table__cell status">
                                        {con.status === 'accepted' && <FormattedMessage id="mySuppliers.accepted"/>}
                                        {con.status === 'pending' && <FormattedMessage id="mySuppliers.pending"/>}
                                    </td>
                                    <td className="c-table__cell remove">
                                        <a className="c-btn c-btn--danger" onClick={()=>this.removeConnection(con)}>
                                            <i className="fa fa-trash-o u-mr-xsmall"></i>
                                            <FormattedMessage id="mySuppliers.remove"/>
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