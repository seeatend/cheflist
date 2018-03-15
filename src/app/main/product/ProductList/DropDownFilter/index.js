import React, {Component} from 'react'
import { FormattedMessage } from 'react-intl'

class DropDownFilter extends Component {

    constructor(props) {
        super(props);
        var options = ['All'].concat(this.props.options);
        this.state = {
            options: options,
            curOption: options[0]
        }
    }

    componentWillReceiveProps(newProps) {
        var options = ['All'].concat(newProps.options);
        this.setState({
            options
        });
    }

    update(option) {
        this.setState({
            curOption: option
        });
        this.props.action(option);
    }

	render() {
        var {options, curOption} = this.state;
		return (
            <div className={"c-dropdown dropdown " + this.props.className}>
                <button className="c-btn c-btn--secondary has-dropdown dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {curOption === 'All' ?
                        <FormattedMessage id="product.allSuppliers" />
                        :curOption
                    }
                </button>
                <div className="c-dropdown__menu dropdown-menu">
                    {options.map((option, i) =>
                        <a className="c-dropdown__item dropdown-item" key={i} onClick={() => this.update(option)}>{option}</a>
                    )}
                </div>
            </div>
		)
	}
}

export default DropDownFilter;