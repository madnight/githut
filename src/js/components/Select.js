import React from 'react'
import ReactSelect from 'react-select'
import { range, toString } from 'lodash/fp'
import { getMaxDataDate } from '../utils.js'
import 'react-select/dist/react-select.css'

export default class Select extends React.Component {
    vals (start, end) {
        return range(--start, end).map(i =>
            ({
                value: toString(i + 1),
                label: toString(i + 1)
            }))
    }

    constructor (props) {
        super(props)
        this.year = false
        this.onChange = this.onChange.bind(this)
    }

    // shouldComponentUpdate(nextProps, nextState) {
    // return this.state !== nextState
    // }

    setValue (value) {
        if (this.year) { this.props.hist.data.year = value } else { this.props.hist.data.quarter = value }
        this.setState({ value })
    }

    componentWillMount () {
        getMaxDataDate().then(maxDate => {
            this.setState({
                options: this.year ? this.vals(2014, maxDate.year) : this.vals(1, 4),
                value: this.year ? this.props.match.params.year : this.props.match.params.quarter
            })
        })
        const { params } = this.props.match
        const value = this.year ? params.year : params.quarter
        this.setValue(value)
    }

    histPush (x, y, z) {
        this.props.history.push(
            '/' + x
            + '/' + y
            + '/' + z)
    }

    onChange (value) {
        const { params } = this.props.match
        this.setValue(value)
        if (this.year) { this.histPush(params.event, value, params.quarter) } else { this.histPush(params.event, params.year, value) }
    }

    render (x) {
        return (
            <div>
                <h4 className="section-heading">
                    {this.year ? 'Year' : 'Quarter'}</h4>
                <ReactSelect
                    label="States"
                    onChange={this.onChange}
                    options={this.state.options}
                    simpleValue
                    searchable={false}
                    clearable={false}
                    value={this.state.value}
                />
            </div>
        )
    }
}
