// Chart
const dataBar = {
    type: 'bar',
    data: {
        labels: ['Monday', 'Tuesday' , 'Wednesday' , 'Thursday' , 'Friday' , 'Saturday' , 'Sunday '],
        datasets: [
            {
                label: 'Sales',
                data: [2112, 2343, 2545, 3423, 2365, 1985, 987],

                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 99, 132, 0.2)'
                ],
            },
        ],
    },
};

new Chart(document.getElementById('bar-chart'), dataBar);
