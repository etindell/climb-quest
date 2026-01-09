import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp, Battery } from 'lucide-react';
import { Card } from '../common';
import { DELOAD_CONFIG } from '../../data/program';

export function DeloadBanner({ expanded: initialExpanded = false }) {
  const [expanded, setExpanded] = useState(initialExpanded);

  return (
    <Card className="bg-amber-50 border border-amber-200">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
          <Battery size={20} className="text-amber-600" />
        </div>

        <div className="flex-1 text-left">
          <p className="font-bold text-amber-800">
            Deload Week
          </p>
          <p className="text-sm text-amber-700">
            Recovery is when you get stronger
          </p>
        </div>

        {expanded ? (
          <ChevronUp size={20} className="text-amber-600" />
        ) : (
          <ChevronDown size={20} className="text-amber-600" />
        )}
      </button>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-amber-200">
          <p className="text-sm text-amber-800 mb-3">
            {DELOAD_CONFIG.message}
          </p>

          <ul className="space-y-2">
            {DELOAD_CONFIG.tips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-amber-700">
                <Info size={14} className="mt-0.5 flex-shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}

// Compact inline version
export function DeloadIndicator() {
  return (
    <div className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
      <Battery size={12} />
      <span>Deload Week</span>
    </div>
  );
}

export default DeloadBanner;
