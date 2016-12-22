import React from 'react'
import axios from 'axios'
import pullRequests from '../../data/github-pr-2016-11.json'
import lastYearPR from '../../data/github-pr-2015.json'
import _ from 'lodash'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'

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
        this.nonProgrammingLanguage = ['HTML', 'CSS' ,'Gettext Catalog',
            'Jupyter Notebook', 'Makefile', 'TeX', 'ApacheConf', 'CMAKE',
            'Groff', 'XSLT', 'CMake', 'Nginx', 'QMake', 'Yacc', 'Lex',
            'Protocol Buffer', 'Batchfile', 'Smarty', 'Scilab', 'PLpgSQL',
            'Perl6', 'Handlebars', 'NSIS', 'M4', 'PLSQL', 'Arduino', 'CMake',
            'ApacheConf', 'XML', 'SaltStack', 'Vue', 'GCC Machine Description']
    }

    parseJSONData(data) {
        return _.chain(data)
          .split('\n')
          .map(JSON.parse)
          .each(o => o.pull_request = JSON.parse(o.pull_request))
          .reject(o => _.includes(this.nonProgrammingLanguage, o.pull_request))
          .map((o, i) => _.assign(o, {id: ++i}))
          .value()
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
                case n > 2:
                    return angle('double-up')
                case n < -2:
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
        return _.chain(current)
          .each(l => _.each(last, y => {
                if (y.pull_request == l.pull_request)
                    _.assign(l, { trend: y.id - l.id })
                }))
          .take(50)
          .value()
    }

    async componentDidMount() {
        this.getLastYearPR()
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
                    dataField='pull_request'>
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
