import { loadData } from "./data.ts";

async function createHtml(): Promise<string> {
  const data = await loadData();
  
  return `<!DOCTYPE html>
  <html>
  <head>
      <title>Data Visualization</title>
      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
      <style>
          .container {
              width: 95%;
              margin: 20px auto;
          }
          .chart-container {
              margin-bottom: 60px;
              text-align: center;
              min-height: 100vh;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
          }
          .chart-wrapper {
              width: 100%;
              height: 80vh;
          }
          .chart-container:last-child {
              page-break-after: auto;
              margin-bottom: 20px;
          }
          .dashboard-title {
              text-align: center;
              color: #333;
              margin-bottom: 40px;
              font-size: 24px;
              font-family: Arial, sans-serif;
          }
          .section-title {
              color: #666;
              margin-bottom: 20px;
              font-size: 18px;
              font-family: Arial, sans-serif;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <h1 class="dashboard-title">User Registration Dashboard</h1>
          
          <div class="chart-container">
              <h2 class="section-title">Daily User Registrations</h2>
              <div class="chart-wrapper">
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
      <script>
          const dailyData = ${JSON.stringify(data)};
          
          // Aggregate data by month
          const monthlyData = dailyData.reduce((acc, curr) => {
              const monthKey = curr.date.substring(0, 7);
              if (!acc[monthKey]) acc[monthKey] = 0;
              acc[monthKey] += curr.value;
              return acc;
          }, {});

          // Aggregate data by week
          const weeklyData = dailyData.reduce((acc, curr) => {
              const date = new Date(curr.date);
              const weekStart = new Date(date);
              weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
              const weekKey = weekStart.toISOString().substring(0, 10);
              if (!acc[weekKey]) acc[weekKey] = 0;
              acc[weekKey] += curr.value;
              return acc;
          }, {});

          const monthlyDataArray = Object.entries(monthlyData).map(([date, value]) => ({
              date: date + '-01',
              value
          }));

          const weeklyDataArray = Object.entries(weeklyData).map(([date, value]) => ({
              date,
              value
          }));

          // Daily Chart
          const ctx1 = document.getElementById('dailyChart').getContext('2d');
          new Chart(ctx1, {
              type: 'line',
              data: {
                  labels: dailyData.map(d => d.date),
                  datasets: [{
                      label: 'Daily Values',
                      data: dailyData.map(d => d.value),
                      borderColor: 'rgb(75, 192, 192)',
                      tension: 10,
                      cubicInterpolationMode: 'monotone'
                  }]
              },
              options: {
                  responsive: true,
                  scales: {
                      x: {
                          type: 'time',
                          time: {
                              unit: 'month'
                          },
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
                              text: 'Daily Value'
                          }
                      }
                  }
              }
          });

          // Weekly Chart
          const ctx3 = document.getElementById('weeklyChart').getContext('2d');
          new Chart(ctx3, {
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
                          time: {
                              unit: 'week'
                          },
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
          });

          // Monthly Chart
          const ctx2 = document.getElementById('monthlyChart').getContext('2d');
          new Chart(ctx2, {
              type: 'bar',
              data: {
                  labels: monthlyDataArray.map(d => d.date),
                  datasets: [{
                      label: 'Monthly Total',
                      data: monthlyDataArray.map(d => d.value),
                      backgroundColor: 'rgb(75, 192, 192)',
                      borderColor: 'rgb(75, 192, 192)'
                  }]
              },
              options: {
                  responsive: true,
                  scales: {
                      x: {
                          type: 'time',
                          time: {
                              unit: 'month'
                          },
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
                          beginAtZero: true,
                          title: {
                              display: true,
                              text: 'Monthly Total'
                          }
                      }
                  }
              }
          });
      </script>
  </body>
  </html>`;
}

async function handler(_req: Request): Promise<Response> {
  const html = await createHtml();
  return new Response(html, {
    headers: {
      "content-type": "text/html",
    },
  });
}

console.log("Server running on http://localhost:8000");
Deno.serve(handler, { port: 8000 });