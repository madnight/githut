import React from "react"
import LangChart from "./LangChart"
import LangTable from "./LangTable"
import LicensePie from "./LicensePie"
import Content from "./Content"

export default class Layout extends React.Component {
  render() {
    return (
      <div>
        <LangChart/>
        <LangTable/>
        <LicensePie/>
        <Content/>
      </div>
    );
  }
}
