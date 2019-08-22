/**
 * Entrypoint for the react app
 * Provides a basic app wrapper for react
 * @author Fabian Beuke <mail@beuke.org>
 * @license AGPL-3.0
 */

import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter } from 'react-router-dom'
import Layout from './components/Layout'
import styles from '../style.styl' // eslint-disable-line no-unused-vars
import 'jquery' // Material Button
import 'materialize-css' // Style
import { getMaxDataDate } from './utils.js'

const production = window.location.href.includes('madnight.github.io')

if (!production) {
    const { registerObserver } = require('react-perf-devtool')
    registerObserver({ shouldLog: true })
}

getMaxDataDate().then(maxDate => {
    const defaultPath = '#/pull_requests/' + maxDate.year + '/' + maxDate.quarter
    if (!(window.location.href).includes('#')) {
        if (production) { window.location.href = '/githut/' + defaultPath } else { window.location.href = '/' + defaultPath }
    }

    const app = document.createElement('div')
    app.id = 'app'
    document.body.appendChild(app)
    ReactDOM.render(<HashRouter><Layout/></HashRouter>, app)
}
)

