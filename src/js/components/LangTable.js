import React from 'react'
import axios from 'axios'
import pullRequests from '../../data/github-pr-2016-11.json'
import lastYearPR from '../../data/github-pr-2015.json'
import { filter, assign, update, take, includes, reject, map, split } from 'lodash/fp'
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

    parseJSONData(data) {
        const nonLang = new NonLangStore().getConfig()
        return data
          | split('\n')
          | map(JSON.parse)
          | map(update('name')(JSON.parse))
          | reject(o => includes(o.name)(nonLang.lang))
          | map.convert({'cap':0})((o, i) => assign({id: ++i})(o))
    }

    async getLastYearPR() {
        const { data } = await axios.get(lastYearPR)
        return this.parseJSONData(data)
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
                case n < 1:
                    return angle('down')
                default:
                    return angle('up')
                }
            }
        return `${arrow(cell)}`
    }

    getTrend(current, last) {
        return current
          | map(cur => {
              const last = filter({ name: cur.name })(last)
              return assign({ trend: cur.id - last.id })(cur)
            })
          | take(50)

    }

    async componentDidMount() {
        const { data } = await axios.get(pullRequests)
        const curYearRanking = this.parseJSONData(data)
        const lastYearRanking = await this.getLastYearPR()
        const langRanking = this.getTrend(curYearRanking, lastYearRanking)
        this.setState({data: langRanking});
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
