import React, {Component} from 'react'
import { connect } from 'react-redux'
import $ from 'jquery';
import { SERVER_URL } from '../../config'
import { sidebar_menu_update } from '../../reducer/sidebar_menu'
import MyConnection from './MyConnection'
import NewConnection from './NewConnection'

import './style.css'

class Supplier extends Component {

	constructor(props) {
        super(props);
        this.state = {
			vendors: [],
			acceptedVendors: [],
			pendingVendors: [],
        }
    }

	componentDidMount() {
		this.props.sidebar_menu_update({
			index: 'rest-supplier',
			navTitle: 'menu.mySuppliers'
		});
		this.load();
	}

	load() {
		let scope = this;

		this.getVendors().done(function(response) {
			let vendors = response.vendors;

			scope.getAcceptedConnection().done(function(response) {
				scope.setState({
					acceptedVendors: scope.getConnectedVendors(response.connections, vendors, 'accepted')
				});
			});

			scope.getPendingConnection().done(function(response) {
				scope.setState({
					pendingVendors: scope.getConnectedVendors(response.connections, vendors, 'pending')
				});
			});

			scope.setState({
				vendors
			})
		})
	}

	getAcceptedConnection() {
        return $.ajax({
            method: 'GET',
            url: SERVER_URL + '/connection/accepted',
            headers: {
                'x-api-token': localStorage.getItem('accessToken')
            }
		});
	}

	getPendingConnection() {
        return $.ajax({
            method: 'GET',
            url: SERVER_URL + '/connection/pending',
            headers: {
                'x-api-token': localStorage.getItem('accessToken')
            }
        });
	}

	getVendors() {
		return $.ajax({
            method: 'GET',
            url: SERVER_URL + '/connection/vendors',
            headers: {
                'x-api-token': localStorage.getItem('accessToken')
            }
		});
	}

	getConnectedVendors(connections, vendors, status) {
		let connected = connections.map(function(d) {
			let v = vendors.filter(function(vendor) {
				return vendor.uid === d.accountId
			})[0];
			v.status = status;
			v.connectionId = d.uid;
			return v;
		});
		return connected;
	}

	getNewVendors() {
		let {acceptedVendors, pendingVendors, vendors} = this.state;
		let acceptedUid = acceptedVendors.map(function(d) {
			return d.uid
		});
		let pendingUid = pendingVendors.map(function(d) {
			return d.uid
		});
		let uids = acceptedUid.concat(pendingUid);
		let newVendors = vendors.filter(function(v) {
			return uids.indexOf(v.uid) === -1
		});
		return newVendors;
	}

	render() {
		let {acceptedVendors, pendingVendors} = this.state;
		return (
			<div className="container-fluid my-supplier">
                <div className="row">
					<div className="col-lg-6 col-sm-12">
						<div className="c-card u-p-medium u-mb-medium">
							<MyConnection connections={acceptedVendors.concat(pendingVendors)} refresh={()=>this.load()}/>
						</div>
					</div>
                    <div className="col-lg-6 col-sm-12">
						<div className="c-card u-p-medium u-mb-medium">
							<NewConnection connections={this.getNewVendors()} refresh={()=>this.load()}/>
						</div>
                    </div>
                </div>
            </div>
		)
	}
}

export default connect(
	(state) => ({activeMenu: state.sidebarMenu}),
	{ sidebar_menu_update }
)(Supplier)
