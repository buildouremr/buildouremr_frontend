import usePatientQueue from "./usePatientQueue";

import Pagination from "../../components/Pagination/Pagination";
import { User, Calendar } from 'lucide-react';

const MAX_ROWS = 5;

const PatientQueue = ({ selectedDate, onViewAll }) => {
  const {
    patients, loading, error, handleViewAll,
    currentPage, totalPages, handlePageChange
  } = usePatientQueue(selectedDate, onViewAll);

  const getTypeStyle = (type) => {
    if (type === "Reg") return { background: "#FFE8E8", color: "#E74C3C" };
    return { background: "#E8F0FF", color: "#2E7DF7" };
  };

  const displayPatients = patients.slice(0, MAX_ROWS);
  const emptyRowCount = Math.max(0, MAX_ROWS - displayPatients.length);

  return (
    <>
      <div className="pq-container">
        <div className="pq-header">
          <h2 className="pq-title">In Patients Queue</h2>
          {patients.length > 0 && (
            <span className="pq-view-all" onClick={handleViewAll}>View All</span>
          )}
        </div>

        {loading ? (
          /* Fixed-height skeleton area */
          <div className="pq-fixed-area pq-state-wrapper">
            <span className="pq-loading-dot" />
            <span className="pq-loading-dot" />
            <span className="pq-loading-dot" />
          </div>
        ) : error ? (
          <div className="pq-fixed-area pq-state-wrapper pq-error-cell">Error: {error}</div>
        ) : patients.length === 0 ? (
          /* Empty state still takes fixed height */
          <div className="pq-fixed-area pq-empty-state">
            <div className="pq-empty-icon">
              <Calendar style={{ fontSize: "1.6rem", color: "#fff" }} />
            </div>
            <h3 className="pq-empty-title">You're all caught up!</h3>
            <p className="pq-empty-text">
              No patients are waiting at the moment. Great job keeping up with your schedule.
            </p>
            <button className="pq-empty-btn" onClick={handleViewAll}>
              View next day's schedule
            </button>
          </div>
        ) : (
          /* Fixed-height table area — always shows 10 row slots */
          <div className="pq-fixed-area pq-table-wrapper">
            <table className="pq-table">
              <colgroup>
                <col style={{ width: "80px" }} />
                <col style={{ width: "160px" }} />
                <col style={{ width: "120px" }} />
                <col style={{ width: "160px" }} />
                <col style={{ width: "100px" }} />
                <col style={{ width: "80px" }} />
                <col style={{ width: "140px" }} />
                <col style={{ width: "180px" }} />
              </colgroup>
              <thead>
                <tr>
                  <th>Patient ID</th>
                  <th>Patient Name</th>
                  <th>Session Type</th>
                  <th>Doctor Name</th>
                  <th>Status</th>
                  <th>PT Type</th>
                  <th>Date &amp; Time</th>
                  <th>Case Details</th>
                </tr>
              </thead>
              <tbody>
                {displayPatients.map((p, i) => (
                  <tr key={i}>
                    <td className="pq-id">{p.id}</td>
                    <td>
                      <div className="pq-name-cell">
                        <div className="pq-avatar">
                          <User style={{ fontSize: "1rem", color: "#6b7280" }} />
                        </div>
                        {p.name}
                      </div>
                    </td>
                    <td>{p.sessionType}</td>
                    <td>
                      <div className="pq-name-cell">
                        <div className="pq-avatar pq-avatar-doc">
                          <User style={{ fontSize: "1rem", color: "#2E7DF7" }} />
                        </div>
                        {p.doctorName}
                      </div>
                    </td>
                    <td>
                      <span className="pq-status-badge">{p.status}</span>
                    </td>
                    <td>
                      <span className="pq-type-badge" style={getTypeStyle(p.ptType)}>
                        {p.ptType}
                      </span>
                    </td>
                    <td className="pq-datetime">{p.dateTime}</td>
                    <td className="pq-case">{p.caseDetails}</td>
                  </tr>
                ))}
                {/* Filler rows to maintain fixed height for 10 slots */}
                {Array.from({ length: emptyRowCount }).map((_, i) => (
                  <tr key={`filler-${i}`}>
                    <td colSpan={8} className="pq-empty-row-cell">&nbsp;</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination — show whenever there is at least 1 record */}
        {!loading && !error && patients.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      <style>{`
        .pq-container {
          background: #fff;
          border-radius: 12px;
          margin: 0 28px 20px 28px;
          border: 1px solid #eef0f5;
          overflow: hidden;
        }
        .pq-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 22px 12px 22px;
        }
        .pq-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: #1a1a2e;
          margin: 0;
        }
        .pq-view-all {
          font-size: 0.85rem;
          color: #374151;
          cursor: pointer;
          font-weight: 500;
          border: 1px solid #eef0f5;
          padding: 6px 14px;
          border-radius: 6px;
          transition: all 0.2s ease;
        }
        .pq-view-all:hover {
          color: #2E7DF7;
          border-color: #2E7DF7;
        }

        /* Fixed-height content area — always tall enough for 5 rows */
        .pq-fixed-area {
          min-height: 280px;
        }

        .pq-table-wrapper {
          overflow-x: auto;
          margin: 0 22px;
          border: 1px solid #e0e4ec;
          border-radius: 8px;
        }
        .pq-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.82rem;
          table-layout: fixed;
        }
        .pq-table thead tr {
          background: #f0f4fa;
        }
        .pq-table th {
          padding: 12px 14px;
          text-align: left;
          font-weight: 600;
          color: #1a1a2e;
          white-space: nowrap;
          font-size: 0.8rem;
        }
        .pq-table td {
          padding: 0 14px;
          height: 53px;
          border-bottom: 1px solid #f0f2f5;
          color: #374151;
          vertical-align: middle;
          box-sizing: border-box;
        }
        .pq-table tbody tr:hover {
          background: #fafbfd;
        }
        .pq-table tbody tr:last-child td {
          border-bottom: none;
        }
        .pq-id {
          font-weight: 500;
          color: #1a1a2e;
        }
        .pq-name-cell {
          display: flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
        }
        .pq-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #f0f2f5;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .pq-avatar-doc {
          background: #e8f0ff;
        }
        .pq-status-badge {
          background: #E8F8F0;
          color: #0D9B5C;
          padding: 4px 14px;
          border-radius: 20px;
          font-size: 0.78rem;
          font-weight: 500;
        }
        .pq-type-badge {
          padding: 3px 12px;
          border-radius: 20px;
          font-size: 0.78rem;
          font-weight: 600;
        }
        .pq-datetime {
          white-space: nowrap;
          font-size: 0.78rem;
          color: #6b7280;
        }
        .pq-case {
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #6b7280;
          font-size: 0.8rem;
        }
        .pq-error-cell {
          color: #E74C3C;
        }
        .pq-loading-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          margin: 0 4px;
          border-radius: 50%;
          background: #2E7DF7;
          animation: pq-bounce 1.2s infinite ease-in-out;
        }
        .pq-loading-dot:nth-child(2) { animation-delay: 0.2s; }
        .pq-loading-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes pq-bounce {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
          40%            { transform: scale(1);   opacity: 1;   }
        }
        .pq-empty-row-cell {
          height: 53px;
          border-bottom: 1px solid #f0f2f5;
          box-sizing: border-box;
        }
        .pq-state-wrapper {
          text-align: center;
          padding: 80px 14px;
          color: #9ca3af;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pq-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 40px 14px;
        }
        .pq-empty-icon {
          width: 48px;
          height: 48px;
          background: #34d399;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }
        .pq-empty-title {
          font-size: 1.5rem;
          color: #1a1a2e;
          font-weight: 700;
          margin: 0 0 10px 0;
        }
        .pq-empty-text {
          color: #9ca3af;
          font-size: 1rem;
          margin: 0 0 20px 0;
        }
        .pq-empty-btn {
          background: #2E7DF7;
          color: #fff;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .pq-empty-btn:hover { background: #2264cc; }
      `}</style>
    </>
  );
};

export default PatientQueue;
