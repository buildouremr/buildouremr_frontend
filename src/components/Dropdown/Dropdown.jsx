import React, { useState, useRef, useEffect } from "react";
import { MdKeyboardArrowDown, MdCheck } from "react-icons/md";

/**
 * Reusable Dropdown
 *
 * Props:
 *  - options: Array<{ value: string|number, label: string }> | Array<string>
 *  - value: string|number
 *  - onChange: (value) => void
 *  - placeholder: string
 *  - id: string
 */
const Dropdown = ({ options = [], value, onChange, placeholder = "Select...", id, className, disabled }) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  // Normalise options to { value, label }
  const normalised = options.map((o) =>
    typeof o === "string" ? { value: o, label: o } : o
  );

  const selected = normalised.find((o) => String(o.value) === String(value));

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <>
      <div className={`dd-wrap${className ? " " + className : ""}`} ref={wrapRef} id={id}>
        <button
          type="button"
          className={`dd-trigger ${open ? "dd-trigger-open" : ""} ${disabled ? "dd-trigger-disabled" : ""}`}
          onClick={() => !disabled && setOpen((v) => !v)}
          disabled={disabled}
        >
          <span className={selected ? "dd-value" : "dd-placeholder"}>
            {selected ? selected.label : placeholder}
          </span>
          <MdKeyboardArrowDown
            className="dd-arrow"
            style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          />
        </button>

        {open && (
          <div className="dd-menu">
            {normalised.map((opt) => {
              const isActive = String(opt.value) === String(value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  className={`dd-option ${isActive ? "dd-option-active" : ""}`}
                  onClick={() => { onChange(opt.value); setOpen(false); }}
                >
                  <span>{opt.label}</span>
                  {isActive && <MdCheck className="dd-check" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        .dd-wrap {
          position: relative;
        }
        .dd-trigger {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 10px 14px;
          border: 1px solid #e0e4ec;
          border-radius: 8px;
          background: #f9fafb;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
          text-align: left;
          gap: 8px;
        }
        .dd-trigger:hover { border-color: #93c5fd; }
        .dd-trigger-open { border-color: #2E7DF7 !important; background: #fff !important; }
        .dd-trigger-disabled { background: #F3F4F6 !important; cursor: default !important; opacity: 0.7; }
        .dd-trigger-disabled:hover { border-color: #e0e4ec !important; }
        .dd-value { font-size: 0.9rem; color: #1a1a2e; font-weight: 500; flex: 1; }
        .dd-placeholder { font-size: 0.9rem; color: #9ca3af; flex: 1; }
        .dd-arrow { font-size: 1.2rem; color: #6b7280; flex-shrink: 0; transition: transform 0.2s; }

        .dd-menu {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          right: 0;
          background: #fff;
          border: 1px solid #e0e4ec;
          border-radius: 8px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
          z-index: 1100;
          max-height: 220px;
          overflow-y: auto;
          animation: dd-pop 0.15s ease;
        }
        @keyframes dd-pop {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .dd-option {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 10px 14px;
          border: none;
          background: transparent;
          font-size: 0.88rem;
          color: #374151;
          cursor: pointer;
          text-align: left;
          transition: background 0.12s;
          border-bottom: 1px solid #f0f2f5;
        }
        .dd-option:last-child { border-bottom: none; }
        .dd-option:hover { background: #f5f8ff; color: #2E7DF7; }
        .dd-option-active { color: #2E7DF7; font-weight: 600; background: #f0f6ff; }
        .dd-check { font-size: 1rem; color: #2E7DF7; flex-shrink: 0; }
      `}</style>
    </>
  );
};

export default Dropdown;
