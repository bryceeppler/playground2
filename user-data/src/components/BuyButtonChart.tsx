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

interface BuyButtonData {
  date: string;
  count: number;
}

interface Props {
  data: BuyButtonData[];
}

export const BuyButtonChart: React.FC<Props> = ({ data }) => {
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
        label: 'Daily Buy Button Clicks',
        data: data.map(item => item.count),
        borderColor: 'rgba(255, 99, 132, 0.3)',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        borderWidth: 1,
        pointRadius: 2,
        tension: 0.1,
      },
      {
        label: '7-Day Average',
        data: movingAverage.map(item => item.count),
        borderColor: 'rgb(255, 99, 132)',
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
        text: 'Daily Buy Button Clicks',
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
          text: 'Number of Clicks'
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