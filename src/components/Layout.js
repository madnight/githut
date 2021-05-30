/**
 * Layout class that is used to compose all react
 * components into one app div
 * Provides dependency injection via props
 * Contains no logic and no functions except render
 * @author Fabian Beuke <mail@beuke.org>
 * @license AGPL-3.0
 */

import React, { useReducer } from "react"
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
import EventReducer from "../reducers/EventReducer"
import TableReducer  from "../reducers/TableReducer"
import HistReducer  from "../reducers/HistReducer"
import pullRequests from "../data/gh-pull-request.json"
import pushEvent from "../data/gh-push-event.json"
import starEvent from "../data/gh-star-event.json"
import issueEvent from "../data/gh-issue-event.json"

export default function Layout() {

    const table = useReducer(TableReducer, {});
    const hist = useReducer(HistReducer, { year: "2018", quarter: "1" });
    const event = useReducer(EventReducer, {
        data: pullRequests,
        name: "Pull Requests",
        pullRequests,
        pushEvent,
        starEvent,
        issueEvent,
    });

    return (
        <div>
            <Head />
            <Header />
            <Route
            path="/githut/:event?/:year?/:quarter?/:lang?"
                render={(route) => (
                    <div>
                        <LangChart
                            {...route}
                            store={event}
                            hist={hist}
                            table={table}
                        />
                        <Button {...route} store={event} />
                        <div className="rowCenter">
                            <Select {...route} hist={hist} year="true" />
                            <Select {...route} hist={hist} />
                        </div>
                        <LangTable
                            store={event}
                            hist={hist}
                            table={table}
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
