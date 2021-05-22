const colors = require("./colors");

/** @param {number[]} values */
const convertData = (values, label, color) => {
    const data = values.map((value, index) => {
        return {
            'x': index,
            'y': value
        }
    })

    return {
        label: label,
        fill: true,
        cubicInterpolationMode: 'monotone',
        tension: true,
        data: data,
        borderColor: color,
        backgroundColor: color + colors.FILL_OPACITY,
    }
}

module.exports = class historyChart {
    constructor(players) {
        const datasets = [];
        for (let i = 0; i < players.length; i++) {
            const player = players[i];
            const color = colors.ACCENTS[i % colors.ACCENTS.length];
            datasets.push(convertData(player.history, player.username, color));
        }

        const options = {
            responsive: false,
            scales: {
                y: {
                    title: {
                        text: 'Minutes played',
                        display: true,
                    }
                },
                x: {
                    reverse: true,
                    type: 'linear',
                    title: {
                        display: true,
                    },
                    ticks: {precision: 0}
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Playtime History'
                }
            }
        }

        return {
            type: 'line',
            data: {datasets: datasets},
            options: options
        };
    }
}