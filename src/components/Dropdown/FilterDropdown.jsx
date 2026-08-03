import React, { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Search, X } from 'lucide-react';

/**
 * Reusable Multi-Select Filter Dropdown
 *
 * Props:
 *  - options: Array<{ value: string|number, label: string }> | Array<string>
 *  - selectedValues: Array<string|number>
 *  - onChange: (selectedValues) => void
 *  - placeholder: string
 *  - id: string
 */
const FilterDropdown = ({ options = [], selectedValues = [], onChange, placeholder = "Select...", id }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const wrapRef = useRef(null);

  // Normalise options to { value, label }
  const normalised = useMemo(() => {
    return options.map((o) => (typeof o === "string" ? { value: o, label: o } : o));
  }, [options]);

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return normalised;
    const q = search.toLowerCase();
    return normalised.filter(o => String(o.label).toLowerCase().includes(q));
  }, [normalised, search]);

  useEffect(() => {
    if (open && focusedIndex >= 0 && wrapRef.current) {
      const options = wrapRef.current.querySelectorAll(".fdd-option");
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
        setSearch("");
        setFocusedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const toggleOption = (val) => {
    const isSelected = selectedValues.includes(val);
    if (isSelected) {
      onChange(selectedValues.filter(v => v !== val));
    } else {
      onChange([...selectedValues, val]);
    }
  };

  const unselectAll = () => {
    onChange([]);
  };

  const handleKeyDown = (e) => {
    if (!open) {
      if (e.key === "Enter" || e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        setOpen(true);
        setFocusedIndex(-1);
      }
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      setSearch("");
      setFocusedIndex(-1);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (filteredOptions.length > 0) {
        setFocusedIndex((prev) => (prev + 1) % filteredOptions.length);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (filteredOptions.length > 0) {
        setFocusedIndex((prev) => (prev - 1 + filteredOptions.length) % filteredOptions.length);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
        toggleOption(filteredOptions[focusedIndex].value);
      }
    }
  };

  return (
    <>
      <div 
        className="fdd-wrap" 
        ref={wrapRef} 
        id={id}
        onKeyDown={handleKeyDown}
      >
        <button
          type="button"
          className={`fdd-trigger ${open ? "fdd-trigger-open" : ""} ${selectedValues.length > 0 ? "fdd-trigger-active" : ""}`}
          onClick={() => {
            setOpen((v) => !v);
            setFocusedIndex(-1);
          }}
        >
          <span className={selectedValues.length > 0 ? "fdd-value" : "fdd-placeholder"}>
            {selectedValues.length === 0 
              ? placeholder 
              : selectedValues.length === 1 
                ? normalised.find(o => o.value === selectedValues[0])?.label 
                : `${selectedValues.length} Selected`}
          </span>
          <ChevronDown
            className="fdd-arrow"
            style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          />
        </button>

        {open && (
          <div className="fdd-menu">
            <div className="fdd-search-wrap">
              <Search className="fdd-search-icon" />
              <input 
                type="text" 
                className="fdd-search-input" 
                placeholder="Search" 
                value={search}
                onChange={e => setSearch(e.target.value)}
                autoFocus
              />
            </div>
            
            <div className="fdd-options-list">
              {selectedValues.length > 0 && !search && (
                <button
                  type="button"
                  className="fdd-unselect-all"
                  onClick={unselectAll}
                >
                  <X className="fdd-unselect-icon" />
                  <span>Unselect All</span>
                </button>
              )}

              {filteredOptions.length === 0 ? (
                <div className="fdd-empty">No results found</div>
              ) : (
                filteredOptions.map((opt, i) => {
                  const isActive = selectedValues.includes(opt.value);
                  const isFocused = i === focusedIndex;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      className={`fdd-option ${isActive ? "fdd-option-active" : ""} ${isFocused ? "fdd-option-focused" : ""}`}
                      onClick={() => toggleOption(opt.value)}
                      onMouseEnter={() => setFocusedIndex(i)}
                    >
                      <span className="fdd-option-label">{opt.label}</span>
                      {isActive && <div className="fdd-active-indicator" />}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .fdd-wrap {
          position: relative;
          width: 250px;
        }
        .fdd-trigger {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #e0e4ec;
          border-radius: 8px;
          background: #fff;
          cursor: pointer;
          transition: border-color 0.15s, box-shadow 0.15s;
          text-align: left;
          gap: 8px;
        }
        .fdd-trigger:hover { border-color: #93c5fd; }
        .fdd-trigger-open { border-color: #2E7DF7 !important; box-shadow: 0 0 0 3px rgba(46, 125, 247, 0.1); }
        .fdd-trigger-active { background: #f0f6ff; border-color: #bfdbfe; }
        
        .fdd-value { font-size: 0.85rem; color: #1a1a2e; font-weight: 600; flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .fdd-placeholder { font-size: 0.85rem; color: #6b7280; flex: 1; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .fdd-arrow { font-size: 1.2rem; color: #6b7280; flex-shrink: 0; transition: transform 0.2s; }

        .fdd-menu {
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          width: 100%;
          min-width: 250px;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.08);
          z-index: 1100;
          display: flex;
          flex-direction: column;
          animation: fdd-pop 0.15s ease;
          overflow: hidden;
        }
        @keyframes fdd-pop {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .fdd-search-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          border-bottom: 1px solid #f3f4f6;
        }
        .fdd-search-icon {
          color: #9ca3af;
          font-size: 1.1rem;
        }
        .fdd-search-input {
          border: none;
          outline: none;
          font-size: 0.88rem;
          color: #1a1a2e;
          width: 100%;
        }
        .fdd-search-input::placeholder {
          color: #9ca3af;
        }

        .fdd-options-list {
          max-height: 240px;
          overflow-y: auto;
          padding: 6px;
        }

        /* Custom scrollbar for the list */
        .fdd-options-list::-webkit-scrollbar {
          width: 6px;
        }
        .fdd-options-list::-webkit-scrollbar-track {
          background: transparent;
        }
        .fdd-options-list::-webkit-scrollbar-thumb {
          background-color: #bfdbfe;
          border-radius: 10px;
        }

        .fdd-unselect-all {
          display: flex;
          align-items: center;
          gap: 6px;
          width: 100%;
          padding: 8px 12px;
          border: none;
          background: transparent;
          font-size: 0.82rem;
          color: #ef4444;
          font-weight: 500;
          cursor: pointer;
          text-align: left;
          border-radius: 6px;
          margin-bottom: 4px;
        }
        .fdd-unselect-all:hover {
          background: #fef2f2;
        }
        .fdd-unselect-icon {
          font-size: 1rem;
        }

        .fdd-option {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 10px 12px;
          border: none;
          background: transparent;
          font-size: 0.88rem;
          color: #374151;
          cursor: pointer;
          text-align: left;
          border-radius: 6px;
          transition: background 0.15s, color 0.15s;
          margin-bottom: 2px;
        }
        .fdd-option:hover { background: #f9fafb; }
        .fdd-option-focused { background: #f9fafb; outline: none; }
        .fdd-option-active { background: #f0f6ff; color: #1a1a2e; font-weight: 500; }
        .fdd-option-active:hover { background: #e0f0ff; }
        
        .fdd-option-label {
          flex: 1;
        }

        .fdd-active-indicator {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 20px;
          background: #2E7DF7;
          border-radius: 4px 0 0 4px;
        }

        .fdd-empty {
          padding: 16px;
          text-align: center;
          color: #9ca3af;
          font-size: 0.85rem;
        }
      `}</style>
    </>
  );
};

export default FilterDropdown;
