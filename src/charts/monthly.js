const historyChart = require("./history");

module.exports = class monthlyHistoryChart extends historyChart {
    constructor(values, username) {
        let chart = super(values, username);
        chart.options.scales.x.title.text = 'Months Ago';
        chart.options.plugins.title.text = 'Monthly Playtime History';
        return chart;
    }
}