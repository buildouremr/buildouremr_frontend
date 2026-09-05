import React from 'react';
import { ArrowLeft } from 'lucide-react';

const ChartHeader = ({ patientData, onBack, rightAction }) => {
  if (!patientData) return null;

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === '-') return '-';
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

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
            <div className="flex items-center gap-2 mt-1">
              <span className="flex items-center gap-1 bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-xs font-medium">
                ID: {patientData.id || "-"}
              </span>
              <span className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium ${patientData.gender === 'F' ? 'bg-pink-50 text-pink-600' : 'bg-blue-50 text-blue-600'}`}>
                {patientData.gender === 'F' ? '♀ Female' : patientData.gender === 'M' ? '♂ Male' : patientData.gender}
              </span>
              <span className="flex items-center gap-1 bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-xs font-medium">
                {String(patientData.age).replace(/\s*(years?|yrs?)\s*$/i, '').trim()} yrs
              </span>
              <span className="flex items-center gap-1 bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-xs font-medium">
                Dob: {formatDate(patientData.dob)}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-center justify-center gap-1">
          <span className="text-xs text-gray-400">Blood Group</span>
          <span className="text-base font-semibold text-red-500">{patientData.bloodGroup?.value || "-"}</span>
          <span className="text-[10px] text-gray-400">{patientData.bloodGroup?.date !== "-" ? patientData.bloodGroup?.date : ""}</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs text-gray-400">Height</span>
          <span className="text-base font-semibold text-gray-900">{patientData.height?.value || "-"}</span>
          <span className="text-[10px] text-gray-400">{patientData.height?.date !== "-" ? patientData.height?.date : ""}</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs text-gray-400">Weight</span>
          <span className="text-base font-semibold text-gray-900">{patientData.weight?.value || "-"}</span>
          <span className="text-[10px] text-gray-400">{patientData.weight?.date !== "-" ? patientData.weight?.date : ""}</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs text-gray-400">BMI</span>
          <span className="text-base font-semibold text-red-500">{patientData.bmi?.value || "-"}</span>
          <span className="text-[10px] text-gray-400">{patientData.bmi?.date !== "-" ? patientData.bmi?.date : ""}</span>
        </div>
        <div className="flex flex-col items-center justify-center gap-1 border-l border-gray-200 pl-6 h-full mr-4">
          <span className="text-xs text-gray-400">Last Visit</span>
          <span className="text-base font-semibold text-gray-900">{patientData.lastVisit || "-"}</span>
        </div>
        {rightAction && <div>{rightAction}</div>}
      </div>
    </div>
  );
};

export default ChartHeader;
