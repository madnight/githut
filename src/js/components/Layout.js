import React from "react"
import LangChart from "./LangChart"
import LangTable from "./LangTable"
import LicensePie from "./LicensePie"
import Button from "./Button"
import Head from "./Head"
import Header from "./Header"
import Content from "./Content"
import Comments from "./Comments"
import Footer from "./Footer"
import SelectYear from "./SelectYear"
import SelectQuarter from "./SelectQuarter"
import EventStore from "../stores/EventStore"
import HistStore from "../stores/HistStore"

/**
 * Layout class that is used to compose all react
 * components into one app div
 * Provides dependency injection via props
 * Contains no logic and no functions except render
 * @author Fabian Beuke <mail@beuke.org>
 * @license AGPL-3.0
 */
export default class Layout extends React.Component {
    render() {
        return (
          <div>
            <Head/>
            <Header/>
            <LangChart store={EventStore}/>
            <Button store={EventStore}/>
            <div className='rowCenter'>
              <SelectYear hist={HistStore}/>
              <SelectQuarter hist={HistStore}/>
            </div>
            <LangTable store={EventStore} hist={HistStore}/>
            <LicensePie/>
            <Content/>
            <Comments/>
            <Footer/>
          </div>
        );
    }
}
