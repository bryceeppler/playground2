import React, { useEffect, useState } from 'react';
import { DailyChart } from './DailyChart';
import { WeeklyChart } from './WeeklyChart';
import { MonthlyChart } from './MonthlyChart';
import { SearchQueriesChart } from './SearchQueriesChart';
import { BuyButtonChart } from './BuyButtonChart';
import { ActiveUsersChart } from './ActiveUsersChart';

interface DailyData {
  date: string;
  value: number;
}

interface WeeklyData {
  date: string;
  value: number;
}

interface MonthlyData {
  date: string;
  actual: number;
  projected: number;
}

interface MetricData {
  date: string;
  count: number;
}

export const Dashboard: React.FC = () => {
  const [dailyData, setDailyData] = useState<DailyData[]>([]);
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [searchQueries, setSearchQueries] = useState<MetricData[]>([]);
  const [buyButtonClicks, setBuyButtonClicks] = useState<MetricData[]>([]);
  const [activeUsers, setActiveUsers] = useState<MetricData[]>([]);

  useEffect(() => {
    // Load and process data
    const processData = async () => {
      try {
        // Load user registration data
        const response = await fetch('/users_db.csv');
        const csvText = await response.text();
        const rows = csvText.split('\n').slice(1); // Skip header
        
        // Process daily data
        const daily = rows.map(row => {
          const [date, value] = row.split(',');
          return { date, value: parseInt(value, 10) };
        });
        setDailyData(daily);

        // Process weekly data
        const weeklyMap = daily.reduce((acc, curr) => {
          const date = new Date(curr.date);
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          const weekKey = weekStart.toISOString().substring(0, 10);
          if (!acc[weekKey]) acc[weekKey] = 0;
          acc[weekKey] += curr.value;
          return acc;
        }, {} as Record<string, number>);

        const weekly = Object.entries(weeklyMap).map(([date, value]) => ({
          date,
          value
        }));
        setWeeklyData(weekly);

        // Process monthly data
        const monthlyMap = daily.reduce((acc, curr) => {
          const monthKey = curr.date.substring(0, 7);
          if (!acc[monthKey]) {
            acc[monthKey] = {
              total: 0,
              days: 0
            };
          }
          acc[monthKey].total += curr.value;
          acc[monthKey].days += 1;
          return acc;
        }, {} as Record<string, { total: number; days: number }>);

        const monthly = Object.entries(monthlyMap).map(([date, data]) => {
          const isLastMonth = date === Object.keys(monthlyMap).sort().pop();
          if (isLastMonth) {
            const daysInMonth = new Date(date + '-01').getMonth() === 1 ? 28 : 31;
            const projectedTotal = Math.round((data.total / data.days) * daysInMonth);
            return {
              date: date + '-01',
              actual: data.total,
              projected: projectedTotal - data.total
            };
          }
          return {
            date: date + '-01',
            actual: data.total,
            projected: 0
          };
        });
        setMonthlyData(monthly);

        // Load GA4 metrics
        const [searchQueriesResponse, buyButtonResponse, activeUsersResponse] = await Promise.all([
          fetch('/search_queries.csv'),
          fetch('/buy_button_clicks.csv'),
          fetch('/active_users.csv')
        ]);

        const searchQueriesText = await searchQueriesResponse.text();
        const buyButtonText = await buyButtonResponse.text();
        const activeUsersText = await activeUsersResponse.text();

        // Process search queries
        const searchQueriesRows = searchQueriesText.split('\n').slice(1);
        const searchQueriesData = searchQueriesRows.map(row => {
          const [date, count] = row.split(',');
          return { date, count: parseInt(count, 10) };
        }).filter(item => !isNaN(item.count));
        setSearchQueries(searchQueriesData);

        // Process buy button clicks
        const buyButtonRows = buyButtonText.split('\n').slice(1);
        const buyButtonData = buyButtonRows.map(row => {
          const [date, count] = row.split(',');
          return { date, count: parseInt(count, 10) };
        }).filter(item => !isNaN(item.count));
        setBuyButtonClicks(buyButtonData);

        // Process active users
        const activeUsersRows = activeUsersText.split('\n').slice(1);
        const activeUsersData = activeUsersRows.map(row => {
          const [date, count] = row.split(',');
          return { date, count: parseInt(count, 10) };
        }).filter(item => !isNaN(item.count));
        setActiveUsers(activeUsersData);

      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    processData();
  }, []);

  return (
    <div className="w-[95%] max-w-[1600px] mx-auto my-5 p-5">
      <h1 className="text-center text-2xl font-semibold text-gray-800 mb-10">
        Analytics Dashboard
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mx-auto">
        <DailyChart data={dailyData} />
        <WeeklyChart data={weeklyData} />
        <MonthlyChart data={monthlyData} />
        <SearchQueriesChart data={searchQueries} />
        <BuyButtonChart data={buyButtonClicks} />
        <ActiveUsersChart data={activeUsers} />
      </div>
    </div>
  );
}; 