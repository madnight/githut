import React from "react"
import LangChart from "./LangChart"
import LangTable from "./LangTable"

export default class Layout extends React.Component {
  render() {
    return (
      <div>
        <LangChart />
        <LangTable />
      </div>
    );
  }
}
