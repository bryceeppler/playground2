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
import styles from './Charts.module.css';

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
    <div className={styles['chart-container']}>
      <h2 className={styles['section-title']}>Monthly User Registrations</h2>
      <div className={styles['chart-wrapper']}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}; 