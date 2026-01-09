import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { Card } from '../../common';

const COLORS = {
  technique: '#40E0D0',
  strength: '#FF6B6B',
  endurance: '#4ECDC4',
  mixed: '#9B59B6'
};

const LABELS = {
  technique: 'Technique',
  strength: 'Strength',
  endurance: 'Endurance',
  mixed: 'Mixed'
};

export function WorkoutTypeChart({ workouts }) {
  // Count workouts by type
  const typeCounts = workouts.reduce((acc, w) => {
    const type = w.type || 'mixed';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(typeCounts).map(([type, count]) => ({
    name: LABELS[type] || type,
    value: count,
    color: COLORS[type] || '#6B7C93'
  }));

  if (data.length === 0) {
    return (
      <Card>
        <h3 className="font-semibold mb-4" style={{ color: '#1E3A5F' }}>Workout Distribution</h3>
        <div className="h-40 flex items-center justify-center">
          <p style={{ color: '#6B7C93' }}>Complete workouts to see your distribution!</p>
        </div>
      </Card>
    );
  }

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card>
      <h3 className="font-semibold mb-4" style={{ color: '#1E3A5F' }}>Workout Distribution</h3>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={70}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-3 mt-2">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs" style={{ color: '#6B7C93' }}>
              {entry.name} ({Math.round((entry.value / total) * 100)}%)
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default WorkoutTypeChart;
