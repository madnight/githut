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

import React from 'react'
import { observer } from 'mobx-react'
import { autorun } from 'mobx'
import { update, range, sortBy, includes, uniqBy, reject, size, max,
    flatten, map, take, zipWith, divide, unzip, sum, filter,
    drop, isEqual } from 'lodash/fp'
import { LangChartStore } from '../stores/LangChartStore'
import ReactHighcharts from 'react-highcharts'
import Lang from './Lang'
import GitHubColors from 'github-colors'

@observer
export default class LangChart extends Lang {
    /**
     * Contains react state and react inline style
     * @constructor
     * @param {Object} props - Contains GitHub data sets
     */
    constructor (props) {
        super(props)
        const store = new LangChartStore()
        this.state = store.getConfig()
        this.dataLength = 0
        this.top50 = []
        this.style = {
            width: '100%',
            margin: 'auto',
            maxWidth: 1360
        }
    }

    /**
     * Creates Highcharts xAxis categories since 2012
     * quarter wise: 2012/Q1, 2012/Q2, ...
     * @returns {Object} xAxis categories (year/quarter)
     */
    categories () {
        return range(2012, 2050)
            | map(y => range(1, 5)
                | map(q => q === 1 ? y : '')
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
    percentageData (data) {
        const total = data | map('data') | unzip | map(sum)
        return data | map((x => total | zipWith(divide)(x)) | update('data'))
    }

    /**
     * Adds zeros if we dont have enough historical data. For example,
     * there is no data for Typescript in 2012/Q2. We fill missing data
     * with zeros.
     * @param {Object} current - GitHub api data set
     * @returns {Object} Data series filled with zeros if required
     */
    fillZeros (data) {
        const HistSize = data | map('data') | map(size) | max
        const fill = d => (new Array(HistSize - size(d)).fill(0)).concat(d)
        return data | map(update('data', fill))
    }

    /**
     * Creates a data series for highcharts based on GitHub raw api data
     * Filters top 10 languages
     * @param {Object} current - GitHub api data set
     * @returns {Object} Data series for top 10 languages
     */
    createSeries (data) {
        return data
            | uniqBy('name')
            | reject(o => !includes(o.name)(this.top50))
            | map.convert({'cap': 0})((d, i) => ({
                name: d.name,
                color: GitHubColors.get(d.name) ?
                    GitHubColors.get(d.name).color : // or random color
                    '#' + Math.floor(Math.random() * 16777215).toString(16),
                visible: i < 7,
                data: map('count')(filter({'name': d.name})(data))
            }))
            | this.fillZeros
    }

    /*
     * Updates react state if the new state is different than the old state
     */
    updateState (newState) {
        if (!isEqual(this.state, newState)) { this.setState(newState) }
    }

    /*
     * Creates a new percentage series of data
     */
    createSeriesPercentage (data) {
        return data
            | map(update('count')(Math.floor))
            | this.createSeries
            | this.percentageData
    }

    /**
     * Creates a new chart if necessary
     */
    constructChart (data, title, top) {
        if ((data.length !== this.dataLength
            || !isEqual(this.top50, top))
            && size(top) > 0) {
            this.top50 = top
            this.dataLength = data.length

            const newState = {
                ...this.state,
                yAxis: {
                    ...this.state.yAxis, title: { text: title }
                },
                series: this.createSeriesPercentage(data),
                xAxis: { tickLength: 0, categories: this.categories() }
            }
            this.updateState(newState)
        }
    }

    /**
     * Native react function, called on component mount and
     * on every prop change event via mobx autorun
     * The autorun handler creates the chart with a composition
     * of class member functions and change reacts state if something
     * has changed
     */
    componentWillMount () {
        this.handler = autorun(() => {
            const data = this.props.store.getData
            const title = this.props.store.getEventName
            const top = this.props.table.data | take(50) | sortBy('name') | map('name')
            this.constructChart(data, title, top)
        })
    }

    render () {
        return (
            <div style={this.style}>
                <ReactHighcharts config={ this.state } ref="chart"/>
            </div>
        )
    }
}
