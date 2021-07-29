/**
 * The LangTable contains the top 50 programming languages
 * for a given quarter, e.g. 2017/Q2
 * Features: Trend, Percentage & Change, History, different data sets
 * PR/Push/Stars ...
 * @author Fabian Beuke <mail@beuke.org>
 * @license AGPL-3.0
 */

import { useState, useEffect } from "react";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table"
import NoLanguages from "common/NoLanguages"
import RenameLanguages from "common/RenameLanguages"
import _ from "lodash/fp"

export default function LangTable({store, hist, table}) {
    const [state, setState] = useState({ data: [] })
    const style = {
        margin: "auto",
        maxWidth: 810,
        overflowX: "auto"
    }

    /**
     * Filter data set by year and quarter
     * @param {Object} data - GitHub api data set
     * @param {number} year - Example 2017
     * @param {number} quarter - Example 2
     */
    function filterDate(data, year, quarter) {
        return _.pipe(
            _.filter({ year: year, quarter: quarter }),
            _.map(_.pick(["name", "count"]))
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
        return _.reject((o) => _.includes(o.name)(NoLanguages))(data)
    }

    /**
     * The GitHub API changes names (language renamings),
     * therefore we keep track of them and always choose
     * the latest name (replace old names) to keep consistency
     * @param {Object} data - GitHub api data set
     */
    function applyLanguageRenamings(data) {
        const rename = (name) => {
            const r = _.find((o) => _.includes(name, o.before))(RenameLanguages)
            return r ? r.after : name
        }
        return _.map(_.update("name")(rename))(data)
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
    function trendFormatter(cell, _) {
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
        return _.pipe(_.filter({ name: name }), _.first, _.omitBy(_.isNil))(data)
    }

    /**
     * Calculate the trend difference in ranking over a one year period
     * @param {Object} current - GitHub api data set current year
     * @param {Object} last - GitHub api data set last year
     * @returns {Object} Data set ++ trend diff
     */
    function getTrend(current, last) {
        return _.pipe(
            _.map((c) =>
                _.assign({
                    trend: findByName(last, c.name).id - c.id,
                })(c)
            ),
            _.take(50)
        )(current)
    }

    /**
     * Calculate the percental change in ranking over a one year period
     * @param {Object} current - GitHub api data set current year
     * @param {Object} last - GitHub api data set last year
     * @returns {Object} Data set ++ change as number
     */
    function getChange(current, last) {
        return _.pipe(
            _.map((c) =>
                _.assign({
                    change: c.count - findByName(last, c.name).count,
                })(c)
            ),
            _.take(50)
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
        const addSortId = _.map.convert({ cap: 0 })((o, i) =>
            _.assign({ id: ++i })(o)
        )

        return _.pipe(
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

        const data = store[0].data
        const { year, quarter } = hist[0]
        const dec = (i) => _.toString(--i)

        const curYearRanking = createTable(data, year, quarter)
        const lastYearRanking = createTable(data, dec(year), quarter)
        const trendRanking = getTrend(curYearRanking, lastYearRanking)
        const langRanking = getChange(trendRanking, lastYearRanking)

        if (!_.isEqual(state.data, langRanking)) {
            const [, dispatch] = table
            dispatch({ type: "set", payload: langRanking })
            setState({ data: langRanking })
        }
    }

    /**
     * Converts the absolute raw counts to percentage values
     * A "count" is e.g. the number of Pull Requests per language
     * @param {Object} data - GitHub api data set
     * @returns {Object} Data set with percentage count
     */
    function percentageData(data) {
        const total = _.pipe(_.map("count"), _.map(Number), _.sum)(data)
        return _.pipe(_.map(_.update("count")((d) => d / total)))(data)
    }

    /**
     * Native react function, called on component mount and
     * on every prop change
     */
    useEffect(() => {
        mountTable()
    }, [hist, table])

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
        const countPercent = (percent(row.count)) + "%"
        // NaN can happen in case of new first seen languages,
        // hence we say 0% change
        const normalize = (n) => (_.isNaN(n) ? 0.0 : n)
        const offset = "\u00A0".repeat(6)
        return (
            offset +
            (row.id > 30
                ? countPercent
                : `${
                      countPercent +
                      ("  " + (_.pipe(normalize, percent, colorize)(row.change)))
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
                tableStyle={{ margin: "30px auto 30px auto", width: "100%" }}
                data={state.data}
                bordered={false}
                wrapperClasses="table-responsive"
            >
                <TableHeaderColumn
                    width="100px"
                    dataAlign="center"
                    dataField="id"
                    isKey={true}
                >
                    {"# Ranking"}
                </TableHeaderColumn>
                <TableHeaderColumn
                    width={"230px"}
                    dataAlign="center"
                    dataField="name"
                >
                    {"Programming Language"}
                </TableHeaderColumn>
                <TableHeaderColumn
                    width={"230px"}
                    dataField="count"
                    dataAlign="center"
                    dataFormat={percentFormatter}
                >
                    Percentage (YoY Change)
                </TableHeaderColumn>
                <TableHeaderColumn
                    width="100px"
                    dataAlign="center"
                    dataField="trend"
                    dataFormat={trendFormatter}
                >
                    YoY Trend
                </TableHeaderColumn>
            </BootstrapTable>
        </div>
    )
}
