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

interface ActiveUsersData {
  date: string;
  count: number;
}

interface Props {
  data: ActiveUsersData[];
}

export const ActiveUsersChart: React.FC<Props> = ({ data }) => {
  // Calculate 7-day moving average
  const movingAverage = data.map((point, index, array) => {
    const start = Math.max(0, index - 6);
    const count = Math.min(7, index - start + 1);
    const sum = array.slice(start, index + 1).reduce((sum, p) => sum + p.count, 0);
    return {
      date: point.date,
      count: Math.round(sum / count * 10) / 10
    };
  });

  const chartData = {
    labels: data.map(item => item.date),
    datasets: [
      {
        label: 'Daily Active Users',
        data: data.map(item => item.count),
        borderColor: 'rgba(53, 162, 235, 0.3)',
        backgroundColor: 'rgba(53, 162, 235, 0.1)',
        borderWidth: 1,
        pointRadius: 2,
        tension: 0.1,
      },
      {
        label: '7-Day Average',
        data: movingAverage.map(item => item.count),
        borderColor: 'rgb(53, 162, 235)',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
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
        text: 'Daily Active Users',
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
          text: 'Number of Users'
        }
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <Line data={chartData} options={options} />
    </div>
  );
}; 