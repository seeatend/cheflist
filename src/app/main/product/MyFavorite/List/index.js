import React, {Component} from 'react'
import { FormattedMessage } from 'react-intl'
import { Button, Card } from 'semantic-ui-react';
import './style.css'

class List extends Component {
	render() {
        let { list, view, deleteList } = this.props;
        const sortedList = list.slice().sort( (a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1 );
		return (
            <div className="my-favorite-list">
                <Button.Group floated='right' className="create-new-fav">
                    <Button color='blue' onClick={() => this.props.new()}>
                        <FormattedMessage id="product.createNewList"/>
                    </Button>
                </Button.Group>
                {sortedList.map( (f, i) =>
                    (<Card fluid key={i}>
                        <Card.Content onClick={ () => view(f) }>
                            <div className='my-favorites-card'>
                                {f.name}
                                <Button.Group floated='right'>
                                    <Button color='green' onClick={ () => view(f) }>
                                        <i className='fa fa-pencil-square-o u-mr-xsmall'></i>
                                        <FormattedMessage id='product.view' />
                                    </Button>
                                    <Button color='red' onClick={ () => deleteList(f) } >
                                        <i className='fa fa-times u-mr-xsmall'></i>
                                        Delete
                                    </Button>
                                </Button.Group>
                            </div>
                        </Card.Content>
                    </Card>)
                )}
            </div>
		)
	}
}

export default List;
