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
                text: 'Days ago',
                display: true,
            },
            ticks: {
                callback(value) {
                    if (value === 0) return 'Today';
                    else return value;
                }
            }
        }
    },
    plugins: {
        title: {
            display: true,
            text: `Past week playtime`
        }
    }
}

module.exports = class dailyChart {
    constructor(values, username) {
        const dataset = convertData(values, username);
        return {
            type: 'line',
            data: {datasets: [dataset]},
            options: options
        };
        
    }
}