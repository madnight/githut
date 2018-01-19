import React from 'react'
import { observer } from 'mobx-react'
import Select from 'react-select';
import 'react-select/dist/react-select.css';

/**
 * Simple bootstrap select button to select the year
 * for the language ranking table
 * @author Fabian Beuke <mail@beuke.org>
 * @license AGPL-3.0
 */
@observer
export default class SelectYear extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            options: [
                  { value: '2017', label: '2017' },
                  { value: '2016', label: '2016' },
                  { value: '2015', label: '2015' },
                  { value: '2014', label: '2014' }
            ],
            value: this.props.match.params.year
        }
        this.onChange = this.onChange.bind(this)
    }

    static propTypes = {
        hist: React.PropTypes.any.isRequired,
        match: React.PropTypes.any.isRequired,
        history: React.PropTypes.any.isRequired,
        location: React.PropTypes.any.isRequired
    }

    onChange(value) {
        const { match } = this.props
        this.props.hist.data.year = value
        this.setState({ value })
        this.props.history.push(
              "/" + match.params.event
            + "/" + value
            + "/" + match.params.quarter)
    }

    componentWillMount() {
        const { match } = this.props
        const value = match.params.year
        this.props.hist.data.year = value
        this.setState({ value })
    }

    render () {
        return (
        <div>
        <h4 className="section-heading">Year</h4>
            <Select
              label="States"
              onChange={this.onChange}
              options={this.state.options}
              simpleValue
              searchable={false}
              clearable={false}
              value={this.state.value}
           />
        </div>
        );
    }
}
