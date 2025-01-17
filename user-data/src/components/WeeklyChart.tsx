import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface DataPoint {
  date: string;
  value: number;
}

interface WeeklyChartProps {
  data: DataPoint[];
}

export const WeeklyChart: React.FC<WeeklyChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map(d => d.date),
    datasets: [{
      label: 'Weekly Total',
      data: data.map(d => d.value),
      backgroundColor: 'rgb(153, 102, 255)',
      borderColor: 'rgb(153, 102, 255)'
    }]
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        type: 'time' as const,
        time: { unit: 'week' as const },
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
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col">
      <h2 className="text-gray-600 text-lg font-medium mb-5 pb-2.5 border-b border-gray-100">
        Weekly User Registrations
      </h2>
      <div className="w-full relative flex-grow">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}; 