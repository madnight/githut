/**
 * Entrypoint for the react app
 * Provides a basic app wrapper for react
 * @author Fabian Beuke <mail@beuke.org>
 * @license AGPL-3.0
 */

import React from "react"
import ReactDOM from "react-dom"
import { HashRouter } from 'react-router-dom'
import Layout from "./components/Layout"
import styles from '../style.styl' // eslint-disable-line no-unused-vars
import 'jquery' // Material Button
import 'materialize-css' // Style

const production = window.location.href.includes("madnight.github.io")

if (!(window.location.href).includes("#")) {
    if (production)
        window.location.href = "/githut/#/pull_requests/2017/4"
    else
        window.location.href = "/#/pull_requests/2017/4"
}

const app = document.createElement('div')
app.id = "app"
document.body.appendChild(app);
ReactDOM.render(<HashRouter><Layout/></HashRouter>, app)
