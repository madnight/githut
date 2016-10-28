export class LangChartStore {

  constructor() {
    this.config = {
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
  }

  getConfig() {
    return this.config;
  }

}
