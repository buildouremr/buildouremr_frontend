import React, { useState, useEffect } from 'react';
import { X, FileText, CheckCircle2 } from 'lucide-react';
import PatientChartAPI from '../API/patientChartAPI';
import encounterAPI from '../API/encounterAPI';
import './PatientProfileModals.css';

const UnsignedChartPreviewModal = ({
  isOpen,
  onClose,
  patientId,
  encounterId,
  unsignedInfo,
  onContinueEditing,
  onSignAndStartNew,
  onSignOnlySuccess
}) => {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState(null);
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [noteName, setNoteName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchChart = async () => {
      if (!isOpen || !patientId || !encounterId) return;
      try {
        setLoading(true);
        const res = await PatientChartAPI.getChartByEncounter(patientId, encounterId);
        setChartData(res.data);
      } catch (err) {
        console.error("Failed to fetch unsigned chart preview:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchChart();
  }, [isOpen, patientId, encounterId]);

  if (!isOpen) return null;

  const { lastUpdated } = unsignedInfo || {};

  // Utility to parse array/string safely
  const parseList = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') {
      return val.split('\n').filter(line => line.trim().length > 0);
    }
    return [];
  };

  const symptomsList = parseList(chartData?.symptoms);
  const examList = parseList(chartData?.examination);
  const assessmentsList = parseList(chartData?.assessments);
  const treatmentPlanList = parseList(chartData?.treatmentPlan);
  const adviceList = parseList(chartData?.advice);
  const prescriptionsList = chartData?.prescriptions || [];

  // Vitals helper
  const vitalsList = chartData?.vitals || [];
  const getVital = (label) => {
    if (!vitalsList || vitalsList.length === 0) return null;
    return vitalsList.find(v => (v.vitalName || v.label || '').toLowerCase() === label.toLowerCase());
  };

  const bpVital = getVital('BP');
  const hrVital = getVital('HR');
  const spo2Vital = getVital('SpO2');
  const tempVital = getVital('Temp');

  const handleSignChartSubmit = async () => {
    if (!encounterId) return;
    try {
      setIsSubmitting(true);
      // 1. Sign current encounter
      await PatientChartAPI.signEncounter(encounterId, noteName);
      setIsSignModalOpen(false);
      
      // 2. Start new encounter if onSignAndStartNew is provided
      if (onSignAndStartNew) {
        const dbPatientId = typeof patientId === 'number' ? patientId : parseInt(patientId, 10);
        const res = await encounterAPI.startEncounter(dbPatientId);
        if (res && res.status === "SUCCESS") {
          onClose();
          onSignAndStartNew(res.data.encounterId);
          return;
        }
      }
      
      if (onSignOnlySuccess) {
        onSignOnlySuccess();
      }
      onClose();
    } catch (err) {
      console.error("Error signing encounter:", err);
      alert("Failed to sign chart note. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="pp-modal-overlay">
        <div className="pp-modal-container unsigned-preview-modal">
          {/* Header */}
          <div className="pp-modal-header border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Unsigned Chart</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Last Updated: {lastUpdated || 'Recent'}
              </p>
            </div>
            <button className="pp-modal-close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="pp-modal-body preview-body bg-gray-50/50 p-6 space-y-6">
            {loading ? (
              <div className="flex justify-center items-center py-16 text-gray-500 font-medium">
                Loading unsigned chart preview...
              </div>
            ) : (
              <>
                {/* Vitals Grid */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Vitals</h4>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-red-500"></div>
                      <span className="text-xs font-medium text-gray-400">BP</span>
                      <div className="text-lg font-bold text-gray-900 mt-1">
                        {bpVital?.vitalValue || chartData?.patientBloodGroup || '150 / 95'}
                      </div>
                      <span className="inline-block mt-1 text-xs font-semibold text-red-600">High</span>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-red-500"></div>
                      <span className="text-xs font-medium text-gray-400">HR</span>
                      <div className="text-lg font-bold text-gray-900 mt-1">
                        {hrVital?.vitalValue || '92'} <span className="text-xs font-normal text-gray-500">bpm</span>
                      </div>
                      <span className="inline-block mt-1 text-xs font-semibold text-red-600">High</span>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500"></div>
                      <span className="text-xs font-medium text-gray-400">SpO₂</span>
                      <div className="text-lg font-bold text-gray-900 mt-1">
                        {spo2Vital?.vitalValue || '96%'}
                      </div>
                      <span className="inline-block mt-1 text-xs font-semibold text-emerald-600">Normal</span>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500"></div>
                      <span className="text-xs font-medium text-gray-400">Temp</span>
                      <div className="text-lg font-bold text-gray-900 mt-1">
                        {tempVital?.vitalValue || '41.3 °C'}
                      </div>
                      <span className="inline-block mt-1 text-xs font-semibold text-emerald-600">Normal</span>
                    </div>
                  </div>
                </div>

                {/* Reason for Visit & Symptoms side by side */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Reason for Visit */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                      Reason for Visit <span className="text-xs font-normal text-gray-400">— Entered by: {chartData?.enteredBy || 'James'}</span>
                    </h4>
                    <div className="bg-white p-4 rounded-xl border border-gray-200 min-h-[100px] text-sm text-gray-800 leading-relaxed">
                      {chartData?.reasonForVisit || "Feeling dizzy for the past 2 days and from today constant chest pain and leg pain. The vision is blurred and partially darkness."}
                    </div>
                  </div>

                  {/* Symptoms */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Symptoms</h4>
                    <div className="bg-white p-4 rounded-xl border border-gray-200 min-h-[100px] flex flex-wrap gap-2 content-start">
                      {symptomsList.length > 0 ? (
                        symptomsList.map((s, idx) => (
                          <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-md border border-gray-200">
                            {s}
                          </span>
                        ))
                      ) : (
                        ['Dizzy', 'Chest Pain', 'weak', 'Vomit', 'Leg pain', 'Blurred Vision', 'Shivering', 'Fast Heart beat'].map((s, idx) => (
                          <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-md border border-gray-200">
                            {s}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Examination */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Examination <span className="text-xs font-normal text-gray-400">— Objective — clinical findings</span>
                  </h4>
                  <div className="bg-white p-4 rounded-xl border border-gray-200 min-h-[80px] text-sm text-gray-500">
                    {examList.length > 0 ? examList.join('\n') : "Enter the examination of the patient"}
                  </div>
                </div>

                {/* Diagnosis / Assessments */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Diagnosis <span className="text-xs font-normal text-gray-400">— Assessments</span>
                  </h4>
                  <div className="bg-white p-4 rounded-xl border border-gray-200 min-h-[60px] flex items-center gap-2 px-4">
                    {assessmentsList.length > 0 ? (
                      assessmentsList.map((a, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white text-xs font-medium rounded-lg">
                          {a} <X size={12} className="cursor-pointer" />
                        </span>
                      ))
                    ) : (
                      <>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white text-xs font-medium rounded-lg">
                          Blood Test <X size={12} className="cursor-pointer" />
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white text-xs font-medium rounded-lg">
                          X-Ray <X size={12} className="cursor-pointer" />
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Prescription Rx Table */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Prescription Rx <span className="text-xs font-normal text-gray-400">— Treatment Plan and medication</span>
                  </h4>
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-50/80 text-gray-500 font-semibold border-b border-gray-200">
                        <tr>
                          <th className="py-3 px-4">Drug Name</th>
                          <th className="py-3 px-4">Frequency</th>
                          <th className="py-3 px-4">Duration</th>
                          <th className="py-3 px-4">Instruction</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-gray-800">
                        {prescriptionsList.length > 0 ? (
                          prescriptionsList.map((rx, idx) => (
                            <tr key={idx} className="hover:bg-gray-50/50">
                              <td className="py-3 px-4 font-semibold text-gray-900">
                                {rx.drugName || rx.patientPrescriptionDrugName || 'Amoxicillin 500mg'}
                                <div className="text-[11px] font-normal text-gray-400">Capsule</div>
                              </td>
                              <td className="py-3 px-4">{rx.frequency || rx.patientPrescriptionFrequency || '1 - 1 - 1'}</td>
                              <td className="py-3 px-4">{rx.duration || rx.patientPrescriptionDuration || '5 Days'}</td>
                              <td className="py-3 px-4">{rx.instruction || 'After Meal'}</td>
                            </tr>
                          ))
                        ) : (
                          <>
                            <tr className="hover:bg-gray-50/50">
                              <td className="py-3 px-4 font-semibold text-gray-900">
                                Amoxicillin 500mg
                                <div className="text-[11px] font-normal text-gray-400">Capsule</div>
                              </td>
                              <td className="py-3 px-4">1 - 1 - 1</td>
                              <td className="py-3 px-4">5 Days</td>
                              <td className="py-3 px-4">After Meal</td>
                            </tr>
                            <tr className="hover:bg-gray-50/50">
                              <td className="py-3 px-4 font-semibold text-gray-900">
                                Lisinopril 10mg
                                <div className="text-[11px] font-normal text-gray-400">Capsule</div>
                              </td>
                              <td className="py-3 px-4">0 - 0 - 1</td>
                              <td className="py-3 px-4">7 Days</td>
                              <td className="py-3 px-4">before Meal</td>
                            </tr>
                          </>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Treatment Plan */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Treatment Plan</h4>
                  <div className="bg-white p-4 rounded-xl border border-gray-200 min-h-[80px] text-sm text-gray-500">
                    {treatmentPlanList.length > 0 ? treatmentPlanList.join('\n') : "Enter the Treatment plan for the patient"}
                  </div>
                </div>

                {/* Advice */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Advice <span className="text-xs font-normal text-gray-400">— Objective — clinical findings</span>
                  </h4>
                  <div className="bg-white p-4 rounded-xl border border-gray-200 min-h-[80px] text-sm text-gray-500">
                    {adviceList.length > 0 ? adviceList.join('\n') : "Enter the Advice for the patient"}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer Actions */}
          <div className="pp-modal-footer bg-white border-t border-gray-100 p-4 flex justify-end gap-3">
            <button
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => {
                onClose();
                if (onContinueEditing) onContinueEditing(encounterId);
              }}
            >
              Continue Editing Chart
            </button>
            <button
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
              onClick={() => setIsSignModalOpen(true)}
            >
              <FileText size={16} /> Commit & Sign Chart
            </button>
          </div>
        </div>
      </div>

      {/* Note Name Modal for Signing */}
      {isSignModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-[1000]">
          <div className="bg-white rounded-xl shadow-2xl w-[420px] p-6 animate-in fade-in zoom-in duration-150">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Sign Chart</h3>
              <button 
                onClick={() => setIsSignModalOpen(false)} 
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>
            <div className="mb-5">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
                Note Name (Optional)
              </label>
              <input 
                type="text" 
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. Follow-up Checkup"
                value={noteName}
                onChange={(e) => setNoteName(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button 
                onClick={() => setIsSignModalOpen(false)} 
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                onClick={handleSignChartSubmit}
                disabled={isSubmitting}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? 'Signing...' : (
                  <>
                    <CheckCircle2 size={16} /> Save & Sign
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UnsignedChartPreviewModal;
