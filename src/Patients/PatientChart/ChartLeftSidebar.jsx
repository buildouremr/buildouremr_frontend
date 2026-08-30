import React from 'react';
import { Leaf, Activity, Clock, Wine, ActivitySquare, Check, ChevronRight } from 'lucide-react';

const ChartLeftSidebar = ({ patientId, patientData }) => {
  if (!patientData) return null;

  const renderBulletList = (str, dotColor) => {
    if (!str) return <div className="flex items-center gap-3 text-sm text-gray-700">None</div>;
    const items = str.split(',').map(s => s.trim()).filter(Boolean);
    const colorClass = dotColor === 'red' ? 'bg-red-500' : 'bg-blue-500';
    return (
      <ul className="list-none p-0 m-0 flex flex-col gap-2">
        {items.map((t, i) => (
          <li key={i} className="flex items-center gap-3 text-sm text-gray-700">
            <div className={`w-2 h-2 rounded-full ${colorClass}`}></div>
            {t}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="w-[280px] bg-white border-r border-gray-200 flex flex-col overflow-y-auto shrink-0 scrollbar-thin scrollbar-thumb-gray-300">
      <div className="p-6 flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <span className="text-lg font-semibold text-gray-900">Patient Snapshot</span>
          <span className="text-xs text-gray-400">Patient details in one spot</span>
        </div>
        
        {/* Allergies */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-400">
            <Leaf size={16} /> Allergies (3)
          </div>
          {renderBulletList(patientData.allergies, 'red')}
          <div className="text-xs text-gray-400 flex justify-between cursor-pointer pt-1 hover:text-gray-500 transition-colors">
            View all Allergies <ChevronRight size={14}/>
          </div>
        </div>

        <div className="h-[1px] bg-gray-100 my-2"></div>

        {/* Chronic Conditions */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-400">
            <Activity size={16} /> Chronic Conditions (3)
          </div>
          {renderBulletList(patientData.chronicConditions, 'blue')}
          <div className="text-xs text-gray-400 flex justify-between cursor-pointer pt-1 hover:text-gray-500 transition-colors">
            View all conditions <ChevronRight size={14}/>
          </div>
        </div>

        <div className="h-[1px] bg-gray-100 my-2"></div>

        {/* Previous Visits */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-400">
            <Clock size={16} /> Previous Visits (3)
          </div>
          
          <div className="mt-2 flex flex-col">
            {[
              {date: '19 July 2026', doc: 'Dr. Ashok (Cardio)', desc: 'Regular BP checkup'},
              {date: '24 Mar 2026', doc: 'Dr. Priya (Gen MEd)', desc: 'Viral Fever'},
              {date: '28 Jan 2026', doc: 'Dr. Ashok (Cardio)', desc: 'Initial Consultation'}
            ].map((v, i, arr) => (
              <div key={i} className={`flex gap-3 relative ${i !== arr.length - 1 ? 'mb-4' : ''}`}>
                {i !== arr.length - 1 && (
                  <div className="absolute left-[5px] top-[14px] -bottom-[16px] w-[2px] bg-gray-200"></div>
                )}
                <div className="w-3 h-3 rounded-full border-2 border-green-500 bg-white mt-1 z-10 shrink-0"></div>
                <div className="flex flex-col gap-0.5 flex-1">
                  <div className="text-xs text-gray-400">{v.date}</div>
                  <div className="text-sm font-medium text-gray-900">{v.doc}</div>
                  <div className="text-xs text-gray-400">{v.desc}</div>
                </div>
                <div className="text-gray-400">
                  <ActivitySquare size={16} />
                </div>
              </div>
            ))}
          </div>

          <div className="text-xs text-gray-400 flex justify-between cursor-pointer pt-1 hover:text-gray-500 transition-colors">
            View all previous visit list <ChevronRight size={14}/>
          </div>
        </div>
        
        <div className="h-[1px] bg-gray-100 my-2"></div>

        {/* Risk Factors */}
        <div className="bg-yellow-50 rounded-xl p-4 flex flex-col gap-3">
          <div className="text-sm font-semibold text-yellow-600">Risk Factors</div>
          <div className="flex items-center gap-3 text-sm text-yellow-800"><Wine size={16} className="text-yellow-800"/> Non-smoker</div>
          <div className="flex items-center gap-3 text-sm text-yellow-800"><Wine size={16} className="text-yellow-800"/> Occasional Alcohol</div>
          <div className="flex items-center gap-3 text-sm text-yellow-800"><ActivitySquare size={16} className="text-yellow-800"/> Family Hx: Diabetes (Father)</div>
        </div>

        {/* Insurance */}
        <div className="mt-4">
          <div className="text-sm text-gray-400">Insurance</div>
          <div className="flex justify-between items-center mt-2">
            <div>
              <div className="text-base font-semibold text-gray-900">{patientData.insurance || 'Star Health — Gold'}</div>
              <div className="text-xs text-gray-400">Valid: Dec 2025</div>
            </div>
            <Check size={20} className="text-green-600" />
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChartLeftSidebar;
