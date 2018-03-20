import React, {Component} from 'react'
import { FormattedMessage } from 'react-intl'
import './style.css'

class List extends Component {
    
    view(item) {
        this.props.view(item);
    }

	render() {
        var {list} = this.props;
        list.sort(function(a, b) {
            if (a.name.toLowerCase() > b.name.toLowerCase()) {
                return 1
            } else {
                return -1
            }
        });
		return (
            <div className="my-favorite-list">
                <a className="c-btn c-btn--info create-new-fav" onClick={() => this.props.new()}>
                    <FormattedMessage id="product.createNewList"/>
                </a>
                {list.map((f, i) =>
                    <div className="c-card u-mb-medium my-favorite-item" key={i}>
                        <div className="u-p-medium" onClick={() => this.view(f)}>
                            {f.name}
                            <a className="c-btn c-btn--success view" onClick={() => this.view(f)}>
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