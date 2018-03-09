import React, {Component} from 'react'
import { SERVER_URL } from '../../../config'
import './style.css'

const $ = window.$;

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
        var scope = this;
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
        var f = $('#vendor-filter').val();
        var filtered = this.state.connections.filter(function(con) {
            console.log(con.meta.businessName, f, con.meta.businessName.includes(f));
            return con.meta.businessName.includes(f)
        })
        console.log(filtered);
        this.setState({
            filtered
        })
    }

    render() {
		var {filtered} = this.state;
		return (
            <div className="new-connection">
                <h3 className="u-mb-small">
                    Connect New Supplier
                </h3>
                <input className="c-input" id="vendor-filter" type="text" placeholder="Placeholder" onChange={() => this.filter()}/>
                <div className="c-table-responsive">
                    <table className="c-table my-connection-table">
                        <caption className="c-table__title">
                            {filtered.length} Connection
                        </caption>
                        <thead className="c-table__head c-table__head--slim">
                            <tr className="c-table__row">
                                <th className="c-table__cell c-table__cell--head">Business Name</th>
                                <th className="c-table__cell c-table__cell--head">Contact</th>
                                <th className="c-table__cell c-table__cell--head">Status</th>
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
                                            <i className="fa fa-plus u-mr-xsmall"></i>Add
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