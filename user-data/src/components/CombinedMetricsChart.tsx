import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface MetricData {
  date: string;
  count: number;
}

interface Props {
  searchQueries: MetricData[];
  buyButtonClicks: MetricData[];
  activeUsers: MetricData[];
}

const calculate7DayAverage = (data: MetricData[]) => {
  return data.map((point, index, array) => {
    const start = Math.max(0, index - 6);
    const count = Math.min(7, index - start + 1);
    const sum = array.slice(start, index + 1).reduce((sum, p) => sum + p.count, 0);
    return {
      date: point.date,
      count: Math.round(sum / count * 10) / 10
    };
  });
};

export const CombinedMetricsChart: React.FC<Props> = ({ searchQueries, buyButtonClicks, activeUsers }) => {
  const searchQueriesAvg = calculate7DayAverage(searchQueries);
  const buyButtonClicksAvg = calculate7DayAverage(buyButtonClicks);
  const activeUsersAvg = calculate7DayAverage(activeUsers);

  const chartData = {
    labels: searchQueries.map(item => item.date),
    datasets: [
      {
        label: 'Search Queries (7-Day Avg)',
        data: searchQueriesAvg.map(item => item.count),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
      },
      {
        label: 'Buy Button Clicks (7-Day Avg)',
        data: buyButtonClicksAvg.map(item => item.count),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
      },
      {
        label: 'Active Users (7-Day Avg)',
        data: activeUsersAvg.map(item => item.count),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Combined Metrics (7-Day Averages)',
      },
    },
    scales: {
      x: {
        type: 'time' as const,
        time: { unit: 'month' as const },
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
          text: 'Count'
        }
      },
    },
  };

  return (
    <div className="col-span-1 bg-white p-6 rounded-lg shadow-lg">
      <Line data={chartData} options={options} />
    </div>
  );
}; 