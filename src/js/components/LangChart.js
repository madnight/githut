import React from 'react'
import { observer } from 'mobx-react'
import { autorun } from 'mobx'
import { update, range, sortBy, includes, uniqBy, reject, flatten, map,
    take, zipWith, divide, unzip, sum, filter, drop, first, keys, isEqual } from 'lodash/fp'
import ReactHighcharts from 'react-highcharts'
import { LangChartStore } from '../stores/LangChartStore'
import { NonLangStore } from '../stores/NonLangStore'

@observer
export default class LangChart extends React.Component {

    constructor(props) {
        super(props)
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
        store: React.PropTypes.object.isRequired
    }

    componentWillMount() {
        this.handler = autorun(() => {
            const data = this.props.store.getData
            const title = this.props.store.event | first | keys | first
            if (data.length > 1000 &&
                this.state.yAxis.title.text != title) {
                const series = data
                    | map(update('count')(Math.floor))
                    | this.createSeries
                    | this.percentageData

                const newState = {
                    ...this.state,
                    yAxis: {
                        ...this.state.yAxis, title: { text: title }
                    },
                    series: series,
                    xAxis: { categories: this.categories() }
                }

                if (!isEqual(this.state, newState))
                    this.setState(newState)
            }
        });
    }


    render() {
        return (<ReactHighcharts config={ this.state }/>)
    }
}
