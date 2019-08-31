/**
 * The LangTable contains the top 50 programming languages
 * for a given quarter, e.g. 2017/Q2
 * Features: Trend, Percentage & Change, History, different data sets
 * PR/Push/Stars ...
 * @author Fabian Beuke <mail@beuke.org>
 * @license AGPL-3.0
 */

import React from 'react'
import { filter, toString, omitBy, isNil, find,
    first, sum, update, isNaN, assign, take,
    includes, reject, pick, map } from 'lodash/fp'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import { NonLangStore } from '../stores/NonLangStore'
import { RenameLangStore } from '../stores/RenameLangStore'
import { observer } from 'mobx-react'
import { autorun } from 'mobx'
import Lang from './Lang'

@observer
export default class LangTable extends Lang {
    /**
     * Sets inital state and react inline style
     * @constructor
     * @param {Object} props - Contains GitHub data sets
     */
    constructor (props) {
        super(props)
        this.state = {
            data: []
        }
        this.style = {
            margin: 'auto',
            maxWidth: 1160
        }
    }

    /**
     * Filter data set by year and quarter
     * @param {Object} data - GitHub api data set
     * @param {number} year - Example 2017
     * @param {number} quarter - Example 2
     */
    filterDate (data, year, quarter) {
        return data
            | filter({year: year})
            | filter({quarter: quarter})
            | map(pick(['name', 'count']))
    }

    /**
     * The GitHub API keeps track of languages such as
     * Jupyter Notebook in which we are not interested,
     * since these are no programming languages
     * Filters non programming languages
     * @param {Object} data - GitHub api data set
     */
    filterNonProgrammingLanguages (data) {
        const nonLang = new NonLangStore().getConfig()
        return data
            | reject(o => includes(o.name)(nonLang.lang))
    }

    /**
     * The GitHub API changes names (language renamings),
     * therefore we keep track of them and always choose
     * the latest name (replace old names) to keep consistency
     * @param {Object} data - GitHub api data set
     */
    applyLanguageRenamings (data) {
        const renameLang = new RenameLangStore().getConfig()
        const rename = (name) => {
            const r = find(o => includes(name, o.before))(renameLang)
            return r ? r.after : name
        }
        return data
            | map(update('name')(rename))
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
    trendFormatter (cell, row) {
        const arrow = n => {
            const angle = dir => `<i class='fa fa-angle-${dir}'></i>`
            switch (true) {
            case n === 0:
                return ''
            case n > 3:
                return angle('double-up')
            case n < -3:
                return angle('double-down')
            case n < 0:
                return angle('down')
            case n > 0:
                return angle('up')
            default: // direct jump to top 50 and previously unkown
                return angle('double-up')
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
    findByName (data, name) {
        return data
            | filter({ name: name })
            | first
            | omitBy(isNil)
    }

    /**
     * Calculate the trend difference in ranking over a one year period
     * @param {Object} current - GitHub api data set current year
     * @param {Object} last - GitHub api data set last year
     * @returns {Object} Data set ++ trend diff
     */
    getTrend (current, last) {
        return current
            | map(c => assign({
                trend: this.findByName(last, c.name).id - c.id
            })(c))
            | take(50)
    }

    /**
     * Calculate the percental change in ranking over a one year period
     * @param {Object} current - GitHub api data set current year
     * @param {Object} last - GitHub api data set last year
     * @returns {Object} Data set ++ change as number
     */
    getChange (current, last) {
        return current
            | map(c => assign({
                change: c.count - this.findByName(last, c.name).count
            })(c))
            | take(50)
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
    createTable (date, year, quarter) {
        const addSortId = i => i
            | map.convert({'cap': 0})((o, i) => assign({id: ++i})(o))
        return this.filterDate(date, year, quarter)
            | this.filterNonProgrammingLanguages
            | this.applyLanguageRenamings
            | addSortId
            | this.percentageData
    }

    /**
     * Sets ranking table state based on given props (api data)
     * Gets called on componentDidMount and sets react state on prop change
     */
    mountTable () {
        const data = this.props.store.getData
        const hist = this.props.hist.getData
        if (data.length < 1000) return
        const {year, quarter} = hist
        const dec = i => --i | toString

        const curYearRanking = this.createTable(data, year, quarter)
        const lastYearRanking = this.createTable(data, dec(year), quarter)
        const trendRanking = this.getTrend(curYearRanking, lastYearRanking)
        const langRanking = this.getChange(trendRanking, lastYearRanking)

        this.props.table.set(langRanking)
        this.setState({data: langRanking})
    }

    /**
     * Converts the absolute raw counts to percentage values
     * A "count" is e.g. the number of Pull Requests per language
     * @param {Object} data - GitHub api data set
     * @returns {Object} Data set with percentage count
     */
    percentageData (data) {
        const total = data | map('count') | map(Number) | sum
        return data | map(update('count')(d => d / total))
    }

    /**
     * Native react function, called on component mount and
     * on every prop change event via mobx autorun
     */
    componentWillMount () {
        autorun(() => this.mountTable())
    }

    /**
     * Formatter that applies color, percentage and change from raw
     * cell data, make it visual grokkable
     * @param {Object} cell - Cell content of the table
     * @param {Object} row - Row content of the table
     * @returns {Object} Formatted cell content
     */
    percentFormatter (cell, row) {
        const font = (i, color) =>
            `<font size="1">(<font color="${color}">${i}%</font>)</font>`
        const colorize = i => i >= 0
            ? font(('+' + i), 'green')
            : font(i, 'chrimson')
        const percent = i => ((i * 100).toFixed(3))
        const countPercent = (row.count | percent) + '%'
        // NaN can happen in case of new first seen languages,
        // hence we say 0% change
        const normalize = n => isNaN(n) ? 0.000 : n
        const offset = '\u00A0'.repeat(6)
        return offset + (row.id > 30 ? countPercent :
            (`${countPercent + '  ' +
            (row.change
                | normalize
                | percent
                | colorize)}`))
    }

    /**
     * Provides empty default table when no data is available or data is
     * still loading
     * @returns {Object} html content for emtpy table
     */
    noDataAvailableYet () {
        return (
            <div className="emptyTable">
                <h2>No data available for this time period yet</h2>
            </div>
        )
    }

    render () {
        if (this.state.data.length < 50) return this.noDataAvailableYet()
        return (
            <div style={this.style}>
                <BootstrapTable
                    condensed
                    striped
                    tableStyle={{margin: '30px auto 30px auto', width: '70%'}}
                    data={this.state.data}
                    bordered={false}
                    options={this.options}>
                    <TableHeaderColumn
                        width='50px'
                        dataAlign='center'
                        dataField='id'
                        isKey={true}>
                        # Ranking
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        width='150px'
                        dataAlign="center"
                        dataField='name'>
                        Programming Language
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        width='100px'
                        dataField='count'
                        dataAlign="left"
                        dataFormat={ this.percentFormatter }>
                        Percentage (Change)
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        width='50px'
                        dataAlign="center"
                        dataField='trend'
                        dataFormat={ this.trendFormatter }>
                        Trend
                    </TableHeaderColumn>
                </BootstrapTable>
            </div>
        )
    }
}
