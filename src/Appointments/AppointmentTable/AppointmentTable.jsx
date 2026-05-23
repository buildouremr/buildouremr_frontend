import useAppointmentTable from "./useAppointmentTable";
import { MdMoreVert, MdSearch } from "react-icons/md";
import PatientDetailPanel from "../PatientDetailPanel/PatientDetailPanel";

const getStatusStyle = (status) => {
  switch (status) {
    case "Waiting":   return { color: "#F59E0B", bg: "#FFF8E8" };
    case "Completed": return { color: "#0D9B5C", bg: "#E8F8F0" };
    case "Cancelled": return { color: "#E74C3C", bg: "#FFE8E8" };
    case "Pending":   return { color: "#2E7DF7", bg: "#E8F0FF" };
    case "No Show":   return { color: "#6b7280", bg: "#f0f2f5" };
    default:          return { color: "#6b7280", bg: "#f0f2f5" };
  }
};

const getTypeStyle = (type) => {
  if (type === "Follow-up" || type === "Follow up")
    return { color: "#0D9B5C", bg: "#E8F8F0" };
  return { color: "#2E7DF7", bg: "#E8F0FF" };
};

const AvatarInitials = ({ name, cls }) => {
  const initials = (name || "")
    .split(" ").slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "").join("");
  return <div className={cls}>{initials}</div>;
};

const SkeletonRow = () => (
  <tr className="at-skeleton-row">
    {[1, 2, 3, 4, 5].map((k) => (
      <td key={k}><div className="at-skel" style={{ width: k === 2 ? 140 : 80 }} /></td>
    ))}
  </tr>
);

const AppointmentTable = () => {
  const {
    filteredAppointments, tabs, tabCounts, activeTab,
    selectedPatient, selectedApptId, loading, detailLoading, error,
    searchQuery,
    handleTabChange, handleSelectPatient, handleClosePanel,
    handleStartConsultation, handleSearchChange,
  } = useAppointmentTable();

  return (
    <>
      <div className={`at-wrapper ${selectedPatient ? "at-with-panel" : ""}`}>
        {/* ── Main table area ── */}
        <div className="at-main">
          {/* Tabs */}
          <div className="at-tabs">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`at-tab ${activeTab === tab ? "at-tab-active" : ""}`}
                onClick={() => handleTabChange(tab)}
              >
                {tab}{tabCounts[tab] > 0 && ` (${tabCounts[tab]})`}
              </button>
            ))}
          </div>

          {/* Queue header with search */}
          <div className="at-queue-header">
            <span className="at-queue-title">In Patients Queue</span>
            <div className="at-search-wrap">
              <MdSearch className="at-search-icon" />
              <input
                type="text"
                className="at-search-input"
                placeholder="Search Patients"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          <div className="at-table-wrap">
            <table className="at-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Patient</th>
                  <th>Type / Issue</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [1, 2, 3, 4, 5].map((k) => <SkeletonRow key={k} />)
                ) : error ? (
                  <tr>
                    <td colSpan={5} className="at-state-cell at-error">⚠ {error}</td>
                  </tr>
                ) : filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="at-state-cell">No appointments found.</td>
                  </tr>
                ) : (
                  filteredAppointments.map((appt, i) => {
                    // API fields: patientId, patientName, status, type, startTime, endTime, reason
                    const statusStyle = getStatusStyle(appt.status);
                    const typeStyle   = getTypeStyle(appt.type);
                    const isSelected  = selectedApptId === appt.patientId;
                    const isFirst     = i === 0;

                    return (
                      <tr
                        key={appt.patientId ?? i}
                        className={`at-row ${isSelected ? "at-row-selected" : ""}`}
                        onClick={() => handleSelectPatient(appt)}
                      >
                        {/* Time */}
                        <td className="at-time-cell">
                          <span
                            className="at-time"
                            style={isFirst ? { color: "#2E7DF7" } : {}}
                          >
                            {appt.startTime}
                          </span>
                          {isFirst && <span className="at-next-badge">Next</span>}
                        </td>

                        {/* Patient — API: patientName */}
                        <td>
                          <div className="at-patient-cell">
                            <AvatarInitials name={appt.patientName} cls="at-avatar" />
                            <div className="at-patient-info">
                              <span className="at-patient-name">{appt.patientName}</span>
                              <span className="at-patient-meta">
                                {appt.patientType && `${appt.patientType}`}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Type / Issue — API: type, reason */}
                        <td>
                          <div className="at-type-cell">
                            <span
                              className="at-type-badge"
                              style={{ color: typeStyle.color, background: typeStyle.bg }}
                            >
                              {appt.type}
                            </span>
                            <span className="at-issue">{appt.reason}</span>
                          </div>
                        </td>

                        {/* Status — API: status */}
                        <td>
                          <div className="at-status-cell">
                            <span
                              className="at-status-badge"
                              style={{ color: statusStyle.color, background: statusStyle.bg }}
                            >
                              {appt.status}
                            </span>
                          </div>
                        </td>

                        {/* Action */}
                        <td onClick={(e) => e.stopPropagation()}>
                          <div className="at-actions-cell">
                            <button
                              className="at-action-btn at-btn-primary"
                              onClick={() => handleStartConsultation(appt)}
                            >
                              Start Consultation
                            </button>
                            <button className="at-more-btn">
                              <MdMoreVert />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Patient Detail Panel ── */}
        {(selectedPatient || detailLoading) && (
          <PatientDetailPanel
            patient={selectedPatient}
            loading={detailLoading}
            onClose={handleClosePanel}
          />
        )}
      </div>

      <style>{`
        .at-wrapper {
          display: flex;
          gap: 0;
          background: #fff;
          border: 1px solid #eef0f5;
          border-radius: 12px;
          margin: 16px 28px 28px 28px;
          overflow: hidden;
        }
        .at-main { flex: 1; min-width: 0; }

        /* ── Tabs ── */
        .at-tabs {
          display: flex;
          border-bottom: 1px solid #eef0f5;
          padding: 0 20px;
        }
        .at-tab {
          padding: 14px 16px;
          border: none;
          background: none;
          font-size: 0.83rem;
          font-weight: 500;
          color: #6b7280;
          cursor: pointer;
          white-space: nowrap;
          border-bottom: 2px solid transparent;
          margin-bottom: -1px;
          transition: all 0.15s;
        }
        .at-tab:hover { color: #2E7DF7; }
        .at-tab-active {
          color: #2E7DF7 !important;
          border-bottom-color: #2E7DF7 !important;
          font-weight: 600;
        }

        /* ── Queue header ── */
        .at-queue-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px 12px 20px;
        }
        .at-queue-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: #1a1a2e;
        }
        .at-search-wrap {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #f8fafc;
          border: 1px solid #e0e4ec;
          border-radius: 8px;
          padding: 7px 12px;
        }
        .at-search-icon { color: #9ca3af; font-size: 1rem; flex-shrink: 0; }
        .at-search-input {
          border: none; background: transparent; outline: none;
          font-size: 0.82rem; color: #1a1a2e; width: 140px;
        }
        .at-search-input::placeholder { color: #9ca3af; }

        /* ── Table ── */
        .at-table-wrap { overflow-x: auto; }
        .at-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.83rem;
        }
        .at-table thead tr { background: #f8fafc; }
        .at-table th {
          padding: 10px 16px;
          text-align: left;
          font-weight: 600;
          font-size: 0.78rem;
          color: #4b5563;
          white-space: nowrap;
        }
        .at-table td {
          padding: 12px 16px;
          border-bottom: 1px solid #f0f2f5;
          vertical-align: middle;
        }
        .at-row { cursor: pointer; transition: background 0.12s; }
        .at-row:hover { background: #fafbfd; }
        .at-row-selected { background: #EEF4FF !important; }
        .at-row-selected td:first-child {
          border-left: 3px solid #2E7DF7;
          padding-left: 13px;
        }
        .at-row:last-child td { border-bottom: none; }

        /* Time cell */
        .at-time-cell { white-space: nowrap; }
        .at-time { display: block; font-weight: 600; color: #1a1a2e; font-size: 0.88rem; }
        .at-next-badge {
          display: inline-block; margin-top: 3px;
          background: #2E7DF7; color: #fff;
          font-size: 0.6rem; font-weight: 700;
          padding: 2px 8px; border-radius: 4px;
        }

        /* Patient cell */
        .at-patient-cell { display: flex; align-items: center; gap: 10px; }
        .at-avatar {
          width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0;
          background: linear-gradient(135deg, #c8d8f8, #d8e8ff);
          color: #2E7DF7; font-size: 0.7rem; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
        }
        .at-patient-info { display: flex; flex-direction: column; gap: 2px; }
        .at-patient-name { font-weight: 600; color: #1a1a2e; white-space: nowrap; font-size: 0.84rem; }
        .at-patient-meta { font-size: 0.72rem; color: #9ca3af; white-space: nowrap; }

        /* Type cell */
        .at-type-cell { display: flex; flex-direction: column; gap: 3px; }
        .at-type-badge {
          display: inline-block; padding: 2px 10px;
          border-radius: 20px; font-size: 0.72rem; font-weight: 600; width: fit-content;
        }
        .at-issue { font-size: 0.77rem; color: #6b7280; }

        /* Status cell */
        .at-status-cell { display: flex; flex-direction: column; gap: 3px; }
        .at-status-badge {
          display: inline-block; padding: 3px 10px;
          border-radius: 6px; font-size: 0.72rem; font-weight: 600; width: fit-content;
        }

        /* Actions */
        .at-actions-cell { display: flex; align-items: center; gap: 8px; white-space: nowrap; min-width: 170px; }
        .at-action-btn {
          padding: 7px 12px; border-radius: 8px; font-size: 0.74rem;
          font-weight: 600; cursor: pointer; transition: all 0.15s;
          border: none; white-space: nowrap;
        }
        .at-btn-primary { background: #EEF4FF; color: #2E7DF7; border: 1px solid #C5D8FF !important; }
        .at-btn-primary:hover { background: #2E7DF7; color: #fff; }
        .at-more-btn {
          width: 30px; height: 30px; border-radius: 6px;
          border: 1px solid #e0e4ec; background: #fff;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #6b7280; font-size: 1.1rem; transition: all 0.15s;
        }
        .at-more-btn:hover { background: #f0f4ff; color: #2E7DF7; }

        /* State cells */
        .at-state-cell { text-align: center; padding: 40px; color: #9ca3af; font-size: 0.85rem; }
        .at-error { color: #E74C3C; }

        /* Skeleton */
        .at-skel {
          height: 12px; border-radius: 6px;
          background: linear-gradient(90deg, #f0f2f5 25%, #e4e7ec 50%, #f0f2f5 75%);
          background-size: 200% 100%;
          animation: at-shimmer 1.4s infinite;
        }
        @keyframes at-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .at-skeleton-row td { padding: 18px 16px; }
      `}</style>
    </>
  );
};

export default AppointmentTable;
