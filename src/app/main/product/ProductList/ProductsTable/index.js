import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Table, Input, Button } from 'semantic-ui-react';

const ProductsTable = props => {
    const { productsList, onInputChange, onIncrement, onDecrement, quantities, getVendorName, getButton } = props;
    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell><FormattedMessage id="product.productName"/></Table.HeaderCell>
                    <Table.HeaderCell collapsing><FormattedMessage id="product.price"/></Table.HeaderCell>
                    <Table.HeaderCell collapsing><FormattedMessage id="product.packagingUnit"/></Table.HeaderCell>
                    <Table.HeaderCell><FormattedMessage id="product.qty"/></Table.HeaderCell>
                    <Table.HeaderCell></Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                { productsList.map( (product, index) => (
                        <Table.Row key={index}>
                            <Table.Cell className='products-cell-productname' >
                                <p>{ product.name} ({product.quantity} {product.unit})</p>
                                <p>{ getVendorName(product.vendor) }</p>
                                <p>ID: { product.id }</p>
                            </Table.Cell>
                            <Table.Cell>{product.price.toFixed(2).replace('.', ',')} &euro;</Table.Cell>
                            <Table.Cell>{product.packaging}</Table.Cell>
                            <Table.Cell collapsing>
                                <Input
                                    className='quantity-input'
                                    type='number'
                                    onChange={ e => onInputChange(product, e.target.value) }
                                    value={ quantities[product.uid] } >
                                    <Button basic onClick={ () => onDecrement(product) }>-</Button>
                                    <input className='quantity-field' />
                                    <Button basic onClick={ () => onIncrement(product) }>+</Button>
                                </Input>
                            </Table.Cell>
                            <Table.Cell collapsing>
                                { getButton(product) }
                            </Table.Cell>
                        </Table.Row>
                    ))
                }
            </Table.Body>
        </Table>
    );
}

export default ProductsTable;
