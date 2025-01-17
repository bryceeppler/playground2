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

interface MonthlyDataPoint {
  date: string;
  actual: number;
  projected: number;
}

interface MonthlyChartProps {
  data: MonthlyDataPoint[];
}

export const MonthlyChart: React.FC<MonthlyChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map(d => d.date),
    datasets: [
      {
        label: 'Actual Registrations',
        data: data.map(d => d.actual),
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgb(75, 192, 192)',
        stack: 'stack0'
      },
      {
        label: 'Projected Additional',
        data: data.map(d => d.projected),
        backgroundColor: 'rgba(75, 192, 192, 0.3)',
        borderColor: 'rgba(75, 192, 192, 0.3)',
        stack: 'stack0'
      }
    ]
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        stacked: true,
        type: 'time' as const,
        time: { unit: 'month' as const },
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
    }
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col">
      <h2 className="text-gray-600 text-lg font-medium mb-5 pb-2.5 border-b border-gray-100">
        Monthly User Registrations
      </h2>
      <div className="w-full relative flex-grow">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}; 