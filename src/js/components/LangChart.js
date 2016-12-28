import React from 'react'
import axios from 'axios'
import { flow, first, range, includes, uniqBy, reject, flatten, map,
    split, take, zipWith, divide, unzip, each, sum, filter } from 'lodash/fp'
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
        return flow(
            reject(o => includes(nonProgrammingLanguage, o.name)),
            map('name'),
            take(10)
        )(data)
    }

    parseJSONData(data) {
        return flow(
            split('\n'),
            map(JSON.parse),
            each(o => o.count = Math.floor(o.count))
        )(data)
    }

    categories() {
        return flatten(
            map(year =>
            map(quarter => year + "/Q" + quarter)(range(1, 5))
        )(range(12, 99)))
    }

    percentageData(data) {
        const s = map(sum)(unzip(map('data')(data)))
        return each(v => v.data = zipWith(divide)(v.data)(s))(data)
    }

    createSeries(data) {
        const topLang = this.getTopLanguages(data)
        return flow(
            filter(o => includes(o.name)(topLang)),
            map(d => ({
                name: d.name,
                data: map(d => d.count)(filter({'name': d.name})(data))
            })),
            uniqBy('name'),
        ).bind(this)(data)
    }

    async componentDidMount() {
        const {data} = await axios.get(pr)
        const pullRequests = this.parseJSONData(data)
        const series = flow(
            this.createSeries,
            this.percentageData
        ).bind(this)
        let chart = this.refs.chart.getChart()
        map(s => chart.addSeries(s, false))(series(pullRequests))
        first(chart.xAxis).setCategories(this.categories())
        chart.redraw()
    }

    render() {
        return (<ReactHighcharts config={this.config} ref="chart"/>);
    }
}
