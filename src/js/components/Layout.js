import React from "react"
import LangChart from "./LangChart"
import LangTable from "./LangTable"
import LicensePie from "./LicensePie"
import Head from "./Head"
import Header from "./Header"
import Content from "./Content"
import Footer from "./Footer"

export default class Layout extends React.Component {
  render() {
    return (
      <div>
        <Head/>
        <Header/>
        <LangChart/>
        <LangTable/>
        <LicensePie/>
        <Content/>
        <Footer/>
      </div>
    );
  }
}
