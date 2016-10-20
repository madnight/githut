import React from "react";
import axios from "axios";
import ReactHighcharts from 'react-highcharts';
import { map } from 'lodash'

export default class LangChart extends React.Component {

    state = {
        credits: { enabled: false },
        chart: { type: 'spline' },
        title: { text: 'Github Language Statistics' },
        xAxis: {
            categories: function() {
                var q = [];
                for (var i = 12; i < 99; i++)
                    for (var n = 1; n < 5; n++)
                        q.push(i + "/Q" + n)
                return q;
            },
        },
        yAxis: { title: { text: 'Pull Request %' } },
        plotOptions: {
            spline: { lineWidth: 4, states: {
                    hover: { lineWidth: 5 } },
                marker: { enabled: false },
            }
        },
        tooltip: {
            formatter: function() {
                return '<span style="color:' + this.series.color + '">' + this.series.name + '</span>: <b>' + Highcharts.numberFormat((this.y * 100), 2, '.') + '%</b>';
            }
        },
    };

    constructor(props) {
        super(props);
        this.update = this.update.bind(this);
    }

    update(chart) {
        var xdata = [];
        axios.get('http://localhost:8080/data.json').then(function(d) {
            const data = d.data

            var langs = ['C++', 'C', 'Objective-C', 'Ruby',
                'Java', 'JavaScript', 'Go', 'PHP', 'Python', 'Shell'
            ];

            const langExsist = (name) => {
                if (!_.includes(langs, name))
                    return true;
                for (var key in xdata)
                    if (xdata[key].name == name)
                        return true;
            }

            const addData = (name, d) => {
                for (var key in xdata)
                    if (xdata[key].name == name)
                        (xdata[key].data).push(d)
            }

            _.map(data, function(d) {
                if (!(langExsist(d.lang)))
                    xdata.push({
                        name: d.lang,
                        data: []
                    });
                addData(d.lang, d.count)
            });

            const sumQ = (a) => {
                var test = [];
                for (var i = 0; i < a.length; i = i + 3)
                    test.push(a[i] + a[i + 1] + a[i + 2]);
                return test;
            }

            const sumData = (data) => {
                for (var key in data)
                    data[key].data = sumQ(data[key].data)
            }

            const pData = (data) => {
                for (var i = 0; i < 19; i++) { //TODO fix 19 magic
                    var temp = 0;
                    for (var key in data)
                        temp += data[key].data[i];
                    for (var key in data)
                        data[key].data[i] = data[key].data[i] / temp;
                }
            }

            sumData(xdata);
            pData(xdata);
            // console.log(JSON.stringify(data));

            _.map(xdata, function(d) {
                chart.addSeries(d, false);
            });
            chart.redraw();
        });

    }

    render() {
        return (<ReactHighcharts config = { this.state }
            callback = { this.update }> </ReactHighcharts>
        );
    }
}
