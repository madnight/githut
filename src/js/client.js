import React from "react"
import ReactDOM from "react-dom"
import Layout from "./components/Layout"
import styles from '../style.styl' // eslint-disable-line no-unused-vars
import 'jquery/dist/jquery.min.js' // Material Button
import 'materialize-css/bin/materialize.js' // Style

const app = document.createElement('div')
app.id = "app"
document.body.appendChild(app);
ReactDOM.render(<Layout/>, app)
