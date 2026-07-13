import React, { useState, useRef, useEffect } from "react";
import { MdSearch } from "react-icons/md";

/**
 * PatientSearchInput — search bar + dropdown results styled as a mini-table.
 *
 * Props:
 *  - value: string
 *  - onChange: (query: string) => void       ← called on keystroke
 *  - onSelect: (patient: object) => void     ← called when user picks a result
 *  - results: Array<{ patientId, patientName, patientMobileNo, ... }>
 *  - loading: bool
 *  - placeholder: string
 *  - formatId: (id) => string   (optional formatter, default "PT####")
 */
const PatientSearchInput = ({
  value,
  onChange,
  onSelect,
  results = [],
  loading = false,
  placeholder = "Search by Full Name",
  formatId,
}) => {
  const [focused, setFocused] = useState(false);
  const wrapRef = useRef(null);

  const showDropdown = focused && (results.length > 0 || (loading && value?.length >= 2));

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setFocused(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fmtId = formatId || ((id) => `PT${String(id).padStart(4, "0")}`);

  return (
    <>
      <div className="psi-wrap" ref={wrapRef}>
        <div className={`psi-input-row ${focused ? "psi-focused" : ""}`}>
          <input
            type="text"
            className="psi-input"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            autoComplete="off"
          />
          <MdSearch className="psi-icon" />
        </div>

        {showDropdown && (
          <div className="psi-dropdown">
            {loading ? (
              <div className="psi-loading">Searching...</div>
            ) : (
              results.map((p) => (
                <button
                  key={p.patientId}
                  type="button"
                  className="psi-row"
                  onMouseDown={(e) => {
                    e.preventDefault(); // keep focus logic clean
                    onSelect(p);
                    setFocused(false);
                  }}
                >
                  <span className="psi-col psi-id">{fmtId(p.patientId)}</span>
                  <span className="psi-sep">–</span>
                  <span className="psi-col psi-name">{p.patientName}</span>
                  <span className="psi-sep">–</span>
                  <span className="psi-col psi-phone">(+91) {p.patientMobileNo}</span>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      <style>{`
        .psi-wrap {
          position: relative;
          width: 100%;
        }
        .psi-input-row {
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid #e0e4ec;
          border-radius: 8px;
          padding: 10px 14px;
          background: #f9fafb;
          transition: border-color 0.15s, background 0.15s;
        }
        .psi-focused {
          border-color: #2E7DF7;
          background: #fff;
        }
        .psi-input {
          flex: 1;
          border: none;
          background: transparent;
          outline: none;
          font-size: 0.9rem;
          color: #1a1a2e;
        }
        .psi-input::placeholder { color: #9ca3af; }
        .psi-icon { color: #9ca3af; font-size: 1.15rem; flex-shrink: 0; }

        .psi-dropdown {
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
          animation: psi-pop 0.15s ease;
        }
        @keyframes psi-pop {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .psi-loading {
          padding: 12px 16px;
          font-size: 0.85rem;
          color: #9ca3af;
        }
        .psi-row {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 11px 16px;
          border: none;
          background: transparent;
          border-bottom: 1px solid #f0f2f5;
          cursor: pointer;
          text-align: left;
          transition: background 0.12s;
        }
        .psi-row:last-child { border-bottom: none; }
        .psi-row:hover { background: #f5f8ff; }
        .psi-col { font-size: 0.85rem; color: #374151; white-space: nowrap; }
        .psi-id { font-weight: 600; color: #1a1a2e; min-width: 52px; }
        .psi-name { flex: 1; font-weight: 500; }
        .psi-phone { color: #6b7280; }
        .psi-sep { color: #d1d5db; font-size: 0.8rem; }
      `}</style>
    </>
  );
};

export default PatientSearchInput;
