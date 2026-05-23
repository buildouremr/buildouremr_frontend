import useWelcomeSection from "./useWelcomeSection";

const WelcomeSection = ({ summaryData, summaryLoading }) => {
  const { doctorName, visitCount, filterOptions, activeFilter, handleFilterChange } =
    useWelcomeSection(summaryData, summaryLoading);

  return (
    <>
      <div className="ws-container">
        <div className="ws-left">
          <h1 className="ws-title">Welcome, {doctorName}</h1>
          <p className="ws-subtitle">
            Today you have {visitCount} visits,{" "}
            <span className="ws-view-more">View More</span>
          </p>
        </div>
        <div className="ws-filters">
          {filterOptions.map((filter) => (
            <button
              key={filter}
              className={`ws-filter-btn ${activeFilter === filter ? "ws-filter-active" : ""}`}
              onClick={() => handleFilterChange(filter)}
            >
              {filter}
            </button>
          ))}
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
        .ws-filters {
          display: flex;
          gap: 0;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          overflow: hidden;
        }
        .ws-filter-btn {
          padding: 8px 16px;
          border: none;
          background: #fff;
          color: #6b7280;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border-right: 1px solid #e0e0e0;
        }
        .ws-filter-btn:last-child {
          border-right: none;
        }
        .ws-filter-btn:hover {
          background: #f0f4ff;
        }
        .ws-filter-active {
          background: #2E7DF7 !important;
          color: #fff !important;
        }
      `}</style>
    </>
  );
};

export default WelcomeSection;
