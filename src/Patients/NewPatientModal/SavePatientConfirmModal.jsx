import React from "react";
import { Save } from 'lucide-react';

const SavePatientConfirmModal = ({ onConfirm, onCancel, loading }) => {
  return (
    <>
      <div className="spcm-overlay">
        <div className="spcm-modal" onClick={(e) => e.stopPropagation()}>
          <button className="spcm-close-btn" onClick={onCancel} disabled={loading}>
            ✕
          </button>
          
          <div className="spcm-body">
            <div className="spcm-icon-wrapper">
              <Save className="spcm-icon" />
            </div>
            
            <h2 className="spcm-title">Save Created Patient</h2>
            <p className="spcm-subtitle">Are you sure you want to save this Patient?</p>
            
            <div className="spcm-footer">
              <button className="spcm-btn-cancel" onClick={onCancel} disabled={loading}>
                Cancel
              </button>
              <button className="spcm-btn-save" onClick={onConfirm} disabled={loading}>
                {loading ? "Saving..." : "Yes, Save"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .spcm-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
        }
        .spcm-modal {
          background: #fff;
          width: 100%;
          max-width: 400px;
          border-radius: 12px;
          padding: 24px;
          position: relative;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        .spcm-close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          background: none;
          border: none;
          font-size: 1.2rem;
          color: #6b7280;
          cursor: pointer;
        }
        .spcm-close-btn:hover {
          color: #111827;
        }
        .spcm-body {
          display: flex;
          flex-direction: column;
        }
        .spcm-icon-wrapper {
          width: 48px;
          height: 48px;
          background: #eaf3ff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }
        .spcm-icon {
          color: #2E7DF7;
          font-size: 1.5rem;
        }
        .spcm-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: #1a1a2e;
          margin: 0 0 8px 0;
        }
        .spcm-subtitle {
          font-size: 0.95rem;
          color: #4b5563;
          margin: 0 0 24px 0;
        }
        .spcm-footer {
          display: flex;
          gap: 12px;
        }
        .spcm-btn-cancel, .spcm-btn-save {
          flex: 1;
          padding: 10px 0;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.15s;
        }
        .spcm-btn-cancel {
          background: #fff;
          border: 1px solid #d1d5db;
          color: #374151;
        }
        .spcm-btn-cancel:hover:not(:disabled) {
          background: #f9fafb;
          border-color: #9ca3af;
        }
        .spcm-btn-save {
          background: #0070F3;
          border: 1px solid #0070F3;
          color: #fff;
        }
        .spcm-btn-save:hover:not(:disabled) {
          background: #0057c2;
          border-color: #0057c2;
        }
        .spcm-btn-cancel:disabled, .spcm-btn-save:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </>
  );
};

export default SavePatientConfirmModal;
