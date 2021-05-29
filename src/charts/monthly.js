const historyChart = require("./history");

module.exports = class MonthlyHistoryChart extends historyChart {
    constructor(values) {
        let chart = super(values);
        chart.options.scales.x.title.text = 'Months Ago';
        chart.options.plugins.title.text = 'Monthly Playtime History';
        return chart;
    }
}