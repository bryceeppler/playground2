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

const calculateEngagementScore = (
  searchQueries: MetricData[],
  buyButtonClicks: MetricData[],
  activeUsers: MetricData[]
) => {
  const dateMap = new Map<string, { actions: number; users: number }>();

  // Initialize map with active users
  activeUsers.forEach(item => {
    dateMap.set(item.date, { actions: 0, users: item.count });
  });

  // Add search queries to actions
  searchQueries.forEach(item => {
    const data = dateMap.get(item.date);
    if (data) {
      data.actions += item.count;
    }
  });

  // Add buy button clicks to actions
  buyButtonClicks.forEach(item => {
    const data = dateMap.get(item.date);
    if (data) {
      data.actions += item.count;
    }
  });

  // Calculate engagement score (actions per user)
  return Array.from(dateMap.entries()).map(([date, data]) => ({
    date,
    score: data.users > 0 ? Math.round((data.actions / data.users) * 100) / 100 : 0
  })).sort((a, b) => a.date.localeCompare(b.date));
};

export const UserEngagementChart: React.FC<Props> = ({
  searchQueries,
  buyButtonClicks,
  activeUsers,
}) => {
  const engagementData = calculateEngagementScore(searchQueries, buyButtonClicks, activeUsers);

  const chartData = {
    labels: engagementData.map(item => item.date),
    datasets: [
      {
        label: 'Actions per Active User',
        data: engagementData.map(item => item.score),
        borderColor: 'rgb(153, 102, 255)',
        backgroundColor: 'rgba(153, 102, 255, 0.1)',
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
        text: 'Daily User Engagement Score',
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `Actions per User: ${context.raw.toFixed(2)}`
        }
      }
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
          text: 'Actions per User'
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