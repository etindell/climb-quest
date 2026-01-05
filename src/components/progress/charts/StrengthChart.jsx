import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area, AreaChart
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { Card, Badge } from '../../common';

const METRICS = [
  { key: 'pullUps', label: 'Pull-ups', emoji: '💪', unit: 'reps', color: '#40E0D0' },
  { key: 'deadHang', label: 'Dead Hang', emoji: '🦥', unit: 'seconds', color: '#FF6B6B' },
  { key: 'plank', label: 'Plank', emoji: '🧘', unit: 'seconds', color: '#4ECDC4' }
];

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 rounded-lg shadow-lg border border-gray-100 text-sm">
        <p className="font-medium text-[--color-secondary]">{label}</p>
        <p className="text-[--color-primary]">
          {payload[0].value} {payload[0].payload.unit}
        </p>
      </div>
    );
  }
  return null;
}

export function StrengthChart({ personalRecords }) {
  const [selectedMetric, setSelectedMetric] = useState('pullUps');

  const metric = METRICS.find(m => m.key === selectedMetric);
  const records = personalRecords[selectedMetric] || [];

  // Format data for chart
  const chartData = records
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map(record => ({
      date: format(parseISO(record.date), 'MMM d'),
      value: record.value,
      unit: metric?.unit || ''
    }));

  // Get current PR
  const currentPR = records.length > 0
    ? Math.max(...records.map(r => r.value))
    : null;

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[--color-secondary]">Strength Progress</h3>
        {currentPR !== null && (
          <Badge variant="celebration">
            PR: {currentPR} {metric?.unit}
          </Badge>
        )}
      </div>

      {/* Metric selector */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {METRICS.map(m => (
          <button
            key={m.key}
            onClick={() => setSelectedMetric(m.key)}
            className={`
              px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap
              transition-colors flex items-center gap-1
              ${selectedMetric === m.key
                ? 'bg-[--color-primary] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            <span>{m.emoji}</span>
            <span>{m.label}</span>
          </button>
        ))}
      </div>

      {/* Chart */}
      {chartData.length > 1 ? (
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={metric?.color || '#40E0D0'} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={metric?.color || '#40E0D0'} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: '#6B7C93' }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#6B7C93' }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke={metric?.color || '#40E0D0'}
                strokeWidth={2}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : chartData.length === 1 ? (
        <div className="h-48 flex flex-col items-center justify-center text-center">
          <p className="text-4xl mb-2">{metric?.emoji}</p>
          <p className="text-2xl font-bold text-[--color-secondary]">
            {chartData[0].value} {metric?.unit}
          </p>
          <p className="text-sm text-[--color-text-muted]">First record!</p>
          <p className="text-xs text-[--color-text-muted] mt-1">
            Keep logging to see your progress chart
          </p>
        </div>
      ) : (
        <div className="h-48 flex flex-col items-center justify-center text-center">
          <p className="text-4xl mb-2">{metric?.emoji}</p>
          <p className="text-[--color-text-muted]">No records yet</p>
          <p className="text-sm text-[--color-text-muted] mt-1">
            Log your first {metric?.label.toLowerCase()} to start tracking!
          </p>
        </div>
      )}
    </Card>
  );
}

export default StrengthChart;
