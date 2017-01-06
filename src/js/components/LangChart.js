import React from 'react'
import axios from 'axios'
import { update, range, includes, uniqBy, reject, flatten, map,
    split, take, zipWith, divide, unzip, sum, filter, drop } from 'lodash/fp'
import pr from '../../data/gh-pull-request.json'
import ReactHighcharts from 'react-highcharts'
import { LangChartStore } from '../stores/LangChartStore'
import { NonLangStore } from '../stores/NonLangStore'

export default class LangChart extends React.Component {

    constructor() {
        super()
        const store = new LangChartStore
        this.state = store.getConfig()
    }

    getTopLanguages(data) {
        const nonLang = new NonLangStore().getConfig()
        return data
            | map('name')
            | reject(o => includes(o)(nonLang.lang))
            | take(10)
    }

    parseJSONData(data) {
        return data
            | split('\n')
            | map(JSON.parse)
            | map(update('count')(Math.floor))
    }

    categories() {
        return range(12, 30)
            | map(y => range(1, 5)
                | map(q => y + "/Q" + q)
              )
            | flatten
            | drop(1)
    }

    percentageData(data) {
        const total = map(sum)(unzip(map('data')(data)))
        return map(update('data')(d => zipWith(divide)(d)(total)))(data)
    }

    createSeries(data) {
        const topLang = this.getTopLanguages(data)
        return data
            | filter(o => includes(o.name)(topLang))
            | map(d => ({
                name: d.name,
                data: map('count')(filter({'name': d.name})(data))
              }))
            | uniqBy('name')
    }

    async componentDidMount() {
        const { data } = await axios.get(pr)
        const series = this.parseJSONData(data)
            | this.createSeries
            | this.percentageData
        this.setState(
          { series: series,
            xAxis: { categories: this.categories() }
          }
        )
    }

    render() {
        return (<ReactHighcharts config={ this.state }/>)
    }
}
