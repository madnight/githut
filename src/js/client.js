/**
 * Entrypoint for the react app
 * Provides a basic app wrapper for react
 * @author Fabian Beuke <mail@beuke.org>
 * @license AGPL-3.0
 */

import React from "react"
import ReactDOM from "react-dom"
import { HashRouter } from "react-router-dom"
import Layout from "./components/Layout"
import styles from "../style.styl" // eslint-disable-line no-unused-vars
import { getMaxDataDate } from "./utils.js"

const production = window.location.href.includes("madnight.github.io")

const main = async () => {
    const { year, quarter } = await getMaxDataDate()
    const defaultPath = "#/pull_requests/" + year + "/" + quarter
    const loc = window.location.href
    const validUrlParams = ["pull_requests", "pushes", "stars", "issues"]
    const isValidURL = validUrlParams.some((v) => loc.includes(v))
    const url = (production ? "/githut/" : "/") + defaultPath

    if (!isValidURL) {
        window.history.pushState("", "", url)
    }

    const app = document.createElement("div")
    app.id = "app"
    document.body.appendChild(app)
    ReactDOM.render(
        <HashRouter>
            <Layout />
        </HashRouter>,
        app
    )
}

main()
