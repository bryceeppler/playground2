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
    <div className={styles['chart-container']}>
      <h2 className={styles['section-title']}>Weekly User Registrations</h2>
      <div className={styles['chart-wrapper']}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}; 