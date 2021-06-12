/**
 * Layout class that is used to compose all react
 * components into one app div
 * Provides dependency injection via props
 * Contains no logic and no functions except render
 * @author Fabian Beuke <mail@beuke.org>
 * @license AGPL-3.0
 */

import { useReducer, lazy, Suspense } from "react";
import { Route } from "react-router-dom"
import LicensePie from "components/LicensePie"
import Button from "components/Button"
import Head from "components/Head"
import Header from "components/Header"
import Content from "components/Content"
import Comments from "components/Comments"
import Footer from "components/Footer"
import Select from "components/Select"
import EventReducer from "reducers/EventReducer"
import TableReducer  from "reducers/TableReducer"
import HistReducer  from "reducers/HistReducer"

const LangChart = lazy(() => import("components/LangChart"))
const LangTable = lazy(() => import("components/LangTable"))

export default function Layout() {

    const table = useReducer(TableReducer, {});
    const hist = useReducer(HistReducer, { year: "2018", quarter: "1" });
    const event = useReducer(EventReducer, {
        data: import("data/gh-pull-request.json"),
        name: "Pull Requests",
        pullRequests: import("data/gh-pull-request.json"),
        pushEvent: import("data/gh-push-event.json"),
        starEvent: import("data/gh-star-event.json"),
        issueEvent: import("data/gh-issue-event.json"),
    });

    return (
        <div>
            <Head />
            <Header />
            <Route
                path="/:event?/:year?/:quarter?/:lang?"
                render={(route) => (
                    <div>
                        <Suspense fallback={<div></div>}>
                        <LangChart
                            {...route}
                            store={event}
                            hist={hist}
                            table={table}
                        />
                        </Suspense>
                        <Button {...route} store={event} />
                        <div className="rowCenter">
                            <Select {...route} hist={hist} year="true" />
                            <Select {...route} hist={hist} />
                        </div>
                        <Suspense fallback={<div></div>}>
                        <LangTable
                            store={event}
                            hist={hist}
                            table={table}
                        />
                        </Suspense>
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
