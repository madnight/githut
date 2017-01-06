import React from 'react'
import axios from 'axios'
import licenses from '../../data/github-licenses.json'
import ReactHighcharts from 'react-highcharts'
import { mapKeys, update, take, map, split } from 'lodash/fp'

export default class LicensePie extends React.Component {

    constructor() {
        super()
        this.state = {
            credits: { enabled: false },
            chart: { type: 'pie', backgroundColor: 'transparent' },
            title: { text: 'Top 5 Open Source Licenses' },
            tooltip: {
                formatter: function() {
                    return '<span style="color:' + this.series.color + '">'
                        + this.point.name + '</span>: <b>'
                        + (this.percentage).toFixed(2) + '%</b>'
                }
            }
        }
    }

    async componentDidMount() {
        const { data } = await axios.get(licenses)
        const series = data
          | split('\n')
          | map(JSON.parse)
          | map(mapKeys(k => k == 'license' ? 'name' : 'y'))
          | map(update('y')(Math.floor))
          | take(5)
        this.setState({series: [{data: series}]})
    }

    render() {
        return (<ReactHighcharts config={ this.state }/>);
    }
}
