import React from 'react';
import { LineChart } from 'lucide-react';

const LabsAndTrendsTab = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 mt-6 border border-gray-100 rounded-xl bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
      <div className="w-16 h-16 flex items-center justify-center text-gray-400 mb-4">
        <LineChart strokeWidth={1.5} size={32} />
      </div>
      <h3 className="text-base font-semibold text-gray-600 mb-2">Labs & Trends</h3>
      <p className="text-sm text-gray-400 text-center">
        View the Patients medical trends and make decisions confidently
      </p>
    </div>
  );
};

export default LabsAndTrendsTab;
