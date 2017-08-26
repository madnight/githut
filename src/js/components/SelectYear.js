import React from 'react'
import { observer } from 'mobx-react'
import Select from 'react-select';
import 'react-select/dist/react-select.css';

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
      value: '2017'
    }
    this.onChange = this.onChange.bind(this)
  }

    static propTypes = {
        hist: React.PropTypes.any.isRequired
    }

    onChange(value) {
        this.props.hist.data.year = value
        this.setState({ value });
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
