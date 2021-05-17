/**
 * The LangTable contains the top 50 programming languages
 * for a given quarter, e.g. 2017/Q2
 * Features: Trend, Percentage & Change, History, different data sets
 * PR/Push/Stars ...
 * @author Fabian Beuke <mail@beuke.org>
 * @license AGPL-3.0
 */

import React, { useState, useEffect } from "react"
import { filter, toString, omitBy, isNil, find, first, sum } from "lodash/fp"
import { update, isNaN, assign, take, includes, reject } from "lodash/fp"
import { pick, map, pipe } from "lodash/fp"
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table"
import { NonLangStore } from "../stores/NonLangStore"
import { RenameLangStore } from "../stores/RenameLangStore"
import { observer } from "mobx-react"
import { autorun } from "mobx"

export default observer(function LangTable(props) {
    const [state, setState] = useState({ data: [] })
    const style = {
        margin: "auto",
        maxWidth: 1160,
    }

    /**
     * Filter data set by year and quarter
     * @param {Object} data - GitHub api data set
     * @param {number} year - Example 2017
     * @param {number} quarter - Example 2
     */
    function filterDate(data, year, quarter) {
        return pipe(
            filter({ year: year }),
            filter({ quarter: quarter }),
            map(pick(["name", "count"]))
        )(data)
    }

    /**
     * The GitHub API keeps track of languages such as
     * Jupyter Notebook in which we are not interested,
     * since these are no programming languages
     * Filters non programming languages
     * @param {Object} data - GitHub api data set
     */
    function filterNonProgrammingLanguages(data) {
        const nonLang = new NonLangStore().getConfig()
        return reject((o) => includes(o.name)(nonLang.lang))(data)
    }

    /**
     * The GitHub API changes names (language renamings),
     * therefore we keep track of them and always choose
     * the latest name (replace old names) to keep consistency
     * @param {Object} data - GitHub api data set
     */
    function applyLanguageRenamings(data) {
        const renameLang = new RenameLangStore().getConfig()
        const rename = (name) => {
            const r = find((o) => includes(name, o.before))(renameLang)
            return r ? r.after : name
        }
        return map(update("name")(rename))(data)
    }

    /**
     * Two up arrows: more than 3 ranks up or previoulsy unkown
     * Two down arrorw: more than 3 ranks down
     * One up arrow: 1-3 ranks up
     * One down arrow: 1-3 ranks down
     * Nothing: no change
     * @param {Object} cell - Cell content of the table
     * @param {Object} row - Row content of the table
     */
    function trendFormatter(cell, row) {
        const arrow = (n) => {
            const angle = (dir) => `<i class='fa fa-angle-${dir}'></i>`
            switch (true) {
                case n === 0:
                    return ""
                case n > 3:
                    return angle("double-up")
                case n < -3:
                    return angle("double-down")
                case n < 0:
                    return angle("down")
                case n > 0:
                    return angle("up")
                default:
                    // direct jump to top 50 and previously unkown
                    return angle("double-up")
            }
        }
        return `${arrow(cell)}`
    }

    /**
     * Lemma function filters dataset by name and returns first it finds
     * @param {Object} data - GitHub api data set
     * @param {string} name - Name to search for
     * @returns {Object} Search result
     */
    function findByName(data, name) {
        return pipe(filter({ name: name }), first, omitBy(isNil))(data)
    }

    /**
     * Calculate the trend difference in ranking over a one year period
     * @param {Object} current - GitHub api data set current year
     * @param {Object} last - GitHub api data set last year
     * @returns {Object} Data set ++ trend diff
     */
    function getTrend(current, last) {
        return pipe(
            map((c) =>
                assign({
                    trend: findByName(last, c.name).id - c.id,
                })(c)
            ),
            take(50)
        )(current)
    }

    /**
     * Calculate the percental change in ranking over a one year period
     * @param {Object} current - GitHub api data set current year
     * @param {Object} last - GitHub api data set last year
     * @returns {Object} Data set ++ change as number
     */
    function getChange(current, last) {
        return pipe(
            map((c) =>
                assign({
                    change: c.count - findByName(last, c.name).count,
                })(c)
            ),
            take(50)
        )(current)
    }

    /**
     * Composition of multiple functions, such as non programming
     * language filter, language renaming and indexing to create
     * a table from a raw data set for a given year and quarter
     * @param {Object} data - GitHub api data set
     * @param {number} year - e.g. 2017
     * @param {number} quarter - e.g. 2
     * @returns {Object} filtered and indexed data set (table)
     */
    function createTable(date, year, quarter) {
        const addSortId = map.convert({ cap: 0 })((o, i) =>
            assign({ id: ++i })(o)
        )

        return pipe(
            filterNonProgrammingLanguages,
            applyLanguageRenamings,
            addSortId,
            percentageData
        )(filterDate(date, year, quarter))
    }

    /**
     * Sets ranking table state based on given props (api data)
     * Gets called on componentDidMount and sets react state on prop change
     */
    function mountTable() {
        const data = props.store.getData
        const hist = props.hist.getData
        const { year, quarter } = hist
        const dec = (i) => toString(--i)

        const curYearRanking = createTable(data, year, quarter)
        const lastYearRanking = createTable(data, dec(year), quarter)
        const trendRanking = getTrend(curYearRanking, lastYearRanking)
        const langRanking = getChange(trendRanking, lastYearRanking)

        props.table.set(langRanking)
        setState({ data: langRanking })
    }

    /**
     * Converts the absolute raw counts to percentage values
     * A "count" is e.g. the number of Pull Requests per language
     * @param {Object} data - GitHub api data set
     * @returns {Object} Data set with percentage count
     */
    function percentageData(data) {
        const total = pipe(map("count"), map(Number), sum)(data)
        return pipe(map(update("count")((d) => d / total)))(data)
    }

    /**
     * Native react function, called on component mount and
     * on every prop change event via mobx autorun
     */
    useEffect(() => {
        autorun(() => {
            mountTable()
        })
    }, [])

    /**
     * Formatter that applies color, percentage and change from raw
     * cell data, make it visual grokkable
     * @param {Object} cell - Cell content of the table
     * @param {Object} row - Row content of the table
     * @returns {Object} Formatted cell content
     */
    function percentFormatter(cell, row) {
        const font = (i, color) =>
            `<font size="1">(<font color="${color}">${i}%</font>)</font>`
        const colorize = (i) =>
            i >= 0 ? font("+" + i, "green") : font(i, "chrimson")
        const percent = (i) => (i * 100).toFixed(3)
        const countPercent = (row.count | percent) + "%"
        // NaN can happen in case of new first seen languages,
        // hence we say 0% change
        const normalize = (n) => (isNaN(n) ? 0.0 : n)
        const offset = "\u00A0".repeat(6)
        return (
            offset +
            (row.id > 30
                ? countPercent
                : `${
                      countPercent +
                      "  " +
                      (row.change | normalize | percent | colorize)
                  }`)
        )
    }

    /**
     * Provides empty default table when no data is available or data is
     * still loading
     * @returns {Object} html content for emtpy table
     */
    function noDataAvailableYet() {
        return (
            <div className="emptyTable">
                <h2>No data available for time period yet</h2>
            </div>
        )
    }

    if (state.data.length < 50) return noDataAvailableYet()
    return (
        <div style={style}>
            <BootstrapTable
                condensed
                striped
                tableStyle={{ margin: "30px auto 30px auto", width: "70%" }}
                data={state.data}
                bordered={false}
            >
                <TableHeaderColumn
                    width="50px"
                    dataAlign="center"
                    dataField="id"
                    isKey={true}
                >
                    # Ranking
                </TableHeaderColumn>
                <TableHeaderColumn
                    width="150px"
                    dataAlign="center"
                    dataField="name"
                >
                    Programming Language
                </TableHeaderColumn>
                <TableHeaderColumn
                    width="100px"
                    dataField="count"
                    dataAlign="left"
                    dataFormat={percentFormatter}
                >
                    Percentage (YoY Change)
                </TableHeaderColumn>
                <TableHeaderColumn
                    width="50px"
                    dataAlign="center"
                    dataField="trend"
                    dataFormat={trendFormatter}
                >
                    YoY Trend
                </TableHeaderColumn>
            </BootstrapTable>
        </div>
    )
})
