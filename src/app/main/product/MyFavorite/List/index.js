import React, {Component} from 'react'
import { FormattedMessage } from 'react-intl'
import './style.css'

class List extends Component {
    
    edit(item) {
        this.props.edit(item);
    }

	render() {
		return (
            <div className="my-favorite-list">
                <a className="c-btn c-btn--info create-new-fav">
                    <FormattedMessage id="product.createNewList"/>
                </a>
                {this.props.list.map((f, i) =>
                    <div className="c-card u-mb-medium my-favorite-item" key={i}>
                        <div className="u-p-medium" onClick={() => this.edit(f)}>
                            {f.name}
                            <a className="c-btn c-btn--success edit" onClick={() => this.edit(f)}>
                                <i className="fa fa-pencil-square-o u-mr-xsmall"></i>
                                <FormattedMessage id="product.view"/>
                            </a>
                            {/* <a className="c-btn c-btn--danger delete">
                                <i className="fa fa-trash-o u-mr-xsmall"></i>Delete
                            </a> */}
                        </div>
                    </div>
                )}
            </div>
		)
	}
}

export default List;