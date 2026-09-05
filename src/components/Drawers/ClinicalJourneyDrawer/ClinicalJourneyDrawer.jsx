import React, { useState, useEffect } from 'react';
import { X, Printer, Search, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import ClinicalSummaryTab from './ClinicalSummaryTab';
import LabsAndTrendsTab from './LabsAndTrendsTab';
import DocumentsTab from './DocumentsTab';

const visits = [
  { id: 1, date: '14 Aug 2026', title: 'Routine Diabetes Follow-up', status: 'yellow' },
  { id: 2, date: '18 Jul 2026', title: 'Medication Adjustment', status: 'green' },
  { id: 3, date: '12 Apr 2026', title: 'HbA1c Review', status: 'yellow' },
  { id: 4, date: '20 Jan 2026', title: 'Routine Follow-up', status: 'green' },
  { id: 5, date: '14 Oct 2025', title: 'Initial Consultation', status: 'yellow' },
];

const ClinicalJourneyDrawer = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [selectedVisitId, setSelectedVisitId] = useState(1);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      document.body.style.overflow = 'hidden';
    } else {
      setTimeout(() => setIsRendered(false), 300);
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen && !isRendered) return null;

  const selectedVisit = visits.find(v => v.id === selectedVisitId) || visits[0];

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-[900px] max-w-[95vw] bg-white z-50 shadow-[-8px_0_24px_rgba(0,0,0,0.12)] flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-[24px] font-bold text-gray-900 m-0 leading-tight">Clinical Journey</h2>
            <p className="text-[14px] text-gray-500 mt-1">Review patient's clinical progression and previous treatment decisions</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-gray-500 hover:text-gray-700 bg-transparent border-none cursor-pointer text-sm font-semibold">
              <Printer size={18} /> Print
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-700 bg-transparent border-none cursor-pointer">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Main Content Split */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Left Sidebar */}
          <div className="w-[300px] border-r border-gray-100 flex flex-col shrink-0 bg-white">
            <div className="p-5 border-b border-gray-50">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search visit with agendas" 
                  className="w-full pl-9 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 shadow-sm"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-[2px] cursor-pointer opacity-50">
                  <span className="w-3.5 h-[2px] bg-gray-500 rounded-full inline-block"></span>
                  <span className="w-2.5 h-[2px] bg-gray-500 rounded-full inline-block ml-1"></span>
                  <span className="w-1.5 h-[2px] bg-gray-500 rounded-full inline-block ml-2"></span>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-2 mb-1">Recent Visits</span>
              {visits.map(visit => (
                <div 
                  key={visit.id}
                  onClick={() => setSelectedVisitId(visit.id)}
                  className={`relative p-4 rounded-xl cursor-pointer transition-colors group ${selectedVisitId === visit.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                >
                  {selectedVisitId === visit.id && (
                    <div className="absolute left-0 top-2 bottom-2 w-1 bg-blue-500 rounded-r-md"></div>
                  )}
                  <div className="flex justify-between items-start">
                    <span className={`text-[14px] font-bold ${selectedVisitId === visit.id ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-700'}`}>
                      {visit.date}
                    </span>
                    <div className={`w-2 h-2 rounded-full mt-1.5 ${visit.status === 'green' ? 'bg-green-500' : visit.status === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                  </div>
                  <div className={`text-[13px] mt-1 line-clamp-1 ${selectedVisitId === visit.id ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>
                    {visit.title}
                  </div>
                </div>
              ))}
              <button className="text-[13px] text-gray-400 hover:text-gray-600 flex items-center justify-between mt-4 px-2 bg-transparent border-none cursor-pointer w-full text-left font-medium">
                View all conditions <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Right Area */}
          <div className="flex-1 flex flex-col overflow-hidden bg-gray-50/30">
            {/* Top Bar for Right Area */}
            <div className="flex flex-col border-b border-gray-100 bg-white pt-6 px-8 shrink-0">
              <div className="flex flex-col items-center mb-6">
                <div className="flex items-center gap-4 text-gray-500 mb-2">
                  <button className="bg-transparent border-none cursor-pointer text-blue-500 hover:text-blue-600 flex items-center font-medium text-sm">
                    <ChevronLeft size={16} /> Previous
                  </button>
                  <div className="flex items-center gap-10 text-sm font-semibold">
                    <ChevronLeft size={16} className="text-gray-300 cursor-pointer hover:text-gray-500" />
                    <span className="text-gray-500">{selectedVisit.date}</span>
                    <ChevronRight size={16} className="text-gray-300 cursor-pointer hover:text-gray-500" />
                  </div>
                  <button className="bg-transparent border-none cursor-pointer text-gray-400 hover:text-gray-600 flex items-center font-medium text-sm">
                    Next <ChevronRight size={16} />
                  </button>
                </div>
                
                <div className="flex items-center gap-3">
                  <h3 className="text-[20px] font-semibold text-gray-900 m-0">{selectedVisit.title}</h3>
                  <span className="bg-yellow-100 text-yellow-700 text-[11px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide">Unsigned</span>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-8 border-b border-gray-100 mt-2 px-4">
                <button 
                  onClick={() => setActiveTab('summary')}
                  className={`pb-3 text-[14px] font-semibold border-b-2 transition-colors bg-transparent cursor-pointer outline-none ${activeTab === 'summary' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                  Clinical Summary
                </button>
                <button 
                  onClick={() => setActiveTab('labs')}
                  className={`pb-3 text-[14px] font-semibold border-b-2 transition-colors bg-transparent cursor-pointer outline-none ${activeTab === 'labs' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                  Labs & Trends
                </button>
                <button 
                  onClick={() => setActiveTab('documents')}
                  className={`pb-3 text-[14px] font-semibold border-b-2 transition-colors bg-transparent cursor-pointer outline-none ${activeTab === 'documents' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                  Documents
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto px-10 py-2 scrollbar-thin scrollbar-thumb-gray-200">
              {activeTab === 'summary' && <ClinicalSummaryTab />}
              {activeTab === 'labs' && <LabsAndTrendsTab />}
              {activeTab === 'documents' && <DocumentsTab />}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-2 text-gray-400">
            <Clock size={20} />
            <span className="text-[14px] font-medium">Moved to {selectedVisit.date} • {selectedVisit.title}</span>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors border-none cursor-pointer">
            Return to Current Visit
          </button>
        </div>

      </div>
    </>
  );
};

export default ClinicalJourneyDrawer;
