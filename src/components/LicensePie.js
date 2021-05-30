/**
 * A Highcharts chart that shows the top five licenses on GitHub
 * Please note that the license for this file is
 * not AGPL-3.0 since Highcharts is licensed under CC BY-NC 3.0
 * If Highcharts gets replaced in the future this class will
 * be rewritten and licensed under AGPL-3.0
 * @author Fabian Beuke <mail@beuke.org>
 * @license CC BY-NC 3.0
 * @see {@link https://creativecommons.org/licenses/by-nc/3.0/}
 */

import { useState, useEffect } from "react";
import licenses from "../data/github-licenses.json"
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"
import { mapKeys, update, take, map, pipe } from "lodash/fp"

export default function LicensePie() {
    const config = {
        credits: { enabled: false },
        chart: { type: "pie", backgroundColor: "transparent" },
        title: { text: "Top 5 Open Source Licenses" },
        tooltip: {
            formatter: function () {
                return (
                    '<span style="color:' +
                    this.series.color +
                    '">' +
                    this.point.name +
                    "</span>: <b>" +
                    this.percentage.toFixed(2) +
                    "%</b>"
                )
            },
        },
    }

    const [state, setState] = useState(config)

    useEffect(() => {
        const series = pipe(
            map(mapKeys((k) => (k === "license" ? "name" : "y"))),
            map(update("y")(Math.floor)),
            take(5)
        )(licenses)
        setState({ ...config, series: [{ data: series }] })
    }, [])

    return (
        <center>
            <HighchartsReact highcharts={Highcharts} options={state} />
        </center>
    )
}
