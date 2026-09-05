import React, { useState, useEffect, useRef } from 'react';
import { Mic, Edit2, Plus, Trash2, Calendar, FileSignature, Loader2, X } from 'lucide-react';
import PatientChartAPI from '../API/patientChartAPI';
import AddSymptomsModal from './AddSymptomsModal';

const ChartMainBody = ({ patientId, appointmentId, encounterId, initialData, onBack }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    reasonForVisit: '',
    symptoms: [],
    examination: '',
    assessments: [],
    treatmentPlan: [],
    advice: ''
  });

  const [isTreatmentModalOpen, setIsTreatmentModalOpen] = useState(false);
  const [isAdviceModalOpen, setIsAdviceModalOpen] = useState(false);
  const [recentAssessments, setRecentAssessments] = useState([]);
  const [assessmentSearchQuery, setAssessmentSearchQuery] = useState('');
  const [assessmentSearchResults, setAssessmentSearchResults] = useState([]);
  const [showAssessmentDropdown, setShowAssessmentDropdown] = useState(false);

  const [isSymptomsModalOpen, setIsSymptomsModalOpen] = useState(false);
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [noteName, setNoteName] = useState("");
  const [prescriptions, setPrescriptions] = useState([]);

  const [vitalsList, setVitalsList] = useState([]);
  const [editingVital, setEditingVital] = useState(null);
  const [isAddingVital, setIsAddingVital] = useState(false);
  const [newVitalHeader, setNewVitalHeader] = useState('');
  const [newVitalData, setNewVitalData] = useState('');

  const [isFollowupOn, setIsFollowupOn] = useState(true);

  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const [availableMedications, setAvailableMedications] = useState([]);
  const [focusedRowIndex, setFocusedRowIndex] = useState(null);

  useEffect(() => {
    // Initial fetch of all medications removed.
    // We now fetch via search API in the input onChange handler.
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        reasonForVisit: initialData.reasonForVisit || '',
        symptoms: initialData.symptoms || [],
        examination: initialData.examination ? initialData.examination.join('\n') : '',
        assessments: initialData.assessments || [],
        treatmentPlan: initialData.treatmentPlan || [],
        advice: initialData.advice || ''
      });
      if (initialData.prescriptions && initialData.prescriptions.length > 0) {
        setPrescriptions([
          ...initialData.prescriptions.map(p => ({
            patientPrescriptionId: p.patientPrescriptionId,
            drugName: p.drugName,
            medicationId: p.medicationId,
            type: 'Medicine',
            freq: p.frequency || '0-0-0',
            dur: p.duration,
            inst: p.instruction
          })),
          { patientPrescriptionId: null, drugName: '', medicationId: null, type: 'Medicine', freq: '0-0-0', dur: '', inst: '' }
        ]);
      } else {
        setPrescriptions([{ patientPrescriptionId: null, drugName: '', medicationId: null, type: 'Medicine', freq: '0-0-0', dur: '', inst: '' }]);
      }

      if (initialData.vitals && initialData.vitals.length > 0 && initialData.vitals[0].patientVitalData) {
        const pvd = initialData.vitals[0].patientVitalData;
        const allowedKeys = ['BP', 'HR', 'SpO2', 'Temp'];
        setVitalsList(allowedKeys.map((key, i) => {
          let val = '';
          if (pvd[key]) {
            val = pvd[key].value !== undefined ? pvd[key].value : pvd[key];
          }
          return {
            id: 'v' + i,
            header: key,
            data: val,
            isNew: false
          };
        }));
      } else {
        setVitalsList([
          { id: 'v1', header: 'BP', data: '', isNew: false },
          { id: 'v2', header: 'HR', data: '', isNew: false },
          { id: 'v3', header: 'SpO2', data: '', isNew: false },
          { id: 'v4', header: 'Temp', data: '', isNew: false }
        ]);
      }
    } else {
      setPrescriptions([{ patientPrescriptionId: null, drugName: '', medicationId: null, type: 'Medicine', freq: '0-0-0', dur: '', inst: '', route: '' }]);
      setVitalsList([
        { id: 'v1', header: 'BP', data: '', isNew: false },
        { id: 'v2', header: 'HR', data: '', isNew: false },
        { id: 'v3', header: 'SpO2', data: '', isNew: false },
        { id: 'v4', header: 'Temp', data: '', isNew: false }
      ]);
    }

    // Fetch recent assessments
    const fetchRecent = async () => {
      try {
        const recentRes = await PatientChartAPI.getRecentAssessments();
        if (recentRes.data && recentRes.data.status === 'SUCCESS') {
          setRecentAssessments(recentRes.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch recent assessments:", err);
      }
    };
    fetchRecent();
  }, [initialData]);

  const handlePrescriptionChange = (index, field, value) => {
    let newP = [...prescriptions];
    newP[index][field] = value;

    if (field === 'drugName') {
      if (index === newP.length - 2 && value.trim() === '') {
        if (newP[newP.length - 1].drugName.trim() === '') {
          newP.pop();
        }
      } else if (index === newP.length - 1 && value.trim() !== '') {
        newP.push({ patientPrescriptionId: null, drugName: '', medicationId: null, type: 'Medicine', freq: '0-0-0', dur: '', inst: '', route: '' });
      }
    }
    setPrescriptions(newP);
  };

  const removePrescription = (index) => {
    let newP = prescriptions.filter((_, i) => i !== index);
    if (newP.length === 0 || newP[newP.length - 1].drugName.trim() !== '') {
      newP.push({ patientPrescriptionId: null, drugName: '', medicationId: null, type: 'Medicine', freq: '0-0-0', dur: '', inst: '', route: '' });
    }
    setPrescriptions(newP);
    handleUnifiedSave(formData, vitalsList, newP);
  };

  const handleFreqChange = (e, index) => {
    let val = e.target.value.replace(/[^0-9]/g, '');
    if (val.length > 3) val = val.slice(0, 3);
    let formatted = val.split('').join('-');

    let newP = [...prescriptions];
    newP[index].freq = formatted;
    setPrescriptions(newP);
  };

  const handleAssessmentSearchChange = async (e) => {
    const val = e.target.value;
    setAssessmentSearchQuery(val);
    if (val.length >= 3) {
      try {
        const res = await PatientChartAPI.searchAssessments(val);
        if (res.data && res.data.status === 'SUCCESS') {
          setAssessmentSearchResults(res.data.data);
          setShowAssessmentDropdown(true);
        }
      } catch (err) {
        console.error("Failed to search assessments:", err);
      }
    } else {
      setShowAssessmentDropdown(false);
    }
  };

  const addAssessment = (assessmentName) => {
    if (!formData.assessments.includes(assessmentName)) {
      const newAssessments = [...formData.assessments, assessmentName];
      const updatedFormData = { ...formData, assessments: newAssessments };
      setFormData(updatedFormData);
      handleUnifiedSave(updatedFormData, vitalsList, prescriptions);
    }
    setAssessmentSearchQuery('');
    setShowAssessmentDropdown(false);
  };

  const removeAssessment = (index) => {
    const newAssessments = formData.assessments.filter((_, i) => i !== index);
    const updatedFormData = { ...formData, assessments: newAssessments };
    setFormData(updatedFormData);
    handleUnifiedSave(updatedFormData, vitalsList, prescriptions);
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.assessment-container')) {
        setShowAssessmentDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDurBlur = (e, index) => {
    let val = e.target.value.trim();
    if (/^\d+$/.test(val)) {
      handlePrescriptionChange(index, 'dur', val + ' days');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUnifiedSave = async (updatedFormData = formData, updatedVitals = vitalsList, updatedPrescriptions = prescriptions) => {
    if (!encounterId && !appointmentId) return;
    try {
      setIsSaving(true);

      const pvd = {};
      updatedVitals.forEach(v => {
        if (v.header) pvd[v.header] = v.data;
      });

      const payload = {
        patientVisitChartId: initialData?.patientVisitChartId,
        patientId,
        appointmentId,
        encounterId,
        reasonForVisit: updatedFormData.reasonForVisit,
        symptoms: updatedFormData.symptoms,
        examination: updatedFormData.examination.split('\n').filter(line => line.trim() !== ''),
        assessments: updatedFormData.assessments,
        treatmentPlan: updatedFormData.treatmentPlan,
        advice: updatedFormData.advice,
        vitals: [{ patientVitalData: pvd }],
        prescriptions: updatedPrescriptions.map(p => ({
          patientPrescriptionId: p.patientPrescriptionId,
          drugName: p.drugName,
          medicationId: p.medicationId,
          frequency: p.freq,
          duration: p.dur,
          instruction: p.inst,
          route: p.route
        }))
      };

      const res = await PatientChartAPI.saveChart(payload);

      if (res.data && res.data.status === 'SUCCESS' && res.data.data?.prescriptions) {
        const savedPrescriptions = res.data.data.prescriptions;
        setPrescriptions(prev => {
          return prev.map(p => {
            if (!p.patientPrescriptionId && p.drugName) {
              const matched = savedPrescriptions.find(sp => sp.drugName === p.drugName && sp.medicationId === p.medicationId);
              if (matched) {
                return { ...p, patientPrescriptionId: matched.patientPrescriptionId };
              }
            }
            return p;
          });
        });
      }
    } catch (error) {
      console.error("Failed to auto-save chart:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBlur = () => {
    handleUnifiedSave();
  };

  const handleVitalBlur = (id) => {
    setEditingVital(null);
    let updatedList;
    setVitalsList(prev => {
      updatedList = prev.map(v => v.id === id ? { ...v, isNew: false } : v);
      return updatedList;
    });
    setTimeout(() => handleUnifiedSave(formData, updatedList, prescriptions), 0);
  };

  const handleNewVitalBlur = () => {
    if (newVitalHeader.trim() !== '') {
      const newId = 'new_' + Date.now();
      const newList = [...vitalsList, { id: newId, header: newVitalHeader, data: newVitalData, isNew: false }];
      setVitalsList(newList);
      handleUnifiedSave(formData, newList, prescriptions);
    }
    setIsAddingVital(false);
    setNewVitalHeader('');
    setNewVitalData('');
  };

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setIsProcessing(true);
        try {
          const response = await PatientChartAPI.processAmbientScribe(audioBlob);
          if (response.data) {
            const aiData = response.data;
            setFormData(prev => ({
              ...prev,
              reasonForVisit: aiData.reasonForVisit || prev.reasonForVisit,
              symptoms: aiData.symptoms ? (Array.isArray(aiData.symptoms) ? aiData.symptoms : [aiData.symptoms]) : prev.symptoms,
              examination: aiData.examination || prev.examination,
              treatmentPlan: aiData.treatmentPlan || prev.treatmentPlan,
              diagnosis: aiData.diagnosis || prev.diagnosis
            }));

            if (aiData.prescriptions && aiData.prescriptions.length > 0) {
              setPrescriptions(aiData.prescriptions.map(p => ({
                drugName: p.drugName,
                type: 'Medicine',
                freq: p.frequency,
                dur: p.duration,
                inst: p.instruction,
                route: p.route
              })));
            }
          }
        } catch (error) {
          console.error("Error processing scribe audio:", error);
          alert("Failed to process audio. Please try again.");
        } finally {
          setIsProcessing(false);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Please allow microphone access to use Ambient Scribe.");
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      // Stop all tracks to release microphone
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const v = initialData?.vitals || {};

  return (
    <div className="flex-1 flex flex-col bg-white overflow-y-auto min-h-0">
      <div className="p-8 flex items-center justify-between">
        <span className="text-2xl font-semibold text-gray-900">Today’s Visit</span>
      </div>

      <div className="mx-8 bg-blue-50 border border-blue-200 rounded-xl px-5 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-blue-500 shadow-sm">
            <Mic size={24} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-lg font-semibold text-gray-900">Ambient Scribe {isRecording ? 'Recording...' : (isProcessing ? 'Processing...' : 'Ready')}</span>
            <span className="text-base text-gray-500">{isRecording ? 'Listening to conversation...' : (isProcessing ? 'AI is structuring notes...' : 'Tap to begin — ')} <span className="text-blue-500">Notes auto-populate</span></span>
          </div>
        </div>
        {isProcessing ? (
          <button disabled className="bg-gray-400 text-white border-none py-2.5 px-5 rounded-lg font-semibold text-sm flex items-center gap-2 cursor-not-allowed">
            <Loader2 size={16} className="animate-spin" /> Processing
          </button>
        ) : isRecording ? (
          <button onClick={handleStopRecording} className="bg-red-600 text-white border-none py-2.5 px-5 rounded-lg font-semibold text-sm cursor-pointer hover:bg-red-700 transition-colors">
            Stop Recording
          </button>
        ) : (
          <button onClick={handleStartRecording} className="bg-blue-600 text-white border-none py-2.5 px-5 rounded-lg font-semibold text-sm cursor-pointer hover:bg-blue-700 transition-colors">
            Start Recording
          </button>
        )}
      </div>

      <div className="text-xl font-semibold text-gray-900 pt-8 px-8 pb-4 flex justify-between items-center shrink-0">Vitals</div>
      <div className="px-8 pb-8 border-b border-gray-100 shrink-0">
        <div className="flex overflow-x-auto gap-4 py-2 items-stretch" style={{ scrollbarWidth: 'thin', minHeight: '130px' }}>
        {vitalsList.map(v => (
          <div key={v.id} className="border border-gray-200 rounded-xl p-4 flex flex-col justify-between relative bg-gray-50 shrink-0 w-[180px] min-h-[110px]">
            <div className="flex justify-between items-center text-base text-gray-500 font-semibold mb-3">
              {v.isNew && editingVital === v.id ? (
                <input
                  type="text"
                  value={v.header}
                  onChange={(e) => setVitalsList(prev => prev.map(item => item.id === v.id ? { ...item, header: e.target.value } : item))}
                  className="bg-white border border-gray-300 rounded px-2 py-1 text-base w-full font-semibold outline-none focus:border-blue-500"
                  placeholder="Vital Name"
                />
              ) : (
                <>
                  {v.header}
                  <Edit2 size={16} className="text-gray-400 cursor-pointer hover:text-gray-600" onClick={() => setEditingVital(v.id)} />
                </>
              )}
            </div>
            <div className="flex items-baseline gap-1 h-8">
              {editingVital === v.id ? (
                <input
                  autoFocus
                  type="text"
                  value={v.data && v.data.startsWith('--') ? '' : v.data}
                  onChange={(e) => setVitalsList(prev => prev.map(item => item.id === v.id ? { ...item, data: e.target.value } : item))}
                  onBlur={() => handleVitalBlur(v.id)}
                  onKeyDown={(e) => e.key === 'Enter' && handleVitalBlur(v.id)}
                  className="bg-white border border-gray-300 rounded px-2 py-1 text-base w-full font-bold outline-none focus:border-blue-500"
                  placeholder={v.header === 'BP' ? '-- / --' : v.header === 'HR' ? '-- bpm' : v.header === 'SpO2' ? '--%' : v.header === 'Temp' ? '-- °C' : 'Value'}
                />
              ) : (
                <span className="text-xl font-bold text-gray-900">
                  {v.data && !v.data.startsWith('--') ? v.data : (v.header === 'BP' ? '-- / --' : v.header === 'HR' ? '-- bpm' : v.header === 'SpO2' ? '--%' : v.header === 'Temp' ? '-- °C' : '-')}
                </span>
              )}
            </div>
          </div>
        ))}

        {isAddingVital ? (
          <div
            className="border border-blue-500 rounded-xl p-4 flex flex-col relative bg-blue-50 shadow-sm min-h-[100px] shrink-0 w-[170px]"
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) {
                handleNewVitalBlur();
              }
            }}
          >
            <input
              autoFocus
              type="text"
              value={newVitalHeader}
              onChange={(e) => setNewVitalHeader(e.target.value)}
              className="bg-white border border-blue-300 rounded px-2 py-1 text-sm w-full font-semibold outline-none focus:border-blue-600 mb-3"
              placeholder="Vital Name"
            />
            <input
              type="text"
              value={newVitalData}
              onChange={(e) => setNewVitalData(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleNewVitalBlur()}
              className="bg-white border border-blue-300 rounded px-2 py-1 text-sm w-full font-bold outline-none focus:border-blue-600"
              placeholder="Value"
            />
          </div>
        ) : (
          <div
            onClick={() => setIsAddingVital(true)}
            className="border border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-blue-500 font-semibold text-sm cursor-pointer gap-2 bg-slate-50 hover:bg-slate-100 transition-colors h-full min-h-[100px] shrink-0 w-[170px]">
            <Plus size={20} /> Add
          </div>
        )}
        </div>
      </div>

      <div className="flex p-8 gap-6 border-b border-gray-100">
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-semibold text-gray-900">Reason for Visit</span>
            <span className="text-base text-gray-400">— Entered by: {initialData?.enteredBy || 'Unknown'}</span>
          </div>
          <textarea
            className="w-full border border-gray-200 rounded-xl p-4 text-base font-inherit resize-y min-h-[110px] outline-none box-border focus:border-blue-500 transition-colors bg-white shadow-sm"
            name="reasonForVisit"
            value={formData.reasonForVisit}
            onChange={handleChange}
            onBlur={() => handleUnifiedSave(formData, vitalsList, prescriptions)}
            placeholder="Patient reported symptoms or reason for today's encounter..."
          />
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between w-full mb-3">
            <span className="text-lg font-semibold text-gray-900">Symptoms</span>
            <span className="text-base text-blue-500 cursor-pointer hover:text-blue-600 font-medium" onClick={() => setIsSymptomsModalOpen(true)}>+ Add / Edit</span>
          </div>
          {(!formData.symptoms || formData.symptoms.length === 0) ? (
            <div
              className="w-full border border-gray-200 rounded-xl p-4 text-base font-inherit min-h-[110px] bg-white shadow-sm flex items-start text-gray-400 cursor-pointer"
              onClick={() => setIsSymptomsModalOpen(true)}
            >
              No symptoms selected
            </div>
          ) : (
            <div className="w-full border border-gray-200 rounded-xl p-4 min-h-[110px] bg-white shadow-sm flex flex-wrap gap-3 items-start content-start">
              {(Array.isArray(formData.symptoms) ? formData.symptoms : []).map((sym, idx) => (
                <div key={idx} className="relative group flex items-center bg-blue-50 border border-blue-100 text-gray-800 px-4 py-2 rounded-full text-base font-medium shadow-sm">
                  {sym}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const newSymptoms = formData.symptoms.filter((_, i) => i !== idx);
                      const updatedFormData = { ...formData, symptoms: newSymptoms };
                      setFormData(updatedFormData);
                      handleUnifiedSave(updatedFormData, vitalsList, prescriptions);
                    }}
                    className="absolute -top-1.5 -right-1.5 bg-white border border-gray-200 text-gray-500 rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer shadow hover:text-red-500 hover:border-red-200 transition-all"
                    title="Remove"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="p-8 border-b border-gray-100 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-semibold text-gray-900">Examination</span>
          <span className="text-base text-gray-400">— Objective — clinical findings</span>
        </div>
        <textarea
          className="w-full border border-gray-200 rounded-xl p-4 text-base font-inherit resize-y min-h-[110px] outline-none box-border focus:border-blue-500 transition-colors bg-white shadow-sm"
          name="examination"
          value={formData.examination}
          onChange={handleChange}
          onBlur={() => handleUnifiedSave(formData, vitalsList, prescriptions)}
          placeholder="Enter the examination of the patient"
        />
      </div>

      <div className="p-8 border-b border-gray-100 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base font-semibold text-gray-900">Diagnosis</span>
          <span className="text-sm text-gray-400">— Assessments</span>
        </div>
        <div className="flex flex-col gap-3 assessment-container">
          {recentAssessments.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="text-xs text-gray-500 font-medium py-1">Recently Used:</span>
              {recentAssessments.map((ra) => (
                <button
                  key={ra.id}
                  onClick={() => addAssessment(ra.name)}
                  className="px-2 py-1 bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-600 text-xs rounded-full border border-gray-200 transition-colors cursor-pointer whitespace-nowrap"
                >
                  {ra.name}
                </button>
              ))}
            </div>
          )}

          <div className="relative">
            <input
              type="text"
              className="w-full border border-gray-200 rounded-xl p-3 text-sm font-inherit outline-none box-border focus:border-blue-500 transition-colors bg-white shadow-sm"
              value={assessmentSearchQuery}
              onChange={handleAssessmentSearchChange}
              placeholder="Search for assessments or tests..."
              onFocus={() => {
                if (assessmentSearchQuery.length >= 3) setShowAssessmentDropdown(true);
              }}
            />

            {showAssessmentDropdown && assessmentSearchResults.length > 0 && (
              <div className="absolute z-50 w-full left-0 top-full bg-white border border-gray-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] max-h-56 overflow-y-auto mt-2 p-2">
                {assessmentSearchResults.map((result) => (
                  <div
                    key={result.id}
                    className="p-3 text-sm text-gray-700 cursor-pointer rounded-lg hover:bg-blue-50 hover:text-gray-900 transition-colors mb-1 last:mb-0"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      addAssessment(result.name);
                    }}
                  >
                    {result.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {formData.assessments.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.assessments.map((assessment, idx) => (
                <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full border border-blue-100 text-sm shadow-sm group">
                  <span>{assessment}</span>
                  <button
                    onClick={() => removeAssessment(idx)}
                    className="text-blue-400 hover:text-red-500 hover:bg-white rounded-full p-0.5 transition-colors focus:outline-none"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="p-6 border-b border-gray-100 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base font-semibold text-gray-900">Prescription</span>
          <span className="text-sm text-gray-400">— Treatment Plan and medication</span>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-visible">
          <table className="w-full border-collapse">
            <thead className="bg-[#f8fafc]">
              <tr>
                <th className="text-left p-4 text-xs text-gray-500 font-semibold rounded-tl-xl w-[25%]">Drug Name</th>
                <th className="text-left p-4 text-xs text-gray-500 font-semibold w-[15%]">Frequency</th>
                <th className="text-left p-4 text-xs text-gray-500 font-semibold w-[15%]">Route</th>
                <th className="text-left p-4 text-xs text-gray-500 font-semibold w-[15%]">Duration</th>
                <th className="text-left p-4 text-xs text-gray-500 font-semibold w-[25%]">Instruction</th>
                <th className="p-4 text-xs text-gray-500 font-semibold rounded-tr-xl w-[5%]"></th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.map((med, i) => (
                <tr key={i} className="border-b border-gray-100 last:border-b-0 group relative">
                  <td className="p-4 align-top">
                    <input
                      type="text"
                      className="bg-transparent border-none outline-none w-full text-sm font-semibold text-gray-900 placeholder-gray-400"
                      value={med.drugName || ""}
                      placeholder="Type medication name..."
                      onChange={(e) => {
                        const val = e.target.value;
                        handlePrescriptionChange(i, 'drugName', val);
                        handlePrescriptionChange(i, 'medicationId', null);
                        if (val.length >= 3) {
                          PatientChartAPI.searchMedications(val).then(res => setAvailableMedications(res.data?.data || [])).catch(err => console.error("Search failed:", err));
                        } else {
                          setAvailableMedications([]);
                        }
                      }}
                      onFocus={() => {
                        setFocusedRowIndex(i);
                        if (med.drugName && med.drugName.length >= 3) {
                          PatientChartAPI.searchMedications(med.drugName).then(res => setAvailableMedications(res.data?.data || [])).catch(err => console.error(err));
                        }
                      }}
                      onBlur={() => setTimeout(() => setFocusedRowIndex(null), 200)}
                    />
                    {med.drugName && <span className="block text-xs text-gray-400 mt-0.5">{med.type || 'Medicine'}</span>}
                    {focusedRowIndex === i && med.drugName?.length >= 3 && !med.medicationId && (
                      <div className="absolute z-50 w-full left-0 top-full bg-white border border-gray-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] max-h-56 overflow-y-auto mt-2 p-2">
                        {availableMedications.filter(m => m.name.toLowerCase().includes(med.drugName.toLowerCase())).map(m => (
                          <div
                            key={m.id}
                            className="p-3 text-sm text-gray-700 cursor-pointer rounded-lg hover:bg-blue-50 hover:text-gray-900 transition-colors mb-1 last:mb-0"
                            onMouseDown={() => {
                              handlePrescriptionChange(i, 'medicationId', m.id);
                              handlePrescriptionChange(i, 'drugName', m.name + (m.strength ? ` ${m.strength}` : ''));
                              handlePrescriptionChange(i, 'type', m.form || 'Medicine');
                              handlePrescriptionChange(i, 'route', m.route || '');
                              setFocusedRowIndex(null);
                            }}
                          >
                            {m.name} {m.strength}
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-sm align-middle">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        className="bg-transparent border-none outline-none w-full text-sm font-medium text-gray-900 placeholder-gray-400"
                        value={med.freq || ""}
                        placeholder="e.g. 1-0-1"
                        onChange={(e) => handleFreqChange(e, i)}
                        onBlur={() => handleUnifiedSave(formData, vitalsList, prescriptions)}
                      />
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-2 flex-shrink-0">
                        <path d="M1 1L5 5L9 1" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </td>
                  <td className="p-4 text-sm align-middle">
                    <input
                      type="text"
                      className="bg-transparent border-none outline-none w-full text-sm font-medium text-gray-900 placeholder-gray-400"
                      placeholder="Route"
                      value={med.route || ""}
                      onChange={(e) => handlePrescriptionChange(i, 'route', e.target.value)}
                    />
                  </td>
                  <td className="p-4 text-sm align-middle">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        className="bg-transparent border-none outline-none w-full text-sm font-medium text-gray-900 placeholder-gray-400"
                        value={med.dur || ""}
                        placeholder="e.g. 5 days"
                        onChange={(e) => handlePrescriptionChange(i, 'dur', e.target.value)}
                        onBlur={() => handleUnifiedSave(formData, vitalsList, prescriptions)}
                      />
                      <div className="flex flex-col ml-2 gap-[2px] flex-shrink-0">
                        <svg width="8" height="5" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9 5L5 1L1 5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <svg width="8" height="5" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 1L5 5L9 1" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm align-middle">
                    <input
                      type="text"
                      className="bg-transparent border-none outline-none w-full text-sm font-medium text-gray-900 placeholder-gray-400"
                      value={med.inst || ""}
                      placeholder="e.g. After food"
                      onChange={(e) => handlePrescriptionChange(i, 'inst', e.target.value)}
                      onBlur={() => handleUnifiedSave(formData, vitalsList, prescriptions)}
                    />
                  </td>
                  <td className="p-4 text-center align-middle">
                    <button
                      className="text-gray-400 hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer p-1"
                      onClick={() => removePrescription(i)}
                      title="Delete row"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-6 border-b border-gray-100 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base font-semibold text-gray-900">Treatment Plan</span>
          <Mic size={16} className="text-gray-400 ml-1" />
        </div>
        <textarea
          className="w-full border border-gray-200 rounded-xl p-4 text-sm font-inherit resize-y min-h-[100px] outline-none box-border focus:border-blue-500 transition-colors bg-gray-50"
          name="treatmentPlan"
          value={formData.treatmentPlan}
          onChange={handleChange}
          onBlur={() => handleUnifiedSave(formData, vitalsList, prescriptions)}
          placeholder="Enter the Treatment plan for the patient"
        />
      </div>

      <div className="p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base font-semibold text-gray-900">Advice</span>
          <span className="text-sm text-gray-400">— Objective — clinical findings</span>
        </div>
        <textarea
          className="w-full border border-gray-200 rounded-xl p-4 text-sm font-inherit resize-y min-h-[100px] outline-none box-border focus:border-blue-500 transition-colors bg-gray-50"
          name="advice"
          value={formData.advice}
          onChange={handleChange}
          onBlur={() => handleBlur()}
          placeholder="Enter the Advice for the patient"
        />
      </div>

      <div className="p-6 flex justify-between items-center bg-white rounded-b-xl mt-auto">
        <div className="flex items-center gap-3">
          <div className="w-11 h-6 rounded-full relative cursor-pointer transition-colors" onClick={() => setIsFollowupOn(!isFollowupOn)} style={{ background: isFollowupOn ? '#2563eb' : '#d1d5db' }}>
            <div className="w-5 h-5 bg-white rounded-full absolute top-[2px] transition-all" style={{ left: isFollowupOn ? '22px' : '2px' }}></div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900">Schedule Follow-up</span>
            <span className="text-xs text-blue-500 flex items-center gap-1"><Calendar size={12} /> In 2 weeks • 21 Jul 2025</span>
          </div>
        </div>
        <div className="flex gap-4">
          <span className="text-sm text-gray-500 self-center mr-2">{isSaving ? 'Saving...' : ''}</span>
          <button className="bg-white border border-gray-300 text-gray-700 py-2.5 px-6 rounded-lg font-semibold cursor-pointer hover:bg-gray-50 transition-colors">Save as Draft</button>
          <button
            className="bg-blue-600 text-white border-none py-2.5 px-6 rounded-lg font-semibold cursor-pointer flex items-center gap-2 hover:bg-blue-700 transition-colors"
            onClick={() => setIsSignModalOpen(true)}
          >
            <FileSignature size={16} /> Commit & Sign Chart
          </button>
        </div>
      </div>

      {isSignModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Sign Chart</h3>
              <button onClick={() => setIsSignModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Note Name (Optional)</label>
              <input 
                type="text" 
                className="w-full border border-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Follow-up Checkup"
                value={noteName}
                onChange={(e) => setNoteName(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setIsSignModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 cursor-pointer">Cancel</button>
              <button 
                onClick={async () => {
                  if (!encounterId) return;
                  try {
                    await PatientChartAPI.signEncounter(encounterId, noteName);
                    alert("Chart successfully signed and completed.");
                    setIsSignModalOpen(false);
                    if (onBack) onBack(); // Redirect to patient profile
                  } catch (e) {
                    console.error(e);
                    alert("Failed to sign chart.");
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 cursor-pointer"
              >
                Save & Sign
              </button>
            </div>
          </div>
        </div>
      )}

      <AddSymptomsModal
        isOpen={isSymptomsModalOpen}
        onClose={() => setIsSymptomsModalOpen(false)}
        symptoms={formData.symptoms}
        onSave={(newSymptoms) => {
          const updatedFormData = { ...formData, symptoms: newSymptoms };
          setFormData(updatedFormData);
          handleUnifiedSave(updatedFormData, vitalsList, prescriptions);
        }}
      />
    </div>
  );
};

export default ChartMainBody;
