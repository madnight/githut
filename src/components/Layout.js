/**
 * Layout class that is used to compose all react
 * components into one app div
 * Provides dependency injection via props
 * Contains no logic and no functions except render
 * @author Fabian Beuke <mail@beuke.org>
 * @license AGPL-3.0
 */

import { useReducer } from "react";
import { Route } from "react-router-dom"
import LangChart from "components/LangChart"
import LangTable from "components/LangTable"
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
import pullRequests from "data/gh-pull-request.json"
import pushEvent from "data/gh-push-event.json"
import starEvent from "data/gh-star-event.json"
import issueEvent from "data/gh-issue-event.json"
import DownloadButton from "./DownloadButton";

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
                path="/:event?/:year?/:quarter?/:lang?"
                render={(route) => (
                    <div>
                        <LangChart
                            {...route}
                            store={event}
                            hist={hist}
                            table={table}
                        />
                        <div className="rowCenter">
                            <Button {...route} store={event} />
                        </div>
                        <div className="rowCenter">
                            <DownloadButton />
                        </div>
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
