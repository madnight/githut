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
            'JavaScript', 'Go', 'PHP', 'Python', 'Shell' ], name);
    }

    categories() {
        let q = [];
        _.map(_.range(12,99), i => {
            _.map(_.range(1,5), n => { q.push(i + "/Q" + n) })
        })
        return q;
    }

    sumQuarters(data) {
        _.mapValues(data, v => {
            let tmp = [];
            let a = v.data;
            _.map(_.range(0, a.length, 3), i => {
                tmp.push(a[i] + a[i + 1] + a[i + 2]);
            });
            v.data = tmp;
        });
        return data;
    }

    percentageData(data) {
        _.map(_.range(0, _.first(data).data.length), i => {
            let tmp = 0;
            _.mapValues(data, v => tmp += v.data[i]);
            _.mapValues(data, v => v.data[i] = v.data[i] / tmp);
        });
        return data;
    }

    langExsist(name, d) {
        for (let key in d) if (d[key].name == name) return true;
    }

    addData(name, val, d) {
        _.mapValues(d, v => { if (v.name == name) v.data.push(val) })
    }

    createSeries({data}) {
        let tmp = [];
        _.map(data, ( d => {
            if (!this.langExsist(d.lang, tmp) && this.isTopLanguage(d.lang))
                tmp.push({ name: d.lang, data: []});
            this.addData(d.lang, d.count, tmp)
        }).bind(this));
        return tmp;
    }

    componentDidMount() {
        let chart = this.refs.chart.getChart();
        let series = _.flow(this.createSeries,
            this.sumQuarters, this.percentageData).bind(this);
        axios.get('http://localhost:8080/data.json').then(( d => {
            _.map(series(d), s => chart.addSeries(s, false));
            _.first(chart.xAxis).setCategories(this.categories())
            chart.redraw();
        }).bind(this));
    }

    render() {
        return (<ReactHighcharts config = { this.config } ref="chart"> </ReactHighcharts>
        );
    }
}
