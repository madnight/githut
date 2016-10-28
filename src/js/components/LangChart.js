import React from 'react'
import axios from 'axios'
import ReactHighcharts from 'react-highcharts'
import { map, first } from 'lodash'
import { LangChartStore } from '../stores/LangChartStore'

export default class LangChart extends React.Component {

    constructor() {
        super();
        const store = new LangChartStore;
        this.config = store.getConfig();
    }

    isTopLanguage(name) {
        return _.includes(['C++', 'C', 'Objective-C', 'Ruby', 'Java',
            'JavaScript', 'Go', 'PHP', 'Python', 'Shell' ], name)
    }

    categories() {
        return _.flatten(_.map(_.range(12,99), year =>
            _.map(_.range(1,5), quarter => year + "/Q" + quarter)))
    }

    sumQuarters(data) {
        return _.each(data, v =>
            v.data = _.map(_.chunk(v.data, 3), _.sum))
    }

    percentageData(data) {
        const sum = _.map(_.unzip(_.map(data, i => i.data)), _.sum)
        return _.each(data, v => v.data = _.zipWith(v.data, sum, _.divide))
    }

    createSeries({data}) {
        return _.chain(data)
        .filter(d => this.isTopLanguage(d.lang))
        .map(d => ({ name: d.lang,
            data: _.map(_.filter(data, { 'lang': d.lang }), d => d.count) }))
        .uniqBy('name')
        .value()
    }

    componentDidMount() {
        let chart = this.refs.chart.getChart()
        const series = _.flow(this.createSeries,
            this.sumQuarters, this.percentageData).bind(this)
        axios.get('https://beuke.org/github-stats/data.json').then((d => {
            _.map(series(d), s => chart.addSeries(s, false))
            _.first(chart.xAxis).setCategories(this.categories())
            chart.redraw()
        }).bind(this))
    }

    render() {
        return (<ReactHighcharts config = { this.config } ref="chart"> </ReactHighcharts>);
    }
}
