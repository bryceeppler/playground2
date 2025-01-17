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

interface DataPoint {
  date: string;
  value: number;
}

interface DailyChartProps {
  data: DataPoint[];
}

export const DailyChart: React.FC<DailyChartProps> = ({ data }) => {
  // Calculate 7-day moving average
  const movingAverage = data.map((point, index, array) => {
    const start = Math.max(0, index - 6);
    const count = Math.min(7, index - start + 1);
    const sum = array.slice(start, index + 1).reduce((sum, p) => sum + p.value, 0);
    return {
      date: point.date,
      value: Math.round(sum / count * 10) / 10
    };
  });

  const chartData = {
    labels: data.map(d => d.date),
    datasets: [
      {
        label: 'Daily Values',
        data: data.map(d => d.value),
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
  };

  const options = {
    responsive: true,
    interaction: {
      intersect: false,
      mode: 'index' as const
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
          text: 'Daily Registrations'
        }
      }
    }
  };

  return (
    <div className="col-span-2 bg-white rounded-xl p-5 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col">
      <h2 className="text-gray-600 text-lg font-medium mb-5 pb-2.5 border-b border-gray-100">
        Daily User Registrations
      </h2>
      <div className="w-full h-[500px] relative flex-grow">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}; 