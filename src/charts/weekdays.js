module.exports = class weekdayTotalsChart {
    constructor(values, username) {
        const data = {
        	datasets: [{
            label: username,
            data: values,
            borderColor: '#FF8888',
            backgroundColor: '#FF888822',
            borderWidth: 2,
            borderRadius: 10,
            borderSkipped: 'bottom',
          }],
          labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
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
                title: {
                    display: true,
                    text: 'Total Playtime by Weekday'
                }
            }
        }
        return {
            type: 'bar',
            data: data,
            options: options
        };
        
    }
}