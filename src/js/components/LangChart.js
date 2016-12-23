import React from 'react'
import axios from 'axios'
import _ from 'lodash'
import { sortBy, reverse, reject, map, take } from 'lodash/fp'
import pullRequests from '../../data/github-pr-all.json'
import ReactHighcharts from 'react-highcharts'
import { LangChartStore } from '../stores/LangChartStore'

export default class LangChart extends React.Component {

    constructor() {
        super()
        const store = new LangChartStore
        this.config = store.getConfig()
        this.topProgrammingLanguages = []
    }

    getTopLanguages(data) {
        const nonProgrammingLanguage = ['HTML', 'CSS' ,'Gettext Catalog', 'Jupyter Notebook', 'Makefile', 'TeX']
        const sumPullRequests = d => {
            return _.reduce(d, (res, val) => {
                res[val.lang] = { count: 0, name: val.lang }
                res[val] && res[val].push(res[val.lang]);
                res[val.lang].count += val.count
                return res
            }, {})
        }
        this.topProgrammingLanguages = _.flow(
            sumPullRequests,
            sortBy('count'),
            reverse,
            reject(o => _.includes(nonProgrammingLanguage, o.name)),
            map('name'),
            take(10)
        )(data)
    }

    isTopLanguage(name) {
        return _.includes(this.topProgrammingLanguages, name)
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

    createSeries(data) {
        return _.chain(data)
          .filter(d => this.isTopLanguage(d.lang))
          .map(d => ({ name: d.lang,
            data: _.map(_.filter(data, { 'lang': d.lang }), d => d.count) }))
          .uniqBy('name')
          .value()
    }

    async componentDidMount() {
        const { data } = await axios.get(pullRequests)
        const series = _.flow(
            this.createSeries,
            this.sumQuarters,
            this.percentageData
        ).bind(this)
        this.getTopLanguages(data)
        let chart = this.refs.chart.getChart()
        _.map(series(data), s => chart.addSeries(s, false))
        _.first(chart.xAxis).setCategories(this.categories())
        chart.redraw()
    }

    render() {
        return (<ReactHighcharts config={ this.config } ref="chart"/>);
    }
}
