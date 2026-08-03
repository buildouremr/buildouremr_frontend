import useWelcomeSection from "./useWelcomeSection";
import DatePicker from "../../components/DatePicker/DatePicker";
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

const WelcomeSection = ({ summaryData, summaryLoading, selectedDate, onDateChange, onViewAll }) => {
  const { doctorName, visitCount, formattedDate } =
    useWelcomeSection(summaryData, summaryLoading, selectedDate);

  const toISO = (d) => {
    if (!d) return "";
    const dt = d instanceof Date ? d : new Date(d);
    if (isNaN(dt)) return "";
    return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
  };

  const handlePickerChange = (isoStr) => {
    if (!isoStr) return;
    const d = new Date(isoStr);
    d.setHours(0, 0, 0, 0);
    onDateChange(d);
  };

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

  return (
    <>
      <div className="ws-container">
        <div className="ws-left">
          <h1 className="ws-title">Welcome, {doctorName}</h1>
          <p className="ws-subtitle">
            Today you have {visitCount} visits,{" "}
            <span className="ws-view-more" onClick={onViewAll}>View More</span>
          </p>
        </div>

        <div className="ws-right">
          <button className="ws-create-btn">
            <Plus style={{ fontSize: "1.1rem" }} />
            <span>Create Appointment</span>
          </button>

          <div className="ws-date-nav">
            <button
              className="ws-nav-btn"
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            >
              <ChevronLeft />
            </button>
            <div className="ws-picker-wrap">
              <DatePicker
                value={toISO(selectedDate)}
                onChange={handlePickerChange}
                id="ws-date-picker"
                customDisplay={formattedDate}
                hideIcon={true}
              />
            </div>
            <button
              className="ws-nav-btn"
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
            >
              <ChevronRight />
            </button>
          </div>
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

        .ws-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .ws-create-btn {
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
        .ws-create-btn:hover {
          background: #1b65d4;
        }

        .ws-date-nav {
          display: flex;
          align-items: center;
          gap: 0;
          border: 1px solid #e0e4ec;
          border-radius: 8px;
          overflow: visible;
          background: #fff;
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
        .ws-picker-wrap {
          display: flex;
          align-items: center;
          border-left: 1px solid #e0e4ec;
          border-right: 1px solid #e0e4ec;
          position: relative;
        }
        
        #ws-date-picker .dp-wrap { position: static; }
        #ws-date-picker .dp-trigger {
          border: none;
          background: transparent;
          padding: 0 10px;
          height: 34px;
          border-radius: 0;
        }
        #ws-date-picker .dp-trigger:hover { background: #f0f4ff; }
        #ws-date-picker .dp-display { 
          font-size: 0.87rem;
          font-weight: 600;
          color: #1a1a2e;
          white-space: nowrap;
        }
        #ws-date-picker .dp-calendar {
          left: auto;
          right: 0;
          top: calc(100% + 8px);
        }
      `}</style>
    </>
  );
};

export default WelcomeSection;
