'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import type { TimeSeriesChartProps, MonthlyDataPoint } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export function TimeSeriesChart({
  data,
  title,
  height = 300
}: TimeSeriesChartProps) {
  // Transform data for Recharts
  const chartData = data.map(point => {
    const dateObj = point.date instanceof Date ? point.date : new Date(point.date);
    return {
      month: point.month,
      count: point.count,
      date: dateObj.toISOString(),
      displayMonth: dateObj.toLocaleDateString('en-US', {
        month: 'short',
        year: '2-digit'
      })
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
          <p className="font-medium text-gray-900">
            {new Date(data.date).toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric'
            })}
          </p>
          <p className="text-sm text-gray-600">
            <span className="inline-block h-3 w-3 rounded-full bg-blue-500 mr-2"></span>
            {payload[0].value} discussions
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="displayMonth"
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
          />
          <YAxis
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{
              fill: '#3b82f6',
              strokeWidth: 2,
              r: 4,
            }}
            activeDot={{
              r: 6,
              stroke: '#3b82f6',
              strokeWidth: 2,
              fill: '#ffffff',
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

interface MiniTrendChartProps {
  data: MonthlyDataPoint[];
  width?: number;
  height?: number;
  color?: string;
}

export function MiniTrendChart({
  data,
  width = 100,
  height = 30,
  color = '#3b82f6'
}: MiniTrendChartProps) {
  const chartData = data.slice(-6).map(point => ({
    month: point.month,
    count: point.count
  }));

  return (
    <ResponsiveContainer width={width} height={height}>
      <LineChart data={chartData}>
        <Line
          type="monotone"
          dataKey="count"
          stroke={color}
          strokeWidth={1.5}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}