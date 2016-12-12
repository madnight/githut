import React from "react"
import LangChart from "./LangChart"
import LangTable from "./LangTable"
import LicensePie from "./LicensePie"

export default class Layout extends React.Component {
  render() {
    return (
      <div>
        <LangChart/>
        <LangTable/>
        <LicensePie/>
      </div>
    );
  }
}
