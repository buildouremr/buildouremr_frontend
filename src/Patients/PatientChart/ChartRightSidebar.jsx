import React from 'react';
import { AlertTriangle, FlaskConical, ChevronRight } from 'lucide-react';

const ChartRightSidebar = ({ patientId, patientData, initialData }) => {

  return (
    <div className="w-[300px] flex flex-col gap-4 overflow-y-auto pr-1 shrink-0 scrollbar-thin scrollbar-thumb-gray-300">
      {/* Clinical Summary */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
        <div className="flex flex-col gap-1 mb-3">
          <span className="text-lg font-semibold text-gray-900">Clinical Summary</span>
          <span className="text-xs text-gray-400">Active conditions, labs & ongoing medications</span>
        </div>
        
        {/* Warning Box */}
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

        <div className="h-[1px] bg-gray-100 my-1"></div>

        {/* Ongoing Medications */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-400">Ongoing Medications (3)</div>
          <div className="flex flex-col gap-4 mt-3">
            <div className="flex gap-3">
              <div className="w-3.5 h-3.5 rounded-full border-2 border-green-500 mt-0.5 shrink-0"></div>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold text-gray-900">Vit D3 60,000 IU sachet</span>
                <span className="text-xs text-gray-400">Weekly • since Jul 2024</span>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-3.5 h-3.5 rounded-full border-2 border-green-500 mt-0.5 shrink-0"></div>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold text-gray-900">Calcium Carbonate 500 mg</span>
                <span className="text-xs text-gray-400">0-1-0 • since Jul 2024</span>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-3.5 h-3.5 rounded-full border-2 border-green-500 mt-0.5 shrink-0"></div>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold text-gray-900">Paracetamol 500 mg</span>
                <span className="text-xs text-gray-400">0-1-1 • since Jul 2024</span>
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-400 flex justify-between cursor-pointer pt-1 hover:text-gray-500 transition-colors">View full medication list <ChevronRight size={14}/></div>
        </div>

        <div className="h-[1px] bg-gray-100 my-1"></div>

        {/* Lab Results */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-400">Lab Results (2)</div>
          <div className="mt-3 flex flex-col gap-2">
            <div className="flex justify-between items-center border border-gray-100 p-3 rounded-lg">
              <div className="flex items-center gap-3">
                <FlaskConical size={20} className="text-gray-400"/>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-900">Diabetese Report</span>
                  <span className="text-xs text-gray-400">12 March 2026</span>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-400"/>
            </div>
            <div className="flex justify-between items-center border border-gray-100 p-3 rounded-lg">
              <div className="flex items-center gap-3">
                <FlaskConical size={20} className="text-gray-400"/>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-900">Thyroid Report</span>
                  <span className="text-xs text-gray-400">12 March 2026</span>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-400"/>
            </div>
          </div>
          <div className="text-xs text-gray-400 flex justify-between cursor-pointer pt-1 hover:text-gray-500 transition-colors">View full Lab Tests <ChevronRight size={14}/></div>
        </div>

        <div className="h-[1px] bg-gray-100 my-1"></div>

        {/* Patient Documents */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-400">Patient Documents</div>
          <div className="mt-3 flex flex-col gap-2">
            <div className="flex justify-between items-center border border-gray-100 p-3 rounded-lg">
              <div className="flex items-center gap-3">
                <FlaskConical size={20} className="text-gray-400"/>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-900">Diabetese Report</span>
                  <span className="text-xs text-gray-400">12 March 2026</span>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-400"/>
            </div>
            <div className="flex justify-between items-center border border-gray-100 p-3 rounded-lg">
              <div className="flex items-center gap-3">
                <FlaskConical size={20} className="text-gray-400"/>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-900">Thyroid Report</span>
                  <span className="text-xs text-gray-400">12 March 2026</span>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-400"/>
            </div>
          </div>
          <div className="text-xs text-gray-400 flex justify-between cursor-pointer pt-1 hover:text-gray-500 transition-colors">View full Patient Report <ChevronRight size={14}/></div>
        </div>

      </div>
    </div>
  );
};

export default ChartRightSidebar;
