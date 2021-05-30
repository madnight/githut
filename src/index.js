/**
 * Entrypoint for the react app
 * Provides a basic app wrapper for react
 * @author Fabian Beuke <mail@beuke.org>
 * @license AGPL-3.0
 */

import { HashRouter } from "react-router-dom";
import Layout from "components/Layout"
import { getMaxDataDate } from "utils.js"
import { hydrate, render } from "react-dom"

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

    const rootElement = document.getElementById("root")
    if (rootElement.hasChildNodes()) {
        hydrate(
            <HashRouter>
                <Layout />
            </HashRouter>,
            document.getElementById("root")
        )
    } else {
        render(
            <HashRouter>
                <Layout />
            </HashRouter>,
            document.getElementById("root")
        )
    }
}

main()
