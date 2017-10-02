import React from 'react'
import { observer } from 'mobx-react'
import { autorun } from 'mobx'
import { update, range, sortBy, includes, uniqBy, reject,
    flatten, map, take, zipWith, divide, unzip, sum, filter,
    drop, first, keys, isEqual } from 'lodash/fp'
import { LangChartStore } from '../stores/LangChartStore'
import { NonLangStore } from '../stores/NonLangStore'
import ReactHighcharts from 'react-highcharts'

/**
 * Programming language popularity chart based on Highcharts
 * Please note that this file is dual licensed since Highcharts
 * is licensed under CC BY-NC 3.0
 * If Highcharts gets replaced in the future this class
 * will be licensed under AGPL-3.0 only
 * @author Fabian Beuke <mail@beuke.org>
 * @license AGPL-3.0 everything except Highcharts
 * @license CC BY-NC 3.0 Highcharts
 * @see {@link https://creativecommons.org/licenses/by-nc/3.0/}
 */
@observer
export default class LangChart extends React.Component {

    /**
     * Contains react state and react inline style
     * @constructor
     * @param {Object} props - Contains GitHub data sets
     */
    constructor(props) {
        super(props)
        const store = new LangChartStore
        this.state = store.getConfig()
        this.style = {
            width: '100%',
            margin: 'auto',
            maxWidth: 1360
        }
    }

    static propTypes = {
        store: React.PropTypes.object.isRequired
    }

    /**
     * Creates Highcharts xAxis categories since 2012
     * quarter wise: 2012/Q1, 2012/Q2, ...
     * @returns {Object} xAxis categories (year/quarter)
     */
    categories() {
        return range(12, 30)
            | map(y => range(1, 5)
                | map(q => y + "/Q" + q)
              )
            | flatten
            | drop(1)
    }

    /**
     * Calculates relative / percentage of series data
     * Example: Pull Request -> JavaScript 22.2%, C# 4%, ..
     * @param {Object} current - GitHub api data set
     * @returns {Object} Data series with percentage data
     */
    percentageData(data) {
        const total = map(sum)(unzip(map('data')(data)))
        return map(update('data')(d => zipWith(divide)(d)(total)))(data)
    }

    /**
     * Creates a data series for highcharts based on GitHub raw api data
     * Removes languages that are not programming lanuages
     * Filters top 10 languages
     * @param {Object} current - GitHub api data set
     * @returns {Object} Data series for top 10 languages
     */
    createSeries(data) {
        const nonLang = new NonLangStore().getConfig()
        return data
            | reject(o => includes(o.name)(nonLang.lang))
            | take(10)
            | map(d => ({
                name: d.name,
                data: map('count')(filter({'name': d.name})(data))
            }))
            | uniqBy('name')
            | sortBy('name')
    }

    /**
     * Native react function, called on component mount and
     * on every prop change event via mobx autorun
     * The autorun handler creates the chart with a composition
     * of class member functions and change reacts state if something
     * has changed
     */
    componentWillMount() {
        this.handler = autorun(() => {
            const data = this.props.store.getData
            const title = this.props.store.event | first | keys | first
            if (data.length > 1000) {
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
        return (
            <div style={this.style}>
                <ReactHighcharts config={ this.state }/>
            </div>
        )
    }
}
