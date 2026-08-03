import React from "react";
import { X, Save, Trash2 } from 'lucide-react';

/**
 * Reusable Confirm Modal
 *
 * Props:
 *  - variant: "save" | "delete"  (default: "save")
 *  - title: string
 *  - message: string
 *  - confirmLabel: string (default: "Yes, Save" | "Delete")
 *  - onConfirm: () => void
 *  - onCancel: () => void
 *  - loading: bool
 */
const ConfirmModal = ({
  variant = "save",
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
  loading = false,
}) => {
  const isDelete = variant === "delete";

  const defaultConfirmLabel = isDelete ? "Delete" : "Yes, Save";
  const label = confirmLabel || defaultConfirmLabel;

  return (
    <>
      <div className="cm-overlay">
        <div className="cm-modal" onClick={(e) => e.stopPropagation()}>
          {/* Close button */}
          <button className="cm-close" onClick={onCancel}>
            <X />
          </button>

          {/* Icon */}
          <div className={`cm-icon-wrap ${isDelete ? "cm-icon-delete" : "cm-icon-save"}`}>
            {isDelete ? <Trash2 /> : <Save />}
          </div>

          {/* Text */}
          <h2 className="cm-title">{title}</h2>
          <p className="cm-message">{message}</p>

          {/* Buttons */}
          <div className="cm-actions">
            <button className="cm-btn-cancel" onClick={onCancel} disabled={loading}>
              Cancel
            </button>
            <button
              className={`cm-btn-confirm ${isDelete ? "cm-btn-delete" : "cm-btn-save"}`}
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? "Please wait..." : label}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .cm-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 20px;
          animation: cm-fade-in 0.2s ease;
        }
        @keyframes cm-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .cm-modal {
          background: #fff;
          border-radius: 16px;
          padding: 32px 28px 28px;
          width: 100%;
          max-width: 380px;
          position: relative;
          box-shadow: 0 20px 60px rgba(0,0,0,0.18);
          animation: cm-slide-up 0.25s cubic-bezier(0.16,1,0.3,1);
        }
        @keyframes cm-slide-up {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .cm-close {
          position: absolute;
          top: 16px;
          right: 16px;
          background: none;
          border: none;
          font-size: 1.3rem;
          color: #9ca3af;
          cursor: pointer;
          border-radius: 6px;
          padding: 4px;
          display: flex;
          align-items: center;
          transition: color 0.15s, background 0.15s;
        }
        .cm-close:hover { color: #374151; background: #f0f2f5; }

        .cm-icon-wrap {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          margin-bottom: 20px;
        }
        .cm-icon-save {
          background: #EEF4FF;
          color: #2E7DF7;
        }
        .cm-icon-delete {
          background: #FFF0F0;
          color: #E74C3C;
        }

        .cm-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1a1a2e;
          margin: 0 0 8px;
        }
        .cm-message {
          font-size: 0.875rem;
          color: #6b7280;
          margin: 0 0 28px;
          line-height: 1.5;
        }

        .cm-actions {
          display: flex;
          gap: 12px;
        }
        .cm-btn-cancel {
          flex: 1;
          padding: 12px;
          border: 1.5px solid #d1d5db;
          background: #fff;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          color: #374151;
          cursor: pointer;
          transition: all 0.15s;
        }
        .cm-btn-cancel:hover { background: #f9fafb; border-color: #9ca3af; }
        .cm-btn-cancel:disabled { opacity: 0.5; cursor: not-allowed; }

        .cm-btn-confirm {
          flex: 1;
          padding: 12px;
          border: none;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          color: #fff;
          cursor: pointer;
          transition: all 0.15s;
        }
        .cm-btn-save   { background: #2E7DF7; }
        .cm-btn-save:hover   { background: #1b65d4; }
        .cm-btn-delete { background: #E74C3C; }
        .cm-btn-delete:hover { background: #c0392b; }
        .cm-btn-confirm:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>
    </>
  );
};

export default ConfirmModal;
