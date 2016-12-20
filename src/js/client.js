import React from "react"
import ReactDOM from "react-dom"
import Layout from "./components/Layout"
import styles from '../style.styl' // eslint-disable-line no-unused-vars

const app = document.createElement('div')
app.id = "app"
document.body.appendChild(app);
ReactDOM.render(<Layout/>, app)
