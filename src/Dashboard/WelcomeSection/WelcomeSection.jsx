import { useRef } from "react";
import useWelcomeSection from "./useWelcomeSection";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

const WelcomeSection = ({ summaryData, summaryLoading, selectedDate, onDateChange }) => {
  const { doctorName, visitCount, formattedDate } =
    useWelcomeSection(summaryData, summaryLoading, selectedDate);

  const dateInputRef = useRef(null);

  const handlePrev = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() - 1);
    onDateChange(next);
  };

  const handleNext = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    onDateChange(next);
  };

  const handleDateInput = (e) => {
    if (!e.target.value) return;
    const [year, month, day] = e.target.value.split("-").map(Number);
    onDateChange(new Date(year, month - 1, day));
  };

  return (
    <>
      <div className="ws-container">
        <div className="ws-left">
          <h1 className="ws-title">Welcome, {doctorName}</h1>
          <p className="ws-subtitle">
            You have {visitCount} visits for this day,{" "}
            <span className="ws-view-more">View More</span>
          </p>
        </div>

        {/* Date Navigator — same style as AppointmentHeader */}
        <div className="ws-date-nav" onClick={() => dateInputRef.current?.showPicker()}>
          <button
            className="ws-nav-btn"
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
          >
            <MdChevronLeft />
          </button>
          <span className="ws-date-label">{formattedDate}</span>
          <button
            className="ws-nav-btn"
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
          >
            <MdChevronRight />
          </button>
          <input
            type="date"
            ref={dateInputRef}
            className="ws-hidden-date"
            onChange={handleDateInput}
          />
        </div>
      </div>

      <style>{`
        .ws-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 28px 16px 28px;
        }
        .ws-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a1a2e;
          margin: 0;
        }
        .ws-subtitle {
          font-size: 0.9rem;
          color: #6b7280;
          margin: 6px 0 0 0;
        }
        .ws-view-more {
          color: #2E7DF7;
          font-weight: 600;
          cursor: pointer;
        }
        .ws-view-more:hover {
          text-decoration: underline;
        }

        /* Date navigator */
        .ws-date-nav {
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
        .ws-nav-btn {
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
        .ws-nav-btn:hover { background: #f0f4ff; color: #2E7DF7; }
        .ws-date-label {
          padding: 0 14px;
          font-size: 0.87rem;
          font-weight: 600;
          color: #1a1a2e;
          white-space: nowrap;
          border-left: 1px solid #e0e4ec;
          border-right: 1px solid #e0e4ec;
          line-height: 34px;
        }
        .ws-hidden-date {
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

export default WelcomeSection;
