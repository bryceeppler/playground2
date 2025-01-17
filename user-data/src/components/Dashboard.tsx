import React, { useEffect, useState } from 'react';
import { DailyChart } from './DailyChart';
import { WeeklyChart } from './WeeklyChart';
import { MonthlyChart } from './MonthlyChart';
import styles from './Charts.module.css';

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

export const Dashboard: React.FC = () => {
  const [dailyData, setDailyData] = useState<DailyData[]>([]);
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);

  useEffect(() => {
    // Load and process data
    const processData = async () => {
      try {
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
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    processData();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles['dashboard-title']}>User Registration Dashboard</h1>
      <div className={styles['charts-grid']}>
        <DailyChart data={dailyData} />
        <WeeklyChart data={weeklyData} />
        <MonthlyChart data={monthlyData} />
      </div>
    </div>
  );
}; 