import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { Card, Badge, Button } from '../../common';

// Convert V-grade to numeric for charting
const gradeToNumber = (grade) => {
  if (!grade) return 0;
  const match = grade.match(/V(\d+)/i);
  return match ? parseInt(match[1], 10) : 0;
};

// Convert number back to V-grade
const numberToGrade = (num) => `V${num}`;

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 rounded-lg shadow-lg border border-gray-100 text-sm">
        <p className="font-medium text-[--color-secondary]">{label}</p>
        <p className="text-[--color-primary] font-bold">
          V{payload[0].value}
        </p>
      </div>
    );
  }
  return null;
}

export function GradeProgression({ personalRecords, onAddGrade }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [gradeType, setGradeType] = useState('boulder');
  const [newGrade, setNewGrade] = useState('');

  const boulderGrades = personalRecords.boulderGrade || [];
  const ropeGrades = personalRecords.ropeGrade || [];

  // Format data for chart
  const boulderData = boulderGrades
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map(record => ({
      date: format(parseISO(record.date), 'MMM d'),
      value: gradeToNumber(record.value),
      grade: record.value
    }));

  const currentBoulderMax = boulderGrades.length > 0
    ? boulderGrades.reduce((max, r) => {
        const num = gradeToNumber(r.value);
        return num > gradeToNumber(max) ? r.value : max;
      }, 'V0')
    : null;

  const currentRopeMax = ropeGrades.length > 0
    ? ropeGrades[ropeGrades.length - 1].value
    : null;

  const handleAddGrade = () => {
    if (newGrade && onAddGrade) {
      onAddGrade(gradeType === 'boulder' ? 'boulderGrade' : 'ropeGrade', newGrade);
      setNewGrade('');
      setShowAddModal(false);
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[--color-secondary]">Climbing Grades</h3>
        <Button size="sm" variant="outline" onClick={() => setShowAddModal(true)}>
          + Log Send
        </Button>
      </div>

      {/* Current maxes */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-[--color-primary]/10 rounded-xl p-3 text-center">
          <p className="text-3xl mb-1">🪨</p>
          <p className="text-xl font-bold text-[--color-secondary]">
            {currentBoulderMax || '-'}
          </p>
          <p className="text-xs text-[--color-text-muted]">Boulder Max</p>
        </div>
        <div className="bg-orange-100 rounded-xl p-3 text-center">
          <p className="text-3xl mb-1">🧗</p>
          <p className="text-xl font-bold text-[--color-secondary]">
            {currentRopeMax || '-'}
          </p>
          <p className="text-xs text-[--color-text-muted]">Rope Max</p>
        </div>
      </div>

      {/* Chart */}
      {boulderData.length > 1 ? (
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={boulderData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: '#6B7C93' }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#6B7C93' }}
                axisLine={{ stroke: '#E5E7EB' }}
                tickFormatter={(v) => `V${v}`}
                domain={[0, 'dataMax + 1']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="stepAfter"
                dataKey="value"
                stroke="#40E0D0"
                strokeWidth={2}
                dot={{ fill: '#40E0D0', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-40 flex flex-col items-center justify-center text-center bg-gray-50 rounded-xl">
          <p className="text-3xl mb-2">📈</p>
          <p className="text-[--color-text-muted]">Log your sends to track progress!</p>
        </div>
      )}

      {/* Add Grade Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 mx-4 max-w-sm w-full">
            <h3 className="text-lg font-bold text-[--color-secondary] mb-4">Log a Send</h3>

            {/* Type selector */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setGradeType('boulder')}
                className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                  gradeType === 'boulder'
                    ? 'border-[--color-primary] bg-[--color-primary]/10'
                    : 'border-gray-200'
                }`}
              >
                <span className="text-xl">🪨</span>
                <p className="text-sm font-medium">Boulder</p>
              </button>
              <button
                onClick={() => setGradeType('rope')}
                className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                  gradeType === 'rope'
                    ? 'border-[--color-primary] bg-[--color-primary]/10'
                    : 'border-gray-200'
                }`}
              >
                <span className="text-xl">🧗</span>
                <p className="text-sm font-medium">Rope</p>
              </button>
            </div>

            {/* Grade input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-[--color-secondary] mb-2">
                What grade did you send?
              </label>
              {gradeType === 'boulder' ? (
                <div className="grid grid-cols-4 gap-2">
                  {['V0', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7'].map(grade => (
                    <button
                      key={grade}
                      onClick={() => setNewGrade(grade)}
                      className={`p-2 rounded-lg text-sm font-medium transition-all ${
                        newGrade === grade
                          ? 'bg-[--color-primary] text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {grade}
                    </button>
                  ))}
                </div>
              ) : (
                <input
                  type="text"
                  value={newGrade}
                  onChange={(e) => setNewGrade(e.target.value)}
                  placeholder="e.g., 5.10a"
                  className="w-full p-3 border border-gray-200 rounded-xl"
                />
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setShowAddModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleAddGrade} disabled={!newGrade} className="flex-1">
                Log Send
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

export default GradeProgression;
