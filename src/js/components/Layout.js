import React from "react"
import LangChart from "./LangChart"
import LangTable from "./LangTable"
import LicensePie from "./LicensePie"
import Button from "./Button"
import Head from "./Head"
import Header from "./Header"
import Content from "./Content"
import Footer from "./Footer"
import EventStore from "../stores/EventStore"

export default class Layout extends React.Component {
  render() {
    return (
      <div>
        <Head/>
        <Header/>
        <LangChart store={EventStore}/>
        <Button store={EventStore}/>
        <LangTable store={EventStore}/>
        <LicensePie/>
        <Content/>
        <Footer/>
      </div>
    );
  }
}
