const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

const width = 800;
const height = 400;

const background = {
    id: 'chart_background',
    beforeDraw: (chart) => {
        const ctx = chart.canvas.getContext('2d');
        ctx.save();
        ctx.globalCompositeOperation = 'destination-over';
        ctx.fillStyle = '#36393F';
        ctx.fillRect(0, 0, chart.width, chart.height);
        ctx.restore();
    }
};

const chartCallback = (ChartJS) => {
    ChartJS.defaults.color = 'rgb(220, 221, 222)';
    ChartJS.defaults.borderColor = 'rgb(100, 101, 102)';
    ChartJS.defaults.font.size = 20;
    ChartJS.defaults.scale.grid.lineWidth = 2;
    ChartJS.register([background]);
};

module.exports = new ChartJSNodeCanvas({ width, height, chartCallback });