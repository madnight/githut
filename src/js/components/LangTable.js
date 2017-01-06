import React from 'react'
import axios from 'axios'
import pullRequests from '../../data/gh-pull-request.json'
import { filter, toString, omitBy, isNil, first, assign, take, includes, reject, pick, map, split } from 'lodash/fp'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import { NonLangStore } from '../stores/NonLangStore'

export default class LangTable extends React.Component {

    constructor() {
        super()
        this.options = {
            defaultSortName: 'count',
            defaultSortOrder: 'asc'
        };
        this.state = {
            data: []
        };
    }

    parseJSONData(data, year, quarter) {
        const nonLang = new NonLangStore().getConfig()
        return data
          | split('\n')
          | map(JSON.parse)
          | filter({year: year})
          | filter({quarter: quarter})
          | map(pick(['name', 'count']))
          | reject(o => includes(o.name)(nonLang.lang))
          | map.convert({'cap':0})((o, i) => assign({id: ++i})(o))
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
                default:
                    return 'error'
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

    async componentDidMount() {
        const { data } = await axios.get(pullRequests)
        const { year, quarter } = { year:'2016', quarter:'4' }
        const dec = i => --i | toString
        const curYearRanking = this.parseJSONData(data, year, quarter)
        const lastYearRanking = this.parseJSONData(data, dec(year), quarter)
        const langRanking = this.getTrend(curYearRanking, lastYearRanking)
        this.setState({data: langRanking})
    }

    render() {
        return (
            <BootstrapTable
                condensed
                tableStyle={ { margin: '30px auto 30px auto', width: '50%' } }
                data={this.state.data}
                bordered={false}
                options={this.options}>
                <TableHeaderColumn
                    width='150px'
                    dataAlign='center'
                    dataField='id'
                    isKey={true}
                    dataSort>
                    # Ranking
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataAlign="center"
                    dataField='name'>
                    Programming Language
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataAlign="center"
                    dataField='trend'
                    dataFormat={ this.trendFormatter }>
                    Trend
                </TableHeaderColumn>
            </BootstrapTable>
        )
    }
}
