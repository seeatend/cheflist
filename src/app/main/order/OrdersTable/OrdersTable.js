import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Table, Button, Responsive, Dropdown, Checkbox, Popup } from 'semantic-ui-react';
import { formatPrice } from '../../../helpers';
import moment from 'moment';

const OrdersTable = props => {
    const { orders, detailsClick, handleSort, column, direction, getReadableStatus, handleCheckbox } = props;
    const columnsOptions = [
        {key: 'status', value: 'status', text: (<FormattedMessage id="orderHistory.status"/>)},
        {key: 'orderNumber', value: 'orderNumber', text: (<FormattedMessage id="orderHistory.orderNumber"/>)},
        {key: 'crationDate', value: 'creationDate', text: (<FormattedMessage id="orderHistory.creationDate"/>)},
        {key: 'supplier', value: 'supplier', text: (<FormattedMessage id="orderHistory.supplier"/>)},
        {key: 'deliveryDate', value: 'deliveryDate', text: (<FormattedMessage id="orderHistory.deliveryDate"/>)},
        {key: 'orderTotal', value: 'orderTotal', text: (<FormattedMessage id="orderHistory.orderTotal"/>)}
    ];
    const directionOptions = [
        {key: 'ascending', value: 'ascending', text: 'Ascending'},
        {key: 'descending', value: 'descending', text: 'Descending'}
    ];
    return (
        <div>
            <Responsive {...Responsive.onlyMobile} >
                <Dropdown selection placeholder='Sort by...' options={columnsOptions} onChange={ (e, {value}) => handleSort(value, this.directionDropdown.state.value)} />
                <Dropdown ref={ node => this.directionDropdown = node} defaultValue={ direction || 'ascending' } selection placeholder='Sorting order' options={directionOptions} onChange={ (e, {value}) => handleSort(column, value) } />
            </Responsive>
            <Table sortable>
                    <Responsive as={Table.Header} minWidth={Responsive.onlyTablet.minWidth} >
                        <Table.Row>
                            {/*<Table.HeaderCell>
                            </Table.HeaderCell>*/}
                            <Table.HeaderCell sorted={ column === 'status' ? direction : null } onClick={ () => handleSort('status') }>
                                <FormattedMessage id="orderHistory.status"/>
                            </Table.HeaderCell>
                            <Table.HeaderCell sorted={ column === 'orderNumber' ? direction : null } onClick={ () => handleSort('orderNumber') }>
                                <FormattedMessage id="orderHistory.orderNumber"/>
                            </Table.HeaderCell>
                            <Table.HeaderCell sorted={ column === 'creationDate' ? direction : null } onClick={ () => handleSort('creationDate') }>
                                <FormattedMessage id="orderHistory.creationDate"/>
                            </Table.HeaderCell>
                            <Table.HeaderCell sorted={ column === 'supplier' ? direction : null } onClick={ () => handleSort('supplier') }>
                                <FormattedMessage id="orderHistory.supplier"/>
                            </Table.HeaderCell>
                            <Table.HeaderCell sorted={ column === 'deliveryDate' ? direction : null } onClick={ () => handleSort('deliveryDate') }>
                                <FormattedMessage id="orderHistory.deliveryDate"/>
                            </Table.HeaderCell>
                            <Table.HeaderCell sorted={ column === 'orderTotal' ? direction : null } onClick={ () => handleSort('orderTotal') }>
                                <FormattedMessage id="orderHistory.orderTotal"/>
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                <FormattedMessage id="orderHistory.more"/>
                            </Table.HeaderCell>
                        </Table.Row>
                    </Responsive>
                <Table.Body>
                    { orders.map( (order, index) => (
                        <Table.Row key={index}>
                            {/*<Table.Cell collapsing>
                                <Popup
                                    trigger={
                                        <Checkbox toggle disabled={order.status === 2} checked={order.status === 2} onChange={ (e, {checked}) => handleCheckbox(checked, order.orderNumber) } />
                                    }
                                    content={<FormattedMessage id="orderHistory.checkboxHint" />}
                                    on='hover' />
                            </Table.Cell>*/}
                            <Table.Cell collapsing>
                                <Responsive as={'span'} {...Responsive.onlyMobile}>
                                    <FormattedMessage id="orderHistory.status"/>:&nbsp;
                                </Responsive>
                                { getReadableStatus(order.status) }
                            </Table.Cell>
                            {/*TODO: change to order.number, when it'll be available*/}
                            <Table.Cell>
                                <Responsive as={'span'} {...Responsive.onlyMobile}>
                                    <FormattedMessage id="orderHistory.orderNumber"/>:&nbsp;
                                </Responsive>
                                { order.orderNumber}
                            </Table.Cell>
                            <Table.Cell collapsing>
                                <Responsive as={'span'} {...Responsive.onlyMobile}>
                                    <FormattedMessage id="orderHistory.creationDate"/>:&nbsp;
                                </Responsive>
                                { moment(order.creationDate).format('MMM DD, YYYY') }
                            </Table.Cell>
                            <Table.Cell>
                                <Responsive as={'span'} {...Responsive.onlyMobile}>
                                    <FormattedMessage id="orderHistory.supplier"/>:&nbsp;
                                </Responsive>
                                { order.supplier }
                            </Table.Cell>
                            <Table.Cell collapsing>
                                <Responsive as={'span'} {...Responsive.onlyMobile}>
                                    <FormattedMessage id="orderHistory.deliveryDate"/>:&nbsp;
                                </Responsive>
                                { moment(order.deliveryDate).format('MMM DD, YYYY') }
                            </Table.Cell>
                            <Table.Cell collapsing className='u-text-success'>
                                <Responsive as={'span'} {...Responsive.onlyMobile}>
                                    <FormattedMessage id="orderHistory.orderTotal"/>:&nbsp;
                                </Responsive>
                                { formatPrice(order.orderTotal) } &euro;
                            </Table.Cell>
                            <Table.Cell collapsing>
                                <Button color='blue' onClick={ () => detailsClick(order)}>
                                    <FormattedMessage id="orderHistory.details"/>
                                </Button>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </div>
    );
}

export default OrdersTable;
