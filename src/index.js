/**
 * Entrypoint for the react app
 * Provides a basic app wrapper for react
 * @author Fabian Beuke <mail@beuke.org>
 * @license AGPL-3.0
 */

import React from "react"
import { BrowserRouter as Router } from "react-router-dom"
import Layout from "./components/Layout"
import { getMaxDataDate } from "./utils.js"
import { hydrate, render } from "react-dom"

const main = async () => {
    const { year, quarter } = await getMaxDataDate()
    const defaultPath = "pull_requests/" + year + "/" + quarter
    const loc = window.location.href
    const validUrlParams = ["pull_requests", "pushes", "stars", "issues"]
    const isValidURL = validUrlParams.some((v) => loc.includes(v))
    const url = "/githut/" + defaultPath

    if (!isValidURL) {
        window.history.pushState("", "", url)
    }

    if (loc.includes("/#/")) {
        const nohash = loc.replace("/#/","/")
        window.history.pushState("", "", nohash)
    }

    const rootElement = document.getElementById("root")
    if (rootElement.hasChildNodes()) {
        hydrate(
            <Router>
                <Layout />
            </Router>,
            document.getElementById("root")
        )
    } else {
        render(
            <Router>
                <Layout />
            </Router>,
            document.getElementById("root")
        )
    }
}

main()
