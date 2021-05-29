const colors = require('./colors');
const FILL_COLORS = colors.ACCENTS.map(color => color + colors.FILL_OPACITY);

const nullBarPlugin =  {
    beforeDraw: (chart) => {
        const ctx = chart.canvas.getContext('2d');
        const xAxis = chart.scales['x'];
        const yAxis = chart.scales['y'];
        const data = chart.data.datasets[0].data;
        ctx.save();
        for (let i = 0; i < data.length; i++) {
            const value = data[i];
            if (value !== null && value !== undefined) continue;
            const x = xAxis.getPixelForValue(i);
            ctx.textAlign = 'center';
            ctx.font = 'italic bold 16px Helvetica';
            ctx.fillStyle = colors.FOREGROUND;
            ctx.fillText('Untracked', x, yAxis.bottom - 20);
        }
        ctx.restore();
    }
}

module.exports = class ComparisionChart {
    constructor(values, usernames, title) {
        const data = {
        	datasets: [{
            data: values,
            borderColor: colors.ACCENTS,
            backgroundColor: FILL_COLORS,
            borderWidth: 2,
            borderRadius: 10,
            borderSkipped: 'bottom',
          }],
          labels: usernames
        }
        
        const options = {
            responsive: false,
            scales: {
                y: {
                    title: {
                        text: 'Minutes played',
                        display: true,
                    },
                    grace: '5%',
                },
            },
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: title
                }
            }
        }
        
        return {
            type: 'bar',
            data: data,
            options: options,
            plugins: [nullBarPlugin]
        };
        
    }
}