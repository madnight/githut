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

import React, { useState, useEffect, useRef } from "react"
import { observer } from "mobx-react"
import { autorun } from "mobx"
import { update, range, sortBy, includes, uniqBy, reject } from "lodash/fp"
import { size, max, flatten, map, take, zipWith, divide } from "lodash/fp"
import { unzip, sum, filter, drop, isEqual } from "lodash/fp"
import { LangChartStore } from "../stores/LangChartStore"
import ReactHighcharts from "react-highcharts"
import GitHubColors from "github-colors"

export default observer(function LangChart(props) {
    const store = new LangChartStore()
    const inputRef = useRef("chart")
    const [state, setState] = useState(store.getConfig())
    let dataLength = 0
    let top50 = []
    const style = {
        width: "100%",
        margin: "auto",
        maxWidth: 1360,
    }
    let visible;

    /**
     * Creates Highcharts xAxis categories since 2012
     * quarter wise: 2012/Q1, 2012/Q2, ...
     * @returns {Object} xAxis categories (year/quarter)
     */
    function categories() {
        return (
            range(2012, 2050) |
            map((y) => range(1, 5) | map((q) => (q === 1 ? y : ""))) |
            flatten |
            drop(1)
        )
    }

    /**
     * Calculates relative / percentage of series data
     * Example: Pull Request -> JavaScript 22.2%, C# 4%, ..
     * @param {Object} current - GitHub api data set
     * @returns {Object} Data series with percentage data
     */
    function percentageData(data) {
        const total = data | map("data") | unzip | map(sum)
        return data | map(((x) => total | zipWith(divide)(x)) | update("data"))
    }

    /**
     * Adds zeros if we dont have enough historical data. For example,
     * there is no data for Typescript in 2012/Q2. We fill missing data
     * with zeros.
     * @param {Object} current - GitHub api data set
     * @returns {Object} Data series filled with zeros if required
     */
    function fillZeros(data) {
        const HistSize = data | map("data") | map(size) | max
        const fill = (d) => new Array(HistSize - size(d)).fill(0).concat(d)
        return data | map(update("data", fill))
    }

    /**
     * Creates a data series for highcharts based on GitHub raw api data
     * Filters top 10 languages
     * @param {Object} current - GitHub api data set
     * @returns {Object} Data series for top 10 languages
     */
    function createSeries(data) {
        return (
            data |
            uniqBy("name") |
            reject((o) => !includes(o.name)(top50)) |
            map.convert({ cap: 0 })((d, i) => ({
                name: d.name,
                color: GitHubColors.get(d.name)
                    ? GitHubColors.get(d.name).color // or random color
                    : "#" + Math.floor(Math.random() * 16777215).toString(16),
                visible: visible ? visible.includes(d.name) : i < 7,
                data: map("count")(filter({ name: d.name })(data)),
            })) |
            fillZeros
        )
    }

    /*
     * Updates react state if the new state is different than the old state
     */
    function updateState(newState) {
        if (!isEqual(state, newState)) {
            setState(newState)
        }
    }

    /*
     * Creates a new percentage series of data
     */
    function createSeriesPercentage(data) {
        return (
            data |
            map(update("count")(Math.floor)) |
            createSeries |
            percentageData
        )
    }

    /**
     * Creates a new chart if necessary
     */
    function constructChart(data, title, top) {
        if (
            (data.length === dataLength || isEqual(top50, top)) &&
            size(top) === 0
        ) {
            return
        }

        top50 = top
        dataLength = data.length
        const newState = {
            ...state,
            yAxis: {
                ...state.yAxis,
                title: { text: title },
            },
            series: createSeriesPercentage(data),
            xAxis: { tickLength: 0, categories: categories() },
        }
        updateState(newState)
    }

    /**
     * Native react function, called on component mount and
     * on every prop change event via mobx autorun
     * The autorun handler creates the chart with a composition
     * of class member functions and change reacts state if something
     * has changed
     */
    useEffect(() => {
        autorun(() => {
            const { lang } = props.match.params
            visible = lang ? lang.split(",") : undefined
            const data = props.store.getData
            const title = props.store.getEventName
            const top =
                props.table.data | take(50) | sortBy("name") | map("name")
            constructChart(data, title, top)
        })
    }, [])

    if (state && state.series && state.series.length === 0) return null
    return (
        <div style={style}>
            <ReactHighcharts config={state} ref={inputRef} />
        </div>
    )
})
