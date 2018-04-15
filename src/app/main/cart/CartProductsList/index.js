import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Table, Button, Input, Responsive } from 'semantic-ui-react';
import { formatPrice } from '../../../helpers';

const CartProductsList = props => {
    const { products, quantities, removeProduct, onIncrement, onDecrement, onInputChange, cart } = props;
    return (
        <Table className='cart-products-table'>
            <Responsive as={Table.Header} minWidth={Responsive.onlyTablet.minWidth} >
                <Table.Row>
                    <Table.HeaderCell>
                        <FormattedMessage id="cart.no"/>
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        <FormattedMessage id="cart.item"/>
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        <FormattedMessage id="cart.quantity"/>
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        <FormattedMessage id="cart.total"/>
                    </Table.HeaderCell>
                    <Table.HeaderCell />
                </Table.Row>
            </Responsive>
            <Table.Body>
                { products.map( (product, index) => (
                    <Table.Row key={ index } >
                        <Table.Cell collapsing>{ index+1 }</Table.Cell>
                        <Table.Cell>{ product.name }</Table.Cell>
                        <Table.Cell collapsing>
                            <Input
                                className='quantity-input'
                                type='number'
                                onChange={ e => onInputChange(product, e.target.value) }
                                value={ quantities[product.uid] || '' } >
                                <Button basic={ quantities[product.uid] > 1 } disabled={ quantities[product.uid] < 2 } onClick={ () => onDecrement(product) }>-</Button>
                                <input className='quantity-field' />
                                <Button basic onClick={ () => onIncrement(product) }>+</Button>
                            </Input>
                        </Table.Cell>
                        <Table.Cell collapsing>{ formatPrice(product.price * quantities[product.uid]) } &euro;</Table.Cell>
                        <Table.Cell collapsing>
                            <Button basic onClick={ () => removeProduct(cart, product) }>
                                <FormattedMessage id="cart.remove"/>
                            </Button>
                        </Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
}

export default CartProductsList;
