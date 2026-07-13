import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import { MdCheckCircle, MdError, MdClose } from "react-icons/md";

// ── Context ──────────────────────────────────────────────────────────────────
const ToastContext = createContext(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
};

// ── Provider ─────────────────────────────────────────────────────────────────
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const timerRefs = useRef({});

  const dismiss = useCallback((id) => {
    clearTimeout(timerRefs.current[id]);
    delete timerRefs.current[id];
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 380);
  }, []);

  const showToast = useCallback(
    ({ type = "success", title, message }) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, type, title, message, exiting: false }]);
      timerRefs.current[id] = setTimeout(() => dismiss(id), 5000);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
};

// ── Container ─────────────────────────────────────────────────────────────────
const ToastContainer = ({ toasts, onDismiss }) => (
  <>
    <div className="toast-container">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>

    <style>{`
      .toast-container {
        position: fixed;
        bottom: 28px;
        right: 28px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 12px;
        pointer-events: none;
      }
    `}</style>
  </>
);

// ── Single Toast Item ─────────────────────────────────────────────────────────
const ToastItem = ({ toast, onDismiss }) => {
  const isSuccess = toast.type === "success";

  return (
    <>
      <div
        className={`toast-item ${isSuccess ? "toast-success" : "toast-error"} ${
          toast.exiting ? "toast-exit" : "toast-enter"
        }`}
        role="alert"
      >
        {/* Icon badge */}
        <div className={`toast-icon-badge ${isSuccess ? "toast-icon-success" : "toast-icon-error"}`}>
          {isSuccess ? <MdCheckCircle /> : <MdError />}
        </div>

        {/* Text */}
        <div className="toast-text">
          <span className="toast-title">{toast.title}</span>
          {toast.message && <span className="toast-message">{toast.message}</span>}
        </div>

        {/* Close */}
        <button className="toast-close" onClick={() => onDismiss(toast.id)}>
          <MdClose />
        </button>
      </div>

      <style>{`
        .toast-item {
          pointer-events: all;
          display: flex;
          align-items: flex-start;
          gap: 14px;
          min-width: 340px;
          max-width: 420px;
          background: #fff;
          border-radius: 12px;
          padding: 16px 16px 16px 20px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
          border: 1.5px solid transparent;
          position: relative;
        }
        .toast-success {
          border-color: #0D9B5C;
          background: #f0fdf8;
        }
        .toast-error {
          border-color: #E74C3C;
          background: #fff8f8;
        }
        .toast-icon-badge {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          flex-shrink: 0;
        }
        .toast-icon-success {
          background: #0D9B5C;
          color: #fff;
        }
        .toast-icon-error {
          background: #E74C3C;
          color: #fff;
        }
        .toast-text {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
        }
        .toast-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: #1a1a2e;
        }
        .toast-message {
          font-size: 0.82rem;
          color: #6b7280;
          line-height: 1.4;
        }
        .toast-close {
          background: none;
          border: none;
          color: #9ca3af;
          font-size: 1.15rem;
          cursor: pointer;
          padding: 2px;
          display: flex;
          align-items: center;
          flex-shrink: 0;
          border-radius: 4px;
          transition: color 0.15s, background 0.15s;
        }
        .toast-close:hover { color: #374151; background: #f0f2f5; }

        @keyframes toast-slide-in {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes toast-slide-out {
          from { opacity: 1; transform: translateX(0); }
          to   { opacity: 0; transform: translateX(40px); }
        }
        .toast-enter { animation: toast-slide-in 0.3s cubic-bezier(0.16,1,0.3,1) both; }
        .toast-exit  { animation: toast-slide-out 0.35s ease-in both; }
      `}</style>
    </>
  );
};

export default ToastProvider;
