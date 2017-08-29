import React from 'react'
import { filter, toString, omitBy, isNil, find,
    first, sum, update, isNaN, assign, take,
    includes, reject, pick, map } from 'lodash/fp'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import { NonLangStore } from '../stores/NonLangStore'
import { RenameLangStore } from '../stores/RenameLangStore'
import { observer } from 'mobx-react'
import { autorun } from 'mobx'

@observer
export default class LangTable extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            data: []
        };
    }

    filterDate(data, year, quarter) {
        return data
          | filter({year: year})
          | filter({quarter: quarter})
          | map(pick(['name', 'count']))
    }

    filterNonProgrammingLanguages(data) {
        const nonLang = new NonLangStore().getConfig()
        return data
            | reject(o => includes(o.name)(nonLang.lang))
    }

    applyLanguageRenamings(data) {
        const renameLang = new RenameLangStore().getConfig()
        const rename = (name) => {
            const r = find(o => includes(name, o.before))(renameLang)
            return r ? r.after : name
        }
        return data
            | map(update('name')(rename))
    }

    trendFormatter(cell, row) {
        const arrow = n => {
            const angle = dir => `<i class='fa fa-angle-${dir}'></i>`
            switch (true) {
                case n == 0:
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

    getTrend(current, last) {
        return current
          | map(cur => {
              const l = last
                | filter({ name: cur.name })
                | first
                | omitBy(isNil)
              return assign({ trend: l.id - cur.id })(cur)
            })
          | take(50)
    }

    getChange(current, last) {
        return current
          | map(cur => {
              const l = last
                | filter({ name: cur.name })
                | first
                | omitBy(isNil)
              return assign({ change: cur.count - l.count })(cur)
            })
          | take(50)
    }

    createTable(date, year, quarter) {
        const addSortId = i => i
            | map.convert({'cap':0})((o, i) => assign({id: ++i})(o))
        return this.filterDate(date, year, quarter)
            | this.filterNonProgrammingLanguages
            | this.applyLanguageRenamings
            | addSortId
            | this.percentageData
    }

    mountTable() {
        const data = this.props.store.getData
        const hist = this.props.hist.getData
        if (data.length < 1000) return
        const {year, quarter} = hist
        const dec = i => --i | toString
        const curYearRanking = this.createTable(data, year, quarter)
        const lastYearRanking = this.createTable(data, dec(year), quarter)
        const trendRanking = this.getTrend(curYearRanking, lastYearRanking)
        const langRanking = this.getChange(trendRanking, lastYearRanking)
        this.setState({data: langRanking})
    }

    percentageData(data) {
        const total = data | map('count') | map(Number) | sum
        return data | map(update('count')(d => d/total))
    }

    componentDidMount() {
        autorun(() => this.mountTable())
    }

    static propTypes = {
        store: React.PropTypes.object.isRequired,
        hist: React.PropTypes.object.isRequired
    }

    percentFormatter(cell, row) {
        const font = (i, color) =>
            `<font size="1">(<font color="${color}">${i}%</font>)</font>`
        const colorize = i => i >= 0
            ? font(('+' + i), "green")
            : font(i, "chrimson")
        const percent = i => ((i * 100).toFixed(3))
        const countPercent = (row.count | percent) + "%"
        // NaN can happen in case of new first seen languages,
        // hence we say 0% change
        const normalize = n => isNaN(n) ? 0.000 : n
        if (row.id > 30 ) return countPercent
        return `${ countPercent + "  " +
            (row.change
            | normalize
            | percent
            | colorize) }`
    }

    noDataAvailableYet() {
        return (
            <div className="emptyTable">
                <h2>No data available for this time period yet</h2>
            </div>
        )
    }

    render() {
        if (this.state.data.length < 50) return this.noDataAvailableYet()
        return (
            <BootstrapTable
                condensed
                striped
                tableStyle={ { margin: '30px auto 30px auto', width: '70%' } }
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
                    dataAlign="center"
                    dataField='count'
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
        )
    }
}
