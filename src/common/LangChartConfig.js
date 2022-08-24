/**
 * Config for the language chart
 * Contains initial Highcharts configuration
 * Please note that the license for this file is
 * not AGPL-3.0 since Highcharts is licensed under CC BY-NC 3.0
 * If Highcharts gets replaced in the future this class will
 * be rewritten and licensed under AGPL-3.0
 * @author Fabian Beuke <mail@beuke.org>
 * @license CC BY-NC 3.0
 * @see {@link https://creativecommons.org/licenses/by-nc/3.0/}
 */

import { isMobile } from "react-device-detect"

export default {
    credits: { enabled: false },
    chart: {
        type: "spline",
        backgroundColor: "transparent",
        width: isMobile ? 0 : 1400,
    },
    title: { text: "" },
    xAxis: { categories: [],
        labels: {
            formatter: function () {
                return " "
            },
        },
    },
    yAxis: {
        title: {
            text: "",
        },
        labels: {
            formatter: function () {
                return this.value * 100 + "%"
            },
        },
    },
    plotOptions: {
        spline: {
            lineWidth: 3,
            states: { hover: { lineWidth: 5 } },
            marker: { enabled: false },
        },
        series: {
            animation: {
                duration: 200,
            },
        },
    },
    responsive: {
        rules: [
            {
                condition: {
                    maxWidth: 0,
                },
                chartOptions: {
                    chart: { width: null },
                    legend: {
                        layout: "horizontal",
                        align: "center",
                        verticalAlign: "bottom",
                    },
                },
            },
        ],
    },
    tooltip: {
        formatter: function () {
            return (
                '<span style="color:' +
                this.series.color +
                '">' +
                this.series.name +
                "</span>: <b>" +
                (this.y * 100).toFixed(2) +
                "%</b>"
            )
        },
    },
}
