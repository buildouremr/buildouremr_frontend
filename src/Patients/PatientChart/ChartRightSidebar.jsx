import React from 'react';
import { AlertTriangle, FlaskConical, ChevronRight, Plus } from 'lucide-react';

const ChartRightSidebar = ({ patientId, patientData, initialData }) => {
  // Use data from initialData if available, otherwise default to empty arrays
  const hasDrugInteraction = initialData?.hasDrugInteraction || false;
  const ongoingMedications = initialData?.ongoingMedications || [];
  const labResults = initialData?.labResults || [];
  const patientDocuments = initialData?.patientDocuments || [];

  return (
    <div className="w-[320px] bg-white border-l border-gray-200 flex flex-col overflow-y-auto shrink-0 scrollbar-thin scrollbar-thumb-gray-300">
      <div className="p-6 flex flex-col gap-6">
        <div className="flex flex-col gap-1 mb-3">
          <span className="text-lg font-semibold text-gray-900">Clinical Summary</span>
          <span className="text-xs text-gray-400">Active conditions, labs & ongoing medications</span>
        </div>
        
        {/* Warning Box / Drug Interaction */}
        {hasDrugInteraction ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-red-500 text-sm font-semibold">
              <AlertTriangle size={16}/> Drug Interaction
            </div>
            <div>
              <div className="text-sm text-red-500 font-semibold">Lisinopril + NSAID</div>
              <div className="text-xs text-red-500">Increases risk of renal impairment.</div>
            </div>
            <div className="flex gap-3 mt-1">
              <button className="bg-white border border-red-500 text-red-500 py-1.5 px-3 rounded-md text-xs font-semibold cursor-pointer hover:bg-red-50 transition-colors">Override</button>
              <button className="bg-red-500 border-none text-white py-1.5 px-3 rounded-md text-xs font-semibold cursor-pointer hover:bg-red-600 transition-colors">Change Rx</button>
            </div>
          </div>
        ) : (
          <div className="bg-green-50/30 border border-green-200/50 rounded-xl p-4 flex flex-col gap-1">
            <div className="flex items-center gap-2 text-green-500 text-sm font-semibold">
              <AlertTriangle size={16}/> Drug Interaction
            </div>
            <div className="text-sm text-green-500 ml-6 font-medium">No Drug Interaction</div>
          </div>
        )}

        <div className="h-[1px] bg-gray-100 my-1"></div>

        {/* Ongoing Medications */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
              Ongoing Medications ({ongoingMedications.length})
            </div>
            {ongoingMedications.length === 0 && (
              <div className="text-blue-500 text-sm font-medium cursor-pointer flex items-center gap-1 hover:text-blue-600 transition-colors">
                <Plus size={14}/> Add
              </div>
            )}
          </div>
          
          {ongoingMedications.length > 0 ? (
            <>
              <div className="flex flex-col gap-4 mt-3">
                {ongoingMedications.map((med, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-green-500 mt-0.5 shrink-0"></div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-semibold text-gray-900">{med.name}</span>
                      <span className="text-xs text-gray-400">{med.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-xs text-gray-400 flex justify-between cursor-pointer pt-1 hover:text-gray-500 transition-colors">
                View full medication list <ChevronRight size={14}/>
              </div>
            </>
          ) : (
            <div className="text-sm text-gray-400">No Ongoing Medications</div>
          )}
        </div>

        <div className="h-[1px] bg-gray-100 my-1"></div>

        {/* Lab Results */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
              Lab Results ({labResults.length})
            </div>
            {labResults.length === 0 && (
              <div className="text-blue-500 text-sm font-medium cursor-pointer flex items-center gap-1 hover:text-blue-600 transition-colors">
                <Plus size={14}/> Add
              </div>
            )}
          </div>
          
          {labResults.length > 0 ? (
            <>
              <div className="mt-3 flex flex-col gap-2">
                {labResults.map((lab, idx) => (
                  <div key={idx} className="flex justify-between items-center border border-gray-100 p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FlaskConical size={20} className="text-gray-400"/>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900">{lab.name}</span>
                        <span className="text-xs text-gray-400">{lab.date}</span>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-gray-400"/>
                  </div>
                ))}
              </div>
              <div className="text-xs text-gray-400 flex justify-between cursor-pointer pt-1 hover:text-gray-500 transition-colors">
                View full Lab Tests <ChevronRight size={14}/>
              </div>
            </>
          ) : (
            <div className="text-sm text-gray-400">No Lab Results available</div>
          )}
        </div>

        <div className="h-[1px] bg-gray-100 my-1"></div>

        {/* Patient Documents */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
              Patient Documents ({patientDocuments.length})
            </div>
            {patientDocuments.length === 0 && (
              <div className="text-blue-500 text-sm font-medium cursor-pointer flex items-center gap-1 hover:text-blue-600 transition-colors">
                <Plus size={14}/> Add
              </div>
            )}
          </div>
          
          {patientDocuments.length > 0 ? (
            <>
              <div className="mt-3 flex flex-col gap-2">
                {patientDocuments.map((doc, idx) => (
                  <div key={idx} className="flex justify-between items-center border border-gray-100 p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FlaskConical size={20} className="text-gray-400"/>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900">{doc.name}</span>
                        <span className="text-xs text-gray-400">{doc.date}</span>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-gray-400"/>
                  </div>
                ))}
              </div>
              <div className="text-xs text-gray-400 flex justify-between cursor-pointer pt-1 hover:text-gray-500 transition-colors">
                View full Patient Report <ChevronRight size={14}/>
              </div>
            </>
          ) : (
            <div className="text-sm text-gray-400">No Patient documents available</div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ChartRightSidebar;
