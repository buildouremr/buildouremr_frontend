import useAppointmentHeader from "./useAppointmentHeader";

import DatePicker from "../../components/DatePicker/DatePicker";
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

const toISO = (d) => {
  const dt = d instanceof Date ? d : new Date(d);
  if (isNaN(dt)) return "";
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
};

const AppointmentHeader = ({ selectedDate, onDateChange, onNewAppointment }) => {
  const {
    formattedDate,
    handlePrev, handleNext,
    handleNewAppointment,
  } = useAppointmentHeader({ selectedDate, onDateChange, onNewAppointment });

  // DatePicker works with ISO strings; convert the Date object to ISO
  const isoValue = toISO(selectedDate);

  const handlePickerChange = (isoStr) => {
    if (!isoStr) return;
    const d = new Date(isoStr);
    d.setHours(0, 0, 0, 0);
    if (onDateChange) onDateChange(d);
  };

  return (
    <>
      <div className="ah-container">
        <h1 className="ah-title">Appointments</h1>
        <div className="ah-right">
          <button className="ah-new-btn" onClick={handleNewAppointment}>
            <Plus style={{ fontSize: "1.1rem" }} />
            <span>Create Appointment</span>
          </button>

          {/* Date Navigator */}
          <div className="ah-date-nav">
            <button
              className="ah-nav-btn"
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            >
              <ChevronLeft />
            </button>

            <div className="ah-picker-wrap">
              <DatePicker
                value={isoValue}
                onChange={handlePickerChange}
                id="ah-date-picker"
                customDisplay={formattedDate}
                hideIcon={true}
              />
            </div>

            <button
              className="ah-nav-btn"
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .ah-container {
          padding: 24px 28px 20px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .ah-title {
          font-size: 1.6rem;
          font-weight: 700;
          color: #1a1a2e;
          margin: 0;
        }
        .ah-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .ah-new-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 9px 20px;
          border: none;
          background: #2E7DF7;
          color: #fff;
          border-radius: 8px;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          white-space: nowrap;
        }
        .ah-new-btn:hover { background: #1b65d4; }

        /* Date Navigator */
        .ah-date-nav {
          display: flex;
          align-items: center;
          border: 1px solid #e0e4ec;
          border-radius: 8px;
          overflow: visible;
          background: #fff;
          position: relative;
        }
        .ah-nav-btn {
          width: 32px;
          height: 36px;
          border: none;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1.15rem;
          color: #4b5563;
          transition: background 0.15s;
          flex-shrink: 0;
        }
        .ah-nav-btn:hover { background: #f0f4ff; color: #2E7DF7; }

        .ah-picker-wrap {
          display: flex;
          align-items: center;
          border-left: 1px solid #e0e4ec;
          border-right: 1px solid #e0e4ec;
          position: relative;
        }

        /* Override DatePicker trigger for compact header use */
        #ah-date-picker .dp-wrap { position: static; }
        #ah-date-picker .dp-trigger {
          border: none;
          background: transparent;
          padding: 0 10px;
          height: 36px;
          border-radius: 0;
        }
        #ah-date-picker .dp-trigger:hover { background: #f0f4ff; }
        #ah-date-picker .dp-display { 
          font-size: 0.87rem;
          font-weight: 600;
          color: #1a1a2e;
          white-space: nowrap;
        }
        #ah-date-picker .dp-calendar {
          left: auto;
          right: 0;
          top: calc(100% + 8px);
        }
      `}</style>
    </>
  );
};

export default AppointmentHeader;
