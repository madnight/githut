import React from 'react'
import axios from 'axios'
import data from '../../data/github-pr-2016-11.json'
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

    componentDidMount() {
        axios.get(data).then(d => {
            const langranking = _.chain(d.data)
              .split('\n')
              .map(JSON.parse)
              .each(o => o.pull_request = JSON.parse(o.pull_request))
              .reject(o => _.includes(this.nonProgrammingLanguage, o.pull_request))
              .take(50)
              .map((o, i) => _.assign(o, {id: ++i}))
              .value()
            this.setState({data: langranking});
        })
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
            </BootstrapTable>
        )
    }

}
