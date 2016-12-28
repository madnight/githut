import React from 'react'
import axios from 'axios'
import _ from 'lodash'
import {
    sortBy,
    reverse,
    uniqBy,
    reject,
    map,
    take,
    groupBy,
    sum,
    filter
} from 'lodash/fp'
// import pullRequests from '../../data/github-pr-all.json'
import pr from '../../data/gh-pull-request.json'
import ReactHighcharts from 'react-highcharts'
import {LangChartStore} from '../stores/LangChartStore'

export default class LangChart extends React.Component {

    constructor() {
        super()
        const store = new LangChartStore
        this.config = store.getConfig()
    }

    getTopLanguages(data) {
        const nonProgrammingLanguage = ['HTML', 'CSS' ,'Gettext Catalog', 'Jupyter Notebook', 'Makefile', 'TeX']
        return _.flow(
            reject(o => _.includes(nonProgrammingLanguage, o.name)),
            map('name'),
            take(10)
        )(data)
    }

    parseJSONData(data) {
        return _.chain(data)
            .split('\n')
            .map(JSON.parse)
            .each(o => o.count = Math.floor(o.count))
            .value()
    }

    categories() {
        return _.flatten(_.map(_.range(12, 99), year =>
            _.map(_.range(1, 5), quarter => year + "/Q" + quarter)))
    }

    sumQuarters(data) {
        return _.each(data, v => v.data = _.map(_.chunk(v.data, 3), _.sum))
    }

    percentageData(data) {
        const sum = _.map(_.unzip(_.map(data, i => i.data)), _.sum)
        return _.each(data, v => v.data = _.zipWith(v.data, sum, _.divide))
    }

    createSeries(data) {
        const topLang = this.getTopLanguages(data)
        return _.flow(
            filter(o => _.includes(topLang, o.name)),
            map(d => ({
                name: d.name,
                data: _.map(_.filter(data, {'name': d.name}), d => d.count)
            })),
            uniqBy('name'),
        ).bind(this)(data)
    }

    async componentDidMount() {
        const {data} = await axios.get(pr)
        const pullRequests = this.parseJSONData(data)
        const series = _.flow(
            this.createSeries,
            // this.sumQuarters,
            this.percentageData).bind(this)
        console.log(this.createSeries(pullRequests))
        let chart = this.refs.chart.getChart()
        _.map(series(pullRequests), s => chart.addSeries(s, false))
        _.first(chart.xAxis).setCategories(this.categories())
        chart.redraw()
    }

    render() {
        return (<ReactHighcharts config={this.config} ref="chart"/>);
    }
}
