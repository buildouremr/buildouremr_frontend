import React from 'react';
import { ArrowLeft } from 'lucide-react';

const ChartHeader = ({ patientData, onBack }) => {
  if (!patientData) return null;

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-white border-b border-gray-100 shadow-sm">
      <div className="flex items-center gap-4">
        <button 
          className="bg-transparent border-none cursor-pointer text-gray-500 flex items-center justify-center p-2 rounded-lg transition-colors hover:bg-gray-100 hover:text-gray-900" 
          onClick={onBack}
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-4">
          <img 
             src={`https://i.pravatar.cc/150?u=${patientData.name}`} 
             alt="avatar" 
             className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-lg font-semibold object-cover" 
             onError={(e)=>{e.target.onerror = null; e.target.style.display='none';}}
          />
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <span className="text-xl font-semibold text-gray-900">{patientData.name}</span>
              <span className="flex items-center gap-1.5 text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-full font-medium">● Stable</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span>{patientData.gender}</span>
              <span className="text-gray-300">•</span>
              <span>{patientData.age} Years</span>
              <span className="text-gray-300">•</span>
              <span>DOB: {patientData.dob}</span>
              <span className="text-gray-300">•</span>
              <span>ID: PT-9021</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs text-gray-400">Blood Group</span>
          <span className="text-base font-semibold text-red-500">{patientData.bloodGroup}</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs text-gray-400">Height</span>
          <span className="text-base font-semibold text-gray-900">{patientData.height}</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs text-gray-400">Weight</span>
          <span className="text-base font-semibold text-gray-900">{patientData.weight}</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs text-gray-400">BMI</span>
          <span className="text-base font-semibold text-red-500">{patientData.bmi}</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs text-gray-400">Last Visit</span>
          <span className="text-base font-semibold text-gray-900">{patientData.lastVisit || "12 July 2026"}</span>
        </div>
      </div>
    </div>
  );
};

export default ChartHeader;
