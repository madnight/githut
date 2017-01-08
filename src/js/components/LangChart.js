import React from 'react'
import { observer } from 'mobx-react'
import { update, range, sortBy, includes, uniqBy, reject, flatten, map,
    take, zipWith, divide, unzip, sum, filter, drop } from 'lodash/fp'
import ReactHighcharts from 'react-highcharts'
import { LangChartStore } from '../stores/LangChartStore'
import { NonLangStore } from '../stores/NonLangStore'

@observer
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
            | sortBy('name')
    }

    static propTypes = {
        store: React.PropTypes.any
    }

    componentWillReact() {
        if (!this.props.store.getData)
            return null
        const d = this.props.store.getData
        const series = d
        | map(update('count')(Math.floor))
        | this.createSeries
        | this.percentageData
        this.setState(
            { series: series,
                xAxis: { categories: this.categories() }
            }
        )
    }

    render() {
        if (!this.props.store.getData)
            return null
        return (<ReactHighcharts config={ this.state }/>)
    }
}
