import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { formatPrice } from '../../../helpers';
import { Responsive, Button, Modal } from 'semantic-ui-react';

class CheckoutBox extends Component {
    state = {
        modalIsOpened: false
    }

    onModalClose = () => {
        this.setState({
            modalIsOpened: false
        });
    }

    onModalConfirm = () => {
        this.props.bulkOrder();
        this.setState({
            modalIsOpened: false
        });
    }

    openModal = () => {
        this.setState({
            modalIsOpened: true
        });
    }

    render () {
        const { totalPrice } = this.props;
        return (
            <div>
                <Modal size='mini' open={this.state.modalIsOpened} onClose={this.onModalClose}>
                    <Modal.Header>
                        <FormattedMessage id="cart.sendAllOrders"/>
                    </Modal.Header>
                    <Modal.Content>
                        <FormattedMessage id="cart.modalMessage" />
                    </Modal.Content>
                    <Modal.Actions>
                        <Button
                            negative
                            icon='cancel'
                            content={<FormattedMessage id="cart.modalNo" />}
                            onClick={this.onModalClose} />
                        <Button
                            positive
                            icon='check'
                            content={<FormattedMessage id="cart.modalYes" />}
                            onClick={this.onModalConfirm} />
                    </Modal.Actions>
                </Modal>
                <Responsive minWidth={Responsive.onlyTablet.minWidth}>
                        <div className="c-card u-p-medium u-mb-medium">
                            <h3 className="u-mb-small">
                                <FormattedMessage id="cart.checkoutSummary"/>
                            </h3>
                            <h3 className="u-mb-small">
                                <div className="title">
                                    <FormattedMessage id="cart.total"/>
                                </div>
                                <div className="price">
                                    {formatPrice(totalPrice)} &euro;
                                </div>
                            </h3>
                            <p className="u-mb-xsmall">
                                <Button fluid positive onClick={()=>this.bulkOrder()}>
                                    <FormattedMessage id="cart.sendAllOrders"/>
                                </Button>
                            </p>
                            {/* <p className="u-mb-xsmall">
                                <a className="c-btn c-btn--secondary c-btn--fullwidth">Remove all orders from cart</a>
                            </p> */}
                        </div>
                </Responsive>
                <Responsive {...Responsive.onlyMobile} className='checkout-summary-mobile'>
                    <Button
                        onClick={ this.openModal }
                        positive
                        content={<FormattedMessage id="cart.sendAllOrders" />}
                        icon='cart'
                        label={{
                            color: 'green',
                            pointing: 'left',
                            content: (
                                <span>{formatPrice(totalPrice)} &euro;</span>
                            )}}
                        />
                </Responsive>
            </div>
        );
    }
}

export default CheckoutBox;
