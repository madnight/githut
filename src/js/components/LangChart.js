import React from "react";
import axios from "axios";
import ReactHighcharts from 'react-highcharts';
import { map, first } from 'lodash'

export default class LangChart extends React.Component {

    config = {
        credits: { enabled: false },
        chart: { type: 'spline' },
        title: { text: 'Github Language Statistics' },
        yAxis: { title: { text: 'Pull Request %' } },
        plotOptions: {
            spline: { lineWidth: 4,
                states: { hover: { lineWidth: 5 } },
                marker: { enabled: false },
            }
        },
        tooltip: {
            formatter: function() {
                return '<span style="color:' + this.series.color + '">'
                + this.series.name + '</span>: <b>'
                + (this.y * 100).toFixed(2) + '%</b>'
            }
        }
     };

    isTopLanguage(name) {
        return _.includes(['C++', 'C', 'Objective-C', 'Ruby', 'Java',
            'JavaScript', 'Go', 'PHP', 'Python', 'Shell' ], name)
    }

    categories() {
        return _.flatten(_.map(_.range(12,99), year =>
            _.map(_.range(1,5), quarter => year + "/Q" + quarter)))
    }

    sumQuarters(data) {
        return _.each(data, v =>
            v.data = _.map(_.chunk(v.data, 3), _.sum))
    }

    percentageData(data) {
        const sum = _.map(_.unzip(_.map(data, i => i.data)), _.sum)
        return _.each(data, v => v.data = _.zipWith(v.data, sum, _.divide))
    }

    createSeries({data}) {
        return _.chain(data)
        .filter(d => this.isTopLanguage(d.lang))
        .map(d => ({ name: d.lang,
            data: _.map(_.filter(data, { 'lang': d.lang }), d => d.count) }))
        .uniqBy('name')
        .value()
    }

    componentDidMount() {
        let chart = this.refs.chart.getChart()
        const series = _.flow(this.createSeries,
            this.sumQuarters, this.percentageData).bind(this)
        axios.get('https://beuke.org/github-stats/data.json').then((d => {
            _.map(series(d), s => chart.addSeries(s, false))
            _.first(chart.xAxis).setCategories(this.categories())
            chart.redraw()
        }).bind(this))
    }

    render() {
        return (<ReactHighcharts config = { this.config } ref="chart"> </ReactHighcharts>);
    }
}
