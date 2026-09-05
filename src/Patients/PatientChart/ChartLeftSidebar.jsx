import React from 'react';
import { Leaf, Activity, Clock, Wine, ActivitySquare, Check, ChevronRight, Plus, Pencil } from 'lucide-react';

const ChartLeftSidebar = ({ patientId, patientData, onAddAllergiesClick, onAddChronicConditionsClick }) => {
  if (!patientData) return null;

  const getCount = (str) => {
    if (!str || str === '-') return 0;
    return str.split(',').filter(s => s.trim().length > 0).length;
  };

  let allergiesCount = 0;
  let allergiesKeys = [];
  if (patientData.allergiesData && Object.keys(patientData.allergiesData).length > 0) {
    allergiesKeys = Object.keys(patientData.allergiesData);
    allergiesCount = allergiesKeys.length;
  } else {
    allergiesCount = getCount(patientData.allergies);
  }

  const renderBulletList = (str, dotColor, keysList, limit = 3) => {
    let items = [];
    if (keysList && keysList.length > 0) {
      items = keysList;
    } else {
      if (!str || str === '-') return null;
      items = str.split(',').map(s => s.trim()).filter(Boolean);
    }
    
    const displayItems = items.slice(0, limit);
    const colorClass = dotColor === 'red' ? 'bg-red-500' : 'bg-blue-500';
    return (
      <ul className="list-none p-0 m-0 flex flex-col gap-2">
        {displayItems.map((t, i) => (
          <li key={i} className="flex items-center gap-3 text-sm text-gray-700">
            <div className={`w-2 h-2 rounded-full ${colorClass}`}></div>
            {t}
          </li>
        ))}
      </ul>
    );
  };

  let chronicCount = 0;
  let chronicKeys = [];
  if (patientData.chronicConditionsData && Object.keys(patientData.chronicConditionsData).length > 0) {
    chronicKeys = Object.keys(patientData.chronicConditionsData);
    chronicCount = chronicKeys.length;
  } else {
    chronicCount = getCount(patientData.chronicConditions);
  }

  // Assuming no previous visits in patientData for now.
  const prevVisits = []; 
  const riskFactorsCount = getCount(patientData.riskFactors);
  const hasInsurance = patientData.insurance && patientData.insurance !== 'None' && patientData.insurance !== '-';

  return (
    <div className="w-[280px] bg-white border-r border-gray-200 flex flex-col overflow-y-auto shrink-0 scrollbar-thin scrollbar-thumb-gray-300">
      <div className="p-6 flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <span className="text-lg font-semibold text-gray-900">Patient Snapshot</span>
          <span className="text-xs text-gray-400">Patient details in one spot</span>
        </div>
        
        {/* Allergies */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
              Allergies ({allergiesCount})
            </div>
            {allergiesCount === 0 ? (
              <div 
                className="text-blue-500 text-sm font-medium cursor-pointer flex items-center gap-1 hover:text-blue-600 transition-colors"
                onClick={onAddAllergiesClick}
              >
                <Plus size={14}/> Add
              </div>
            ) : (
              <div 
                className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
                onClick={onAddAllergiesClick}
              >
                <Pencil size={14}/>
              </div>
            )}
          </div>
          {allergiesCount > 0 ? (
            <>
              {renderBulletList(patientData.allergies, 'red', allergiesKeys)}
              <div 
                className="text-xs text-gray-400 flex justify-between cursor-pointer pt-1 hover:text-gray-500 transition-colors"
                onClick={onAddAllergiesClick}
              >
                View all Allergies <ChevronRight size={14}/>
              </div>
            </>
          ) : (
            <div className="text-sm text-gray-400">No allergies recorded</div>
          )}
        </div>

        <div className="h-[1px] bg-gray-100 my-2"></div>

        {/* Chronic Conditions */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
              Chronic Conditions ({chronicCount})
            </div>
            {chronicCount === 0 ? (
              <div 
                className="text-blue-500 text-sm font-medium cursor-pointer flex items-center gap-1 hover:text-blue-600 transition-colors"
                onClick={onAddChronicConditionsClick}
              >
                <Plus size={14}/> Add
              </div>
            ) : (
              <div 
                className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
                onClick={onAddChronicConditionsClick}
              >
                <Pencil size={14}/>
              </div>
            )}
          </div>
          {chronicCount > 0 ? (
            <>
              {renderBulletList(patientData.chronicConditions, 'blue', chronicKeys)}
              <div 
                className="text-xs text-gray-400 flex justify-between cursor-pointer pt-1 hover:text-gray-500 transition-colors"
                onClick={onAddChronicConditionsClick}
              >
                View all conditions <ChevronRight size={14}/>
              </div>
            </>
          ) : (
            <div className="text-sm text-gray-400">No Chronic Condition recorded</div>
          )}
        </div>

        <div className="h-[1px] bg-gray-100 my-2"></div>

        {/* Previous Visits */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
            Previous Visit ({prevVisits.length})
          </div>
          
          {prevVisits.length > 0 ? (
            <>
              <div className="mt-2 flex flex-col">
                {prevVisits.map((v, i, arr) => (
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
            </>
          ) : (
            <div className="text-sm text-gray-400">No Previous Visit</div>
          )}
        </div>
        
        <div className="h-[1px] bg-gray-100 my-2"></div>

        {/* Risk Factors */}
        {riskFactorsCount > 0 ? (
          <div className="bg-yellow-50 rounded-xl p-4 flex flex-col gap-3">
            <div className="text-sm font-semibold text-yellow-600 uppercase tracking-wide">Risk Factors</div>
            {patientData.riskFactors.split(',').map((rf, idx) => (
              <div key={idx} className="flex items-center gap-3 text-sm text-yellow-800">
                <Wine size={16} className="text-yellow-800"/> {rf.trim()}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-yellow-50/50 rounded-xl p-4 flex flex-col gap-3 border border-yellow-100">
            <div className="flex justify-between items-center">
              <div className="text-sm font-semibold text-yellow-600 uppercase tracking-wide">Risk Factors</div>
              <div className="text-blue-500 text-sm font-medium cursor-pointer flex items-center gap-1 hover:text-blue-600 transition-colors">
                <Plus size={14}/> Add
              </div>
            </div>
            <div className="text-sm text-gray-500 italic">No risk factors identified</div>
          </div>
        )}

        {/* Insurance */}
        <div className="mt-4 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <div className="text-sm font-semibold text-gray-800">Insurance</div>
            {!hasInsurance && (
              <div className="text-blue-500 text-sm font-medium cursor-pointer flex items-center gap-1 hover:text-blue-600 transition-colors">
                <Plus size={14}/> Add
              </div>
            )}
          </div>
          {hasInsurance ? (
            <div className="flex justify-between items-center mt-2">
              <div>
                <div className="text-base font-semibold text-gray-900">{patientData.insurance}</div>
                <div className="text-xs text-gray-400">Valid: Dec 2025</div>
              </div>
              <Check size={20} className="text-green-600" />
            </div>
          ) : (
            <div className="text-sm text-gray-400">No Insurance Details</div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ChartLeftSidebar;

