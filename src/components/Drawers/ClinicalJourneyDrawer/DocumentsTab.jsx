import React from 'react';
import { UploadCloud, FileText, MoreVertical } from 'lucide-react';

const DocumentCard = ({ title, date, time }) => (
  <div className="border border-gray-100 rounded-xl p-4 bg-white shadow-sm flex items-center justify-between mb-3 hover:border-gray-200 transition-colors cursor-pointer">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
        <FileText size={20} />
      </div>
      <div className="flex flex-col">
        <span className="text-[14px] font-semibold text-gray-900">{title}</span>
        <span className="text-[12px] text-gray-400 mt-0.5">{date} &bull; {time}</span>
      </div>
    </div>
    <button className="text-gray-400 hover:text-gray-600 focus:outline-none p-1">
      <MoreVertical size={20} />
    </button>
  </div>
);

const DocumentsTab = () => {
  return (
    <div className="flex flex-col pb-6 mt-6">
      
      {/* Upload Area */}
      <div className="border border-dashed border-blue-400 rounded-xl p-6 flex flex-col items-center justify-center bg-blue-50/30 cursor-pointer hover:bg-blue-50/50 transition-colors mb-6">
        <UploadCloud size={24} className="text-blue-500 mb-2" strokeWidth={2} />
        <span className="text-[14px] font-semibold text-blue-500 mb-1">Click to upload</span>
        <span className="text-[12px] text-gray-400">Supported formats: PDF, JPG, PNG (Max 10 MB)</span>
      </div>

      {/* Lab Results */}
      <div className="mb-6">
        <h4 className="text-[14px] font-semibold text-gray-400 mb-3 px-1 uppercase tracking-wide">Lab Results</h4>
        <DocumentCard title="Lab Report – 14 August 2026" date="01 August 2026" time="09:15" />
        <DocumentCard title="Lab Report – 14 August 2026" date="01 August 2026" time="09:15" />
        <DocumentCard title="Lab Report – 14 August 2026" date="01 August 2026" time="09:15" />
      </div>

      {/* Prescriptions */}
      <div className="mb-6">
        <h4 className="text-[14px] font-semibold text-gray-400 mb-3 px-1 uppercase tracking-wide">Prescriptions</h4>
        <DocumentCard title="Lab Report – 14 August 2026" date="01 August 2026" time="09:15" />
        <DocumentCard title="Lab Report – 14 August 2026" date="01 August 2026" time="09:15" />
      </div>

      {/* Other Documents */}
      <div className="mb-2">
        <h4 className="text-[14px] font-semibold text-gray-400 mb-3 px-1 uppercase tracking-wide">Other Documents</h4>
        <DocumentCard title="Lab Report – 14 August 2026" date="01 August 2026" time="09:15" />
      </div>

    </div>
  );
};

export default DocumentsTab;
