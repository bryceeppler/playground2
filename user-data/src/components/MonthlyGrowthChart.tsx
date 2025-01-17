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
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface MetricData {
  date: string;
  count: number;
}

interface Props {
  searchQueries: MetricData[];
  buyButtonClicks: MetricData[];
  activeUsers: MetricData[];
  newUsers: MetricData[];
}

interface MonthlyTotal {
  [key: string]: number;
}

const calculateMonthlyGrowth = (data: MetricData[]) => {
  // Group by month
  const monthlyTotals: MonthlyTotal = data.reduce((acc, item) => {
    const month = item.date.substring(0, 7); // YYYY-MM
    acc[month] = (acc[month] || 0) + item.count;
    return acc;
  }, {} as MonthlyTotal);

  // Calculate growth rates
  const months = Object.keys(monthlyTotals).sort();
  const growthRates = months.slice(1).map((month, index) => {
    const previousMonth = months[index];
    const currentValue = monthlyTotals[month];
    const previousValue = monthlyTotals[previousMonth];
    const growthRate = previousValue > 0 
      ? ((currentValue - previousValue) / previousValue) * 100
      : 0;
    
    return {
      month,
      rate: Math.round(growthRate * 100) / 100
    };
  });

  return growthRates;
};

export const MonthlyGrowthChart: React.FC<Props> = ({
  searchQueries,
  buyButtonClicks,
  activeUsers,
  newUsers,
}) => {
  const searchGrowth = calculateMonthlyGrowth(searchQueries);
  const clicksGrowth = calculateMonthlyGrowth(buyButtonClicks);
  const activeUsersGrowth = calculateMonthlyGrowth(activeUsers);
  const newUsersGrowth = calculateMonthlyGrowth(newUsers);

  const chartData = {
    labels: searchGrowth.map(item => item.month),
    datasets: [
      {
        label: 'Search Queries Growth',
        data: searchGrowth.map(item => item.rate),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1,
      },
      {
        label: 'Buy Button Clicks Growth',
        data: clicksGrowth.map(item => item.rate),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 1,
      },
      {
        label: 'Active Users Growth',
        data: activeUsersGrowth.map(item => item.rate),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        borderColor: 'rgb(53, 162, 235)',
        borderWidth: 1,
      },
      {
        label: 'New Users Growth',
        data: newUsersGrowth.map(item => item.rate),
        backgroundColor: 'rgba(255, 206, 86, 0.5)',
        borderColor: 'rgb(255, 206, 86)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Month-over-Month Growth Rates',
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `Growth Rate: ${context.raw.toFixed(2)}%`
        }
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Growth Rate (%)'
        }
      },
    },
  };

  return (
    <div className="col-span-1 bg-white p-6 rounded-lg shadow-lg">
      <Bar data={chartData} options={options} />
    </div>
  );
}; 