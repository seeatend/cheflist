import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Table } from 'semantic-ui-react';
import { formatPrice } from '../../../helpers';

const OrderProducts = props => {
    const { products, orderPrice, vendor } = props;
    return (
        <Table unstackable className='order-products-table'>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>
                        <FormattedMessage id="orderDetail.product"/>
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        <FormattedMessage id="product.price"/>
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        <FormattedMessage id="product.packagingUnit"/>
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        <FormattedMessage id="orderDetail.quantity"/>
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        <FormattedMessage id="orderDetail.totalPrice"/>
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                { products.map( (product, index) => (
                    <Table.Row key={index}>
                        <Table.Cell className='products-cell-productname'>
                            <p>{ product.name } ({ product.packageQuantity } { product.unit })</p>
                            <p>{ vendor.meta.businessName }</p>
                            <p>ID: { product.id }</p>
                        </Table.Cell>
                        <Table.Cell>
                            { formatPrice(product.price) } &euro;
                        </Table.Cell>
                        <Table.Cell>
                            { product.packaging }
                        </Table.Cell>
                        <Table.Cell>
                            { product.quantity }
                        </Table.Cell>
                        <Table.Cell>
                            <div className="u-color-success">
                                { formatPrice( product.price * product.quantity ) } &euro;
                            </div>
                        </Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
            <Table.Footer>
                <Table.Row>
                    <Table.HeaderCell colSpan={4} textAlign='right'>
                        <FormattedMessage id="orderDetail.orderTotal"/>:
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        <div className="u-color-success">
                            {formatPrice(orderPrice)} &euro;
                        </div>
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Footer>
        </Table>
    );
};

export default OrderProducts;
