/** @param {number[]} values */
const convertData = (values, label) => {
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
        borderColor: '#FF8888',
        backgroundColor: '#FF888822',
    }
}

module.exports = class historyChart {
    constructor(values, username) {
        const dataset = convertData(values, username);
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
            data: {datasets: [dataset]},
            options: options
        };
        
    }
}