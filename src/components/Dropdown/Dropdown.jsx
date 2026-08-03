import React, { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Check } from 'lucide-react';

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
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const wrapRef = useRef(null);

  const normalised = useMemo(() => {
    return options.map((o) => (typeof o === "string" ? { value: o, label: o } : o));
  }, [options]);

  const selected = normalised.find((o) => String(o.value) === String(value));

  useEffect(() => {
    if (open && focusedIndex >= 0 && wrapRef.current) {
      const options = wrapRef.current.querySelectorAll(".dd-option");
      if (options[focusedIndex]) {
        options[focusedIndex].scrollIntoView({ block: "nearest" });
      }
    }
  }, [focusedIndex, open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
        setFocusedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleKeyDown = (e) => {
    if (!open) {
      if (e.key === "Enter" || e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        if (!disabled) {
          setOpen(true);
          setFocusedIndex(0);
        }
      }
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      setFocusedIndex(-1);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev + 1) % normalised.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev - 1 + normalised.length) % normalised.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      if (focusedIndex >= 0 && focusedIndex < normalised.length) {
        onChange(normalised[focusedIndex].value);
        setOpen(false);
        setFocusedIndex(-1);
        wrapRef.current?.querySelector(".dd-trigger")?.blur();
      } else {
        setOpen(false);
        setFocusedIndex(-1);
      }
    }
  };

  return (
    <>
      <div 
        className={`dd-wrap${className ? " " + className : ""}`} 
        ref={wrapRef} 
        id={id}
        onKeyDown={handleKeyDown}
      >
        <button
          type="button"
          className={`dd-trigger ${open ? "dd-trigger-open" : ""} ${disabled ? "dd-trigger-disabled" : ""}`}
          onClick={() => {
            if (!disabled) {
              setOpen((v) => !v);
              setFocusedIndex(-1);
            }
          }}
          disabled={disabled}
        >
          <span className={selected ? "dd-value" : "dd-placeholder"}>
            {selected ? selected.label : placeholder}
          </span>
          <ChevronDown
            className="dd-arrow"
            style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          />
        </button>

        {open && (
          <div className="dd-menu">
            {normalised.map((opt, i) => {
              const isActive = String(opt.value) === String(value);
              const isFocused = i === focusedIndex;
              return (
                <button
                  key={opt.value}
                  type="button"
                  className={`dd-option ${isActive ? "dd-option-active" : ""} ${isFocused ? "dd-option-focused" : ""}`}
                  onClick={() => { onChange(opt.value); setOpen(false); setFocusedIndex(-1); }}
                  onMouseEnter={() => setFocusedIndex(i)}
                >
                  <span>{opt.label}</span>
                  {isActive && <Check className="dd-check" />}
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
        .dd-option-focused { background: #f5f8ff; color: #2E7DF7; outline: none; }
        .dd-option-active { color: #2E7DF7; font-weight: 600; background: #f0f6ff; }
        .dd-check { font-size: 1rem; color: #2E7DF7; flex-shrink: 0; }
      `}</style>
    </>
  );
};

export default Dropdown;
