import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Modal, Button, Icon } from 'semantic-ui-react';

class OrderReceivedModal extends Component {
    state = {
        hasErrors: false,
        errorMessage: ''
    }

    handleMessage = e => {
        this.setState({
            errorMessage: e.target.value
        });
    }

    handleConfirm = (hasErrors, errorMessage) => {
        this.props.onConfirm( (hasErrors && errorMessage) || '' );
    }

    handleErrorClick = () => {
        this.setState({
            hasErrors: !this.state.hasErrors
        })
    }

    render() {
        const { hasErrors, errorMessage } = this.state;
        const { onClose, isOpened, order } = this.props;
        return (
            <Modal
                closeIcon
                size='tiny'
                open={isOpened}
                onClose={ () => onClose()} >
                <Modal.Header>
                    <FormattedMessage id="orderHistory.modalHeader" values={{orderNumber: order}} />
                </Modal.Header>
                <Modal.Content>
                    { hasErrors
                        ? <div>
                            <FormattedMessage id="orderHistory.modalError" />
                            <textarea className='c-input' onChange={this.handleMessage} />
                        </div>
                        : <FormattedMessage id="orderHistory.modalContent" />
                    }
                </Modal.Content>
                <Modal.Actions>
                    <div className='modal-buttons-container'>
                        <Button
                            className='modal-button'
                            fluid
                            color={ !hasErrors ? 'red' : 'blue' }
                            icon
                            onClick={this.handleErrorClick} >
                            <Icon name='exclamation triangle' />&nbsp;
                            { hasErrors
                                ? <FormattedMessage id="orderHistory.negativeWithoutErrors" />
                                : <FormattedMessage id="orderHistory.negativeWithErrors" />
                            }
                        </Button>
                        <Button
                            className='modal-button'
                            fluid
                            positive
                            icon
                            onClick={() => this.handleConfirm(hasErrors, errorMessage)}>
                            <Icon name='check circle' />&nbsp;
                            { hasErrors
                                ? <FormattedMessage id="orderHistory.confirmWithErrors" />
                                : <FormattedMessage id="orderHistory.confirmWithoutErrors" />
                            }
                        </Button>
                    </div>
                </Modal.Actions>
            </Modal>
        );
    }
}

export default OrderReceivedModal;
