import React, { useState, useEffect } from 'react';
import { X, Minus, Plus } from 'lucide-react';
import PatientChartAPI from '../API/patientChartAPI';

const AddChronicConditionsModal = ({ isOpen, onClose, patientId, initialConditions = {}, onSaveSuccess }) => {
  const [conditions, setConditions] = useState(initialConditions || {});
  const [inputValue, setInputValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setConditions(initialConditions || {});
      setInputValue('');
    }
  }, [isOpen, initialConditions]);

  if (!isOpen) return null;

  const handleAddCondition = () => {
    if (inputValue.trim()) {
      const conditionName = inputValue.trim();
      const now = new Date();
      // Date format like: "03 Sep 2026"
      const options = { day: '2-digit', month: 'short', year: 'numeric' };
      const formattedDate = now.toLocaleDateString('en-GB', options);

      setConditions((prev) => ({
        ...prev,
        [conditionName]: { date: formattedDate, status: 'active' },
      }));
      setInputValue('');
    }
  };

  const handleRemoveCondition = (conditionName) => {
    setConditions((prev) => {
      const updated = { ...prev };
      delete updated[conditionName];
      return updated;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await PatientChartAPI.savePatientChronicConditions(patientId, conditions);
      onSaveSuccess(conditions);
      onClose();
    } catch (error) {
      console.error('Error saving chronic conditions:', error);
      alert('Failed to save chronic conditions. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col h-[500px]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Chronic Conditions</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Search/Input Bar */}
          <div className="relative mb-6">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddCondition();
                }
              }}
              placeholder="Add Condition"
              className="w-full border border-gray-200 rounded-xl py-3 pl-4 pr-24 text-sm font-inherit outline-none box-border focus:border-blue-500 transition-colors shadow-sm"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <button
                onClick={handleAddCondition}
                disabled={!inputValue.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-1"
              >
                <Plus size={16} /> Add
              </button>
            </div>
          </div>

          {/* List of Added Conditions */}
          <div className="space-y-4">
            {Object.keys(conditions).length > 0 ? (
              Object.entries(conditions).map(([name, data]) => (
                <div key={name} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="text-gray-700 font-medium text-sm">{name}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveCondition(name)}
                    className="p-1 text-blue-500 opacity-100 transition-all hover:bg-blue-50 rounded"
                  >
                    <Minus size={18} />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 text-sm py-6">
                No conditions added yet.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-gray-700 text-sm font-medium hover:bg-gray-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddChronicConditionsModal;
