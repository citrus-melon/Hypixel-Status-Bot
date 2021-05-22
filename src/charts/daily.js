const historyChart = require("./history");

const todayCallback = (value) => {
    if (value === 0) return 'Today';
    else return value;
}

module.exports = class dailyHistoryChart extends historyChart {
    constructor(players, title) {
        let chart = super(players);
        chart.options.scales.x.ticks.callback = todayCallback;
        chart.options.scales.x.title.text = 'Days Ago';
        chart.options.plugins.title.text = title;
        return chart;
    }
}