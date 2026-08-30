import React, { useState, useEffect } from 'react';
import { X, Minus } from 'lucide-react';

const AddSymptomsModal = ({ isOpen, onClose, symptoms, onSave }) => {
  const [currentSymptoms, setCurrentSymptoms] = useState([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (isOpen) {
      setCurrentSymptoms(Array.isArray(symptoms) ? [...symptoms] : []);
      setInputValue('');
    }
  }, [isOpen, symptoms]);

  if (!isOpen) return null;

  const handleAdd = () => {
    if (inputValue.trim() !== '') {
      setCurrentSymptoms([...currentSymptoms, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleRemove = (index) => {
    setCurrentSymptoms(currentSymptoms.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  const handleClose = () => {
    onSave(currentSymptoms);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-xl shadow-lg w-[450px] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 m-0">Symptoms</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer p-1">
            <X size={24} />
          </button>
        </div>

        {/* List */}
        <div className="p-6 flex flex-col gap-4 max-h-[300px] overflow-y-auto">
          {currentSymptoms.map((sym, idx) => (
            <div key={idx} className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-base font-medium text-gray-700">{sym}</span>
              </div>
              <button
                onClick={() => handleRemove(idx)}
                className="text-blue-500 hover:text-blue-700 bg-transparent border-none cursor-pointer flex items-center p-1"
              >
                <Minus size={20} />
              </button>
            </div>
          ))}
        </div>

        {/* Input area */}
        <div className="p-6 border-t border-gray-100">
          <div className="flex border border-gray-200 rounded-lg overflow-hidden focus-within:border-blue-500 transition-colors">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add Symptoms"
              className="flex-1 py-3 px-4 outline-none text-sm text-gray-700 placeholder-gray-400"
            />
            <button
              onClick={handleAdd}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 text-sm border-none cursor-pointer transition-colors flex items-center gap-1"
            >
              + Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSymptomsModal;
