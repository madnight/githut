/**
 * Layout class that is used to compose all react
 * components into one app div
 * Provides dependency injection via props
 * Contains no logic and no functions except render
 * @author Fabian Beuke <mail@beuke.org>
 * @license AGPL-3.0
 */

import React from "react"
import { Route } from "react-router-dom"
import LangChart from "./LangChart"
import LangTable from "./LangTable"
import LicensePie from "./LicensePie"
import Button from "./Button"
import Head from "./Head"
import Header from "./Header"
import Content from "./Content"
import Comments from "./Comments"
import Footer from "./Footer"
import Select from "./Select"
import EventStore from "../stores/EventStore"
import HistStore from "../stores/HistStore"
import TableStore from "../stores/TableStore"

export default function Layout(props) {
    return (
        <div>
            <Head />
            <Header />
            <Route
                path="/:event?/:year?/:quarter?/:lang?"
                render={(route) => (
                    <div>
                        <LangChart
                            {...route}
                            store={EventStore}
                            table={TableStore}
                        />
                        <Button {...route} store={EventStore} />
                        <div className="rowCenter">
                            <Select {...route} hist={HistStore} year="true" />
                            <Select {...route} hist={HistStore} />
                        </div>
                        <LangTable
                            store={EventStore}
                            hist={HistStore}
                            table={TableStore}
                        />
                    </div>
                )}
            />
            <LicensePie />
            <Content />
            <Comments />
            <Footer />
        </div>
    )
}
