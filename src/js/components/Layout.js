/**
 * Layout class that is used to compose all react
 * components into one app div
 * Provides dependency injection via props
 * Contains no logic and no functions except render
 * @author Fabian Beuke <mail@beuke.org>
 * @license AGPL-3.0
 */

import React from 'react'
import { Route } from 'react-router-dom'
import LangChart from './LangChart'
import LangTable from './LangTable'
import LicensePie from './LicensePie'
import Button from './Button'
import Head from './Head'
import Header from './Header'
import Content from './Content'
import Comments from './Comments'
import Footer from './Footer'
import SelectYear from './SelectYear'
import SelectQuarter from './SelectQuarter'
import EventStore from '../stores/EventStore'
import HistStore from '../stores/HistStore'
import TableStore from '../stores/TableStore'

export default class Layout extends React.Component {
    render () {
        return (
            <div>
                <Head/>
                <Header/>
                <LangChart store={EventStore} table={TableStore}/>
                <Route path="/:event?/:year?/:quarter?"
                    render={ route =>
                        (<Button {...route} store={EventStore}/>) } />
                <div className='rowCenter'>
                    <Route path="/:event?/:year?/:quarter?"
                        render={ route =>
                            (<SelectYear {...route} hist={HistStore}/>) } />
                    <Route path="/:event?/:year?/:quarter?"
                        render={ route =>
                            (<SelectQuarter {...route} hist={HistStore}/>) } />
                </div>
                <LangTable store={EventStore} hist={HistStore} table={TableStore}/>
                <LicensePie/>
                <Content/>
                <Comments/>
                <Footer/>
            </div>
        )
    }
}
