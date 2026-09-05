import React from 'react';
import { TrendingUp, FileText, BriefcaseMedical, Pill, CheckSquare, Stethoscope, Activity, User, Calendar } from 'lucide-react';

const CardHeader = ({ icon: Icon, title, badge, badgeColor }) => (
  <div className="flex justify-between items-center mb-1">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
        <Icon size={16} />
      </div>
      <h3 className="text-[15px] font-semibold text-gray-900 m-0">{title}</h3>
    </div>
    {badge && (
      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md ${badgeColor}`}>
        {badge}
      </span>
    )}
  </div>
);

const ClinicalSummaryTab = () => {
  return (
    <div className="flex flex-col gap-4 pb-6 mt-6">
      
      {/* Visit Overview */}
      <div className="border border-gray-100 rounded-xl p-5 bg-white shadow-sm flex flex-col hover:border-gray-200 transition-colors cursor-pointer relative overflow-hidden group">
        <div className="absolute right-4 top-[50%] -translate-y-1/2 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <CardHeader 
          icon={TrendingUp} 
          title="Visit Overview" 
          badge="Improving"
          badgeColor="bg-green-100 text-green-600"
        />
        <div className="text-sm text-gray-500 leading-relaxed pr-8 pl-11">
          Overall, patient is improving. HbA1c reduced by 2.6% in 4 months. Weight reduced by 3 kg.
        </div>
      </div>

      {/* Reason for Visit */}
      <div className="border border-gray-100 rounded-xl p-5 bg-white shadow-sm flex flex-col hover:border-gray-200 transition-colors cursor-pointer relative overflow-hidden group">
        <div className="absolute right-4 top-[50%] -translate-y-1/2 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <CardHeader 
          icon={FileText} 
          title="Reason for Visit" 
        />
        <div className="text-sm text-gray-500 leading-relaxed pr-8 pl-11">
          Patient came for routine follow up, Blood sugar was high, Medication dose increased, Advised control and regular exercise.
        </div>
      </div>

      {/* Treatment Plan */}
      <div className="border border-gray-100 rounded-xl p-5 bg-white shadow-sm flex flex-col hover:border-gray-200 transition-colors cursor-pointer relative overflow-hidden group">
        <div className="absolute right-4 top-[50%] -translate-y-1/2 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <CardHeader 
          icon={BriefcaseMedical} 
          title="Treatment Plan" 
        />
        <div className="text-sm text-gray-500 leading-relaxed pr-8 pl-11">
          Continue current medication
        </div>
      </div>

      {/* Medication Changes */}
      <div className="border border-gray-100 rounded-xl p-5 bg-white shadow-sm flex flex-col hover:border-gray-200 transition-colors cursor-pointer relative overflow-hidden group">
        <div className="absolute right-4 top-[50%] -translate-y-1/2 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <CardHeader 
          icon={Pill} 
          title="Medication Changes" 
          badge="NO CHANGE"
          badgeColor="bg-blue-50 text-blue-600"
        />
        <div className="text-sm text-gray-500 leading-relaxed pr-8 pl-11">
          Metformin 1000 mg BD, Empagliflozin 10 mg OD, Telmisartan 40 mg OD, Atorvastatin 10 mg HS
        </div>
      </div>

      {/* Assessment */}
      <div className="border border-gray-100 rounded-xl p-5 bg-white shadow-sm flex flex-col hover:border-gray-200 transition-colors cursor-pointer relative overflow-hidden group">
        <div className="absolute right-4 top-[50%] -translate-y-1/2 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <CardHeader 
          icon={CheckSquare} 
          title="Assessment" 
        />
        <div className="text-sm text-gray-500 leading-relaxed pr-8 pl-11">
          Type 2 Diabetes Mellitus – Suboptimal Control
        </div>
      </div>

      {/* Examination */}
      <div className="border border-gray-100 rounded-xl p-5 bg-white shadow-sm flex flex-col hover:border-gray-200 transition-colors cursor-pointer relative overflow-hidden group">
        <div className="absolute right-4 top-[50%] -translate-y-1/2 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <CardHeader 
          icon={Stethoscope} 
          title="Examination" 
          badge="STABLE"
          badgeColor="bg-blue-50 text-blue-600 text-[10px]"
        />
        <div className="text-sm text-gray-500 leading-relaxed pr-8 pl-11">
          CVS: S1 S2 Normal, RS: Clear
        </div>
      </div>

      {/* Symptoms */}
      <div className="border border-gray-100 rounded-xl p-5 bg-white shadow-sm flex flex-col hover:border-gray-200 transition-colors cursor-pointer relative overflow-hidden group">
        <div className="absolute right-4 top-[50%] -translate-y-1/2 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
              <Activity size={16} />
            </div>
            <h3 className="text-[15px] font-semibold text-gray-900 m-0">Symptoms</h3>
          </div>
          <div className="flex items-center gap-3 pr-8">
             <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 uppercase">
              PERSISTENT SYMPTOM
            </span>
            <span className="text-sm text-gray-500">Fatigue</span>
          </div>
        </div>
        <div className="text-sm text-gray-500 leading-relaxed pr-8 pl-11">
          Weakness, Polyuria, Polydipsia
        </div>
      </div>

      {/* Advice */}
      <div className="border border-gray-100 rounded-xl p-5 bg-white shadow-sm flex flex-col hover:border-gray-200 transition-colors cursor-pointer relative overflow-hidden group">
        <div className="absolute right-4 top-[50%] -translate-y-1/2 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <CardHeader 
          icon={User} 
          title="Advice" 
        />
        <div className="text-sm text-gray-500 leading-relaxed pr-8 pl-11">
          Low carb diet, Walk 30 mins daily
        </div>
      </div>

      {/* Follow-up Plan */}
      <div className="border border-gray-100 rounded-xl p-5 bg-white shadow-sm flex flex-col hover:border-gray-200 transition-colors cursor-pointer relative overflow-hidden group">
        <div className="absolute right-4 top-[50%] -translate-y-1/2 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
              <Calendar size={16} />
            </div>
            <h3 className="text-[15px] font-semibold text-gray-900 m-0">Follow-up Plan</h3>
          </div>
          <div className="flex items-center pr-8">
            <span className="text-sm text-gray-500">Target: Improve HbA1c &lt; 7%</span>
          </div>
        </div>
        <div className="text-sm text-gray-500 leading-relaxed pr-8 pl-11">
          Review after 3 months
        </div>
      </div>

    </div>
  );
};

export default ClinicalSummaryTab;
