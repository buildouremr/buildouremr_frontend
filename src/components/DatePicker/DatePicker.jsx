import React, { useState, useRef, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];
const DAYS_SHORT = ["Su","Mo","Tu","We","Th","Fr","Sa"];

const formatDisplay = (date) => {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d)) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd} - ${mm} - ${yyyy}`;
};

const toISO = (d) => {
  if (!d) return "";
  const dt = typeof d === "string" ? new Date(d) : d;
  if (isNaN(dt)) return "";
  return `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,"0")}-${String(dt.getDate()).padStart(2,"0")}`;
};

const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

/**
 * DatePicker — custom calendar picker.
 *
 * Props:
 *  - value: string (ISO "YYYY-MM-DD") or Date
 *  - onChange: (isoString: string) => void
 *  - placeholder: string
 *  - label: string  (optional)
 *  - id: string
 *  - minDate: string (ISO)
 *  - maxDate: string (ISO)
 *  - customDisplay: string (optional)
 *  - hideIcon: boolean
 */
const DatePicker = ({
  value,
  onChange,
  placeholder = "DD - MM - YYYY",
  label,
  id,
  minDate,
  maxDate,
  openUpward = false,
  customDisplay,
  hideIcon = false,
}) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  const today = new Date();
  const selected = value ? (typeof value === "string" ? new Date(value) : value) : null;

  const [viewYear, setViewYear] = useState((selected || today).getFullYear());
  const [viewMonth, setViewMonth] = useState((selected || today).getMonth());
  const [mode, setMode] = useState("date"); // "date" | "month" | "year"
  const [yearPage, setYearPage] = useState(viewYear - (viewYear % 12));

  // Sync view when value changes externally
  useEffect(() => {
    if (selected && !isNaN(selected)) {
      setViewYear(selected.getFullYear());
      setViewMonth(selected.getMonth());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    setYearPage(viewYear - (viewYear % 12));
  }, [viewYear]);

  // Close on outside click
  useEffect(() => {
    if (!open) {
      setMode("date"); // reset mode when closed
      return;
    }
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Navigation handlers
  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };
  const prevYear = () => setViewYear((y) => y - 1);
  const nextYear = () => setViewYear((y) => y + 1);
  const prevYearPage = () => setYearPage((y) => y - 12);
  const nextYearPage = () => setYearPage((y) => y + 12);

  const handleDayClick = (day) => {
    const clicked = new Date(viewYear, viewMonth, day);
    if (minDate && clicked < new Date(minDate)) return;
    if (maxDate && clicked > new Date(maxDate)) return;
    onChange(toISO(clicked));
    setOpen(false);
  };

  const isSelected = (day) => {
    if (!selected) return false;
    return selected.getFullYear() === viewYear &&
           selected.getMonth() === viewMonth &&
           selected.getDate() === day;
  };

  const isToday = (day) => {
    return today.getFullYear() === viewYear &&
           today.getMonth() === viewMonth &&
           today.getDate() === day;
  };

  const isDisabled = (day) => {
    const d = new Date(viewYear, viewMonth, day);
    if (minDate && d < new Date(minDate)) return true;
    if (maxDate && d > new Date(maxDate)) return true;
    return false;
  };

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <>
      <div className="dp-wrap" ref={wrapRef} id={id}>
        {label && <label className="dp-label">{label}</label>}
        <button
          type="button"
          className={`dp-trigger ${open ? "dp-trigger-open" : ""}`}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`dp-display ${!value && !customDisplay ? "dp-placeholder" : ""}`}>
            {customDisplay ? customDisplay : (value ? formatDisplay(value) : placeholder)}
          </span>
          {!hideIcon && <Calendar className="dp-cal-icon" />}
        </button>

        {open && (
          <div className={`dp-calendar ${openUpward ? "dp-calendar-up" : "dp-calendar-down"}`}>
            {/* Nav */}
            <div className="dp-nav">
              <button type="button" className="dp-nav-btn" onClick={() => {
                if (mode === "date") prevMonth();
                else if (mode === "month") prevYear();
                else prevYearPage();
              }}>
                <ChevronLeft />
              </button>
              <div className="dp-month-year-selectors">
                {mode === "date" && (
                  <>
                    <button type="button" className="dp-mode-btn" onClick={() => setMode("month")}>
                      {MONTHS[viewMonth]}
                    </button>
                    <button type="button" className="dp-mode-btn" onClick={() => setMode("year")}>
                      {viewYear}
                    </button>
                  </>
                )}
                {mode === "month" && (
                  <button type="button" className="dp-mode-btn" onClick={() => setMode("year")}>
                    {viewYear}
                  </button>
                )}
                {mode === "year" && (
                  <span className="dp-nav-range">
                    {yearPage} - {yearPage + 11}
                  </span>
                )}
              </div>
              <button type="button" className="dp-nav-btn" onClick={() => {
                if (mode === "date") nextMonth();
                else if (mode === "month") nextYear();
                else nextYearPage();
              }}>
                <ChevronRight />
              </button>
            </div>

            {/* Content Grids */}
            {mode === "date" && (
              <>
                <div className="dp-grid dp-daynames">
                  {DAYS_SHORT.map((d) => <span key={d} className="dp-dayname">{d}</span>)}
                </div>
                <div className="dp-grid dp-days">
                  {cells.map((day, idx) =>
                    day === null ? (
                      <span key={`e-${idx}`} />
                    ) : (
                      <button
                        key={day}
                        type="button"
                        className={`dp-day
                          ${isSelected(day) ? "dp-day-selected" : ""}
                          ${isToday(day) && !isSelected(day) ? "dp-day-today" : ""}
                          ${isDisabled(day) ? "dp-day-disabled" : ""}
                        `}
                        onClick={() => handleDayClick(day)}
                        disabled={isDisabled(day)}
                      >
                        {day}
                      </button>
                    )
                  )}
                </div>
              </>
            )}

            {mode === "month" && (
              <div className="dp-grid-months">
                {MONTHS.map((m, idx) => (
                  <button
                    key={m}
                    type="button"
                    className={`dp-month-btn ${idx === viewMonth && viewYear === (selected ? selected.getFullYear() : today.getFullYear()) ? "dp-month-selected" : ""}`}
                    onClick={() => {
                      setViewMonth(idx);
                      setMode("date");
                    }}
                  >
                    {m.substring(0, 3)}
                  </button>
                ))}
              </div>
            )}

            {mode === "year" && (
              <div className="dp-grid-years">
                {Array.from({length: 12}, (_, i) => yearPage + i).map(y => (
                  <button
                    key={y}
                    type="button"
                    className={`dp-year-btn ${y === viewYear ? "dp-year-selected" : ""}`}
                    onClick={() => {
                      setViewYear(y);
                      setMode("month");
                    }}
                  >
                    {y}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        .dp-wrap {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .dp-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
        }
        .dp-trigger {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          border: 1px solid #e0e4ec;
          border-radius: 8px;
          background: #f9fafb;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
          width: 100%;
          text-align: left;
        }
        .dp-trigger:hover { border-color: #93c5fd; }
        .dp-trigger-open { border-color: #2E7DF7 !important; background: #fff !important; }
        .dp-display { font-size: 0.9rem; color: #1a1a2e; font-weight: 500; }
        .dp-placeholder { color: #9ca3af; font-weight: 400; }
        .dp-cal-icon { font-size: 1rem; color: #6b7280; flex-shrink: 0; }

        .dp-calendar {
          position: absolute;
          z-index: 1200;
          background: #fff;
          border: 1px solid #e0e4ec;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.14);
          padding: 16px;
          min-width: 264px;
          animation: dp-pop 0.18s cubic-bezier(0.16,1,0.3,1);
        }
        .dp-calendar-down {
          top: calc(100% + 6px);
          left: 0;
        }
        .dp-calendar-up {
          bottom: calc(100% + 6px);
          left: 0;
        }
        @keyframes dp-pop {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .dp-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .dp-nav-btn {
          width: 30px; height: 30px;
          border: 1px solid #e0e4ec;
          border-radius: 6px;
          background: #fff;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          font-size: 1.1rem;
          color: #4b5563;
          transition: all 0.15s;
        }
        .dp-nav-btn:hover { background: #f0f4ff; color: #2E7DF7; border-color: #93c5fd; }
        
        .dp-month-year-selectors {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        .dp-mode-btn {
          border: none; background: transparent;
          font-size: 0.95rem; font-weight: 600; color: #1a1a2e;
          cursor: pointer; padding: 4px 8px; border-radius: 6px;
          transition: background 0.15s;
        }
        .dp-mode-btn:hover { background: #f0f4ff; color: #2E7DF7; }
        .dp-nav-range { font-size: 0.95rem; font-weight: 600; color: #1a1a2e; padding: 4px 8px; }

        .dp-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 2px;
        }
        .dp-daynames { margin-bottom: 4px; }
        .dp-dayname { 
          text-align: center; 
          font-size: 0.72rem; 
          font-weight: 600; 
          color: #9ca3af; 
          padding: 4px 0;
        }
        .dp-day {
          width: 100%;
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          background: transparent;
          border-radius: 6px;
          font-size: 0.82rem;
          color: #374151;
          cursor: pointer;
          transition: all 0.12s;
          font-weight: 500;
        }
        .dp-day:hover:not(:disabled) { background: #f0f4ff; color: #2E7DF7; }
        .dp-day-today {
          color: #2E7DF7;
          font-weight: 600;
          border: 1.5px solid #2E7DF7;
        }
        .dp-day-selected {
          background: #2E7DF7 !important;
          color: #fff !important;
          font-weight: 600;
        }
        .dp-day-disabled { color: #d1d5db; cursor: not-allowed; }

        .dp-grid-months, .dp-grid-years {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin-top: 10px;
        }
        .dp-month-btn, .dp-year-btn {
          padding: 12px 0;
          border: none; background: #f9fafb; border-radius: 6px;
          font-size: 0.85rem; font-weight: 500; color: #374151;
          cursor: pointer; transition: all 0.15s;
        }
        .dp-month-btn:hover, .dp-year-btn:hover { background: #f0f4ff; color: #2E7DF7; }
        .dp-month-selected, .dp-year-selected { background: #2E7DF7 !important; color: #fff !important; font-weight: 600; }
      `}</style>
    </>
  );
};

export default DatePicker;
