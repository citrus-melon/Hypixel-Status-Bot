const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const colors = require('./charts/colors');

const width = 800;
const height = 400;

const background = {
    id: 'chart_background',
    beforeDraw: (chart) => {
        const ctx = chart.canvas.getContext('2d');
        ctx.save();
        ctx.globalCompositeOperation = 'destination-over';
        ctx.fillStyle = colors.BACKGROUND;
        ctx.fillRect(0, 0, chart.width, chart.height);
        ctx.restore();
    }
};

const chartCallback = (ChartJS) => {
    ChartJS.defaults.color = colors.FOREGROUND;
    ChartJS.defaults.borderColor = colors.FOREGROUND + colors.FILL_OPACITY;
    ChartJS.defaults.font.size = 20;
    ChartJS.defaults.font.family = 'Roboto';
    ChartJS.defaults.scale.grid.lineWidth = 2;
    ChartJS.register([background]);
};

const renderer = new ChartJSNodeCanvas({ width, height, chartCallback });

renderer.registerFont('./assets/Roboto/Roboto-Regular.ttf', { family: 'Roboto' });
renderer.registerFont('./assets/Roboto/Roboto-Bold.ttf', { family: 'Roboto', weight: 'bold' });
renderer.registerFont('./assets/Roboto/Roboto-Italic.ttf', { family: 'Roboto', style: 'italic' });
renderer.registerFont('./assets/Roboto/Roboto-BoldItalic.ttf', { family: 'Roboto', weight: 'bold', style: 'italic' });

module.exports = renderer;