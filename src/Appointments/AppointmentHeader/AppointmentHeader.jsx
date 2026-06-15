import { useRef } from "react";
import useAppointmentHeader from "./useAppointmentHeader";
import { MdChevronLeft, MdChevronRight, MdAdd } from "react-icons/md";

const AppointmentHeader = ({ selectedDate, onDateChange, onNewAppointment }) => {
  const {
    formattedDate,
    handlePrev, handleNext,
    handleNewAppointment,
    handleDateChange,
  } = useAppointmentHeader({ selectedDate, onDateChange, onNewAppointment });

  const dateInputRef = useRef(null);

  return (
    <>
      <div className="ah-container">
        <h1 className="ah-title">Appointments</h1>
        <div className="ah-right">
          <button className="ah-new-btn" onClick={handleNewAppointment}>
            <MdAdd style={{ fontSize: "1.1rem" }} />
            <span>New Appointment</span>
          </button>

          {/* Date Navigator */}
          <div className="ah-date-nav" onClick={() => dateInputRef.current?.showPicker()}>
            <button
              className="ah-nav-btn"
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            >
              <MdChevronLeft />
            </button>
            <span className="ah-date-label">{formattedDate}</span>
            <button
              className="ah-nav-btn"
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
            >
              <MdChevronRight />
            </button>
            <input
              type="date"
              ref={dateInputRef}
              className="ah-hidden-date"
              onChange={(e) => handleDateChange(e.target.value)}
            />
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
        .ah-date-nav {
          display: flex;
          align-items: center;
          gap: 0;
          border: 1px solid #e0e4ec;
          border-radius: 8px;
          overflow: hidden;
          background: #fff;
          cursor: pointer;
          position: relative;
        }
        .ah-nav-btn {
          width: 32px;
          height: 34px;
          border: none;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1.15rem;
          color: #4b5563;
          transition: background 0.15s;
        }
        .ah-nav-btn:hover { background: #f0f4ff; color: #2E7DF7; }
        .ah-date-label {
          padding: 0 14px;
          font-size: 0.87rem;
          font-weight: 600;
          color: #1a1a2e;
          white-space: nowrap;
          border-left: 1px solid #e0e4ec;
          border-right: 1px solid #e0e4ec;
          line-height: 34px;
        }
        .ah-hidden-date {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
          pointer-events: none;
        }
      `}</style>
    </>
  );
};

export default AppointmentHeader;
