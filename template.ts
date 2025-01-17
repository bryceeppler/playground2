import { styles } from "./styles.ts";
export function createHtmlTemplate(data: string) {
    return `<!DOCTYPE html>
    <html>
    <head>
        <title>Data Visualization</title>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns"></script>
        <style>${styles}</style>
    </head>
    <body>
        <div class="container">
            <h1 class="dashboard-title">User Registration Dashboard</h1>
            
            <div class="charts-grid">
                <div class="chart-container full-width">
                    <h2 class="section-title">Daily User Registrations</h2>
                    <div class="chart-wrapper full-width">
                        <canvas id="dailyChart"></canvas>
                    </div>
                </div>
                
                <div class="chart-container">
                    <h2 class="section-title">Weekly User Registrations</h2>
                    <div class="chart-wrapper">
                        <canvas id="weeklyChart"></canvas>
                    </div>
                </div>
                
                <div class="chart-container">
                    <h2 class="section-title">Monthly User Registrations</h2>
                    <div class="chart-wrapper">
                        <canvas id="monthlyChart"></canvas>
                    </div>
                </div>
            </div>
        </div>
        <script>
            const dailyData = ${data};
            
            // Aggregate data by month with projection for incomplete month
            const monthlyData = dailyData.reduce((acc, curr) => {
                const monthKey = curr.date.substring(0, 7);
                if (!acc[monthKey]) {
                    acc[monthKey] = {
                        total: 0,
                        days: 0
                    };
                }
                acc[monthKey].total += curr.value;
                acc[monthKey].days += 1;
                return acc;
            }, {});

            // Calculate projection for the last month
            const monthlyDataArray = Object.entries(monthlyData).map(([date, data]) => {
                const isLastMonth = date === Object.keys(monthlyData).sort().pop();
                if (isLastMonth) {
                    const daysInMonth = new Date(date + '-01').getMonth() === 1 ? 28 : 31;
                    const projectedTotal = Math.round((data.total / data.days) * daysInMonth);
                    return {
                        date: date + '-01',
                        actual: data.total,
                        projected: projectedTotal - data.total
                    };
                }
                return {
                    date: date + '-01',
                    actual: data.total,
                    projected: 0
                };
            });

            // Aggregate data by week
            const weeklyData = dailyData.reduce((acc, curr) => {
                const date = new Date(curr.date);
                const weekStart = new Date(date);
                weekStart.setDate(date.getDate() - date.getDay());
                const weekKey = weekStart.toISOString().substring(0, 10);
                if (!acc[weekKey]) acc[weekKey] = 0;
                acc[weekKey] += curr.value;
                return acc;
            }, {});

            const weeklyDataArray = Object.entries(weeklyData).map(([date, value]) => ({
                date,
                value
            }));

            // Calculate 7-day moving average
            const movingAverage = dailyData.map((point, index, array) => {
                const start = Math.max(0, index - 6);
                const count = Math.min(7, index - start + 1);
                const sum = array.slice(start, index + 1).reduce((sum, p) => sum + p.value, 0);
                return {
                    date: point.date,
                    value: Math.round(sum / count * 10) / 10
                };
            });

            // Daily Chart with moving average
            const dailyChart = new Chart(
                document.getElementById('dailyChart').getContext('2d'),
                {
                    type: 'line',
                    data: {
                        labels: dailyData.map(d => d.date),
                        datasets: [
                            {
                                label: 'Daily Values',
                                data: dailyData.map(d => d.value),
                                borderColor: 'rgba(75, 192, 192, 0.3)',
                                borderWidth: 1,
                                pointRadius: 2,
                                tension: 0.1
                            },
                            {
                                label: '7-Day Average',
                                data: movingAverage.map(d => d.value),
                                borderColor: 'rgb(75, 192, 192)',
                                borderWidth: 2,
                                pointRadius: 0,
                                tension: 0.4
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        interaction: {
                            intersect: false,
                            mode: 'index'
                        },
                        plugins: {
                            decimation: {
                                enabled: true,
                                algorithm: 'min-max'
                            }
                        },
                        scales: {
                            x: {
                                type: 'time',
                                time: { unit: 'month' },
                                ticks: {
                                    maxRotation: 45,
                                    minRotation: 45
                                },
                                title: {
                                    display: true,
                                    text: 'Date'
                                }
                            },
                            y: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: 'Daily Registrations'
                                }
                            }
                        }
                    }
                }
            );

            const weeklyChart = new Chart(
                document.getElementById('weeklyChart').getContext('2d'),
                {
                    type: 'bar',
                    data: {
                        labels: weeklyDataArray.map(d => d.date),
                        datasets: [{
                            label: 'Weekly Total',
                            data: weeklyDataArray.map(d => d.value),
                            backgroundColor: 'rgb(153, 102, 255)',
                            borderColor: 'rgb(153, 102, 255)'
                        }]
                    },
                    options: {
                        responsive: true,
                        scales: {
                            x: {
                                type: 'time',
                                time: { unit: 'week' },
                                ticks: {
                                    maxRotation: 45,
                                    minRotation: 45
                                },
                                title: {
                                    display: true,
                                    text: 'Week Starting'
                                }
                            },
                            y: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: 'Weekly Total'
                                }
                            }
                        }
                    }
                }
            );

            // Monthly Chart with projection
            const monthlyChart = new Chart(
                document.getElementById('monthlyChart').getContext('2d'),
                {
                    type: 'bar',
                    data: {
                        labels: monthlyDataArray.map(d => d.date),
                        datasets: [
                            {
                                label: 'Actual Registrations',
                                data: monthlyDataArray.map(d => d.actual),
                                backgroundColor: 'rgb(75, 192, 192)',
                                borderColor: 'rgb(75, 192, 192)',
                                stack: 'stack0'
                            },
                            {
                                label: 'Projected Additional',
                                data: monthlyDataArray.map(d => d.projected),
                                backgroundColor: 'rgba(75, 192, 192, 0.3)',
                                borderColor: 'rgba(75, 192, 192, 0.3)',
                                stack: 'stack0'
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        scales: {
                            x: {
                                stacked: true,
                                type: 'time',
                                time: { unit: 'month' },
                                ticks: {
                                    maxRotation: 45,
                                    minRotation: 45
                                },
                                title: {
                                    display: true,
                                    text: 'Month'
                                }
                            },
                            y: {
                                stacked: true,
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: 'Monthly Registrations'
                                }
                            }
                        },
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    label(context) {
                                        const value = context.raw || 0;
                                        const dataIndex = context.dataIndex;
                                        const datasetIndex = context.datasetIndex;
                                        
                                        if (datasetIndex === 1 && value > 0) {
                                            const actualValue = monthlyDataArray[dataIndex].actual;
                                            const total = actualValue + value;
                                            return 'Projected Total: ' + total;
                                        }
                                        return context.dataset.label + ': ' + value;
                                    }
                                }
                            }
                        }
                    }
                }
            );
        </script>
    </body>
    </html>`;
} 