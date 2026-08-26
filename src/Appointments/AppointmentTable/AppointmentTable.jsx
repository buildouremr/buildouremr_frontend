import useAppointmentTable from "./useAppointmentTable";
import { useState, useRef, useEffect, useCallback } from "react";

import Pagination from "../../components/Pagination/Pagination";
import { MoreVertical, Search, Calendar } from 'lucide-react';

// Height of a single data row (must match .at-table td height in CSS below)
const ROW_HEIGHT = 57;
// Minimum rows to always show (prevents an empty-looking table on tiny screens)
const MIN_ROWS = 3;

const getStatusStyle = (status) => {
  switch (status) {
    case "Waiting": return { color: "#F59E0B", bg: "#FFF8E8" };
    case "Completed": return { color: "#0D9B5C", bg: "#E8F8F0" };
    case "Cancelled": return { color: "#E74C3C", bg: "#FFE8E8" };
    case "Pending": return { color: "#2E7DF7", bg: "#E8F0FF" };
    case "No Show": return { color: "#6b7280", bg: "#f0f2f5" };
    default: return { color: "#6b7280", bg: "#f0f2f5" };
  }
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

const AppointmentTable = ({ selectedDate, currentPage, onPageChange, onNextDay, externalActiveTab, refreshKey, onOpenChart }) => {
  // ── Dynamic row count based on container height ──────────────────────
  const observerRef = useRef(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Callback ref: re-attaches ResizeObserver each time the observed div changes
  const tableBodyRef = useCallback((el) => {
    // Disconnect previous observer
    if (observerRef.current) { observerRef.current.disconnect(); observerRef.current = null; }
    if (!el) return;
    const measure = () => {
      const theadHeight = el.querySelector("thead")?.offsetHeight || 45;
      const available = el.offsetHeight - theadHeight;
      const rows = Math.max(MIN_ROWS, Math.floor(available / ROW_HEIGHT));
      setRowsPerPage(rows);
    };
    const obs = new ResizeObserver(measure);
    obs.observe(el);
    observerRef.current = obs;
    measure(); // Initial measurement
  }, []);

  const {
    pageAppointments, tabs, tabCounts, activeTab,
    loading, error,
    searchQuery, totalPages,
    handleTabChange,
    handleSearchChange,
    fetchAppointments,
  } = useAppointmentTable({ selectedDate, currentPage, onPageChange, externalActiveTab, rowsPerPage });

  // Re-fetch whenever parent increments refreshKey after booking
  useEffect(() => {
    if (refreshKey && refreshKey > 0) fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  const hasAppointments = !loading && !error && pageAppointments.length > 0;

  return (
    <>
      <div className="at-wrapper">
        {/* Tabs Container */}
        <div className="at-tabs-container">
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
        </div>

        {/* ── Main table area ── */}
        <div className="at-main-container">
          <div className="at-main">

            {/* Queue header — search only shown when there are appointments */}
            <div className="at-queue-header">
              <span className="at-queue-title">In Patients Queue</span>
              {hasAppointments && (
                <div className="at-search-wrap">
                  <input
                    type="text"
                    className="at-search-input"
                    placeholder="Search Patients"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                  />
                  <Search className="at-search-icon" />
                </div>
              )}
            </div>

            {/* Content: skeleton | error | table (with empty-state inside fixed area) */}
            {loading ? (
              <div className="at-table-wrap at-table-fixed" ref={tableBodyRef}>
                <table className="at-table">
                  <colgroup>
                    <col style={{ width: "100px" }} />
                    <col style={{ width: "160px" }} />
                    <col style={{ width: "150px" }} />
                    <col style={{ width: "140px" }} />
                    <col style={{ width: "150px" }} />
                    <col style={{ width: "100px" }} />
                    <col style={{ width: "180px" }} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th>Time</th><th>Patient</th><th>Principle Doctor</th><th>Type / Issue</th><th>Chief Complaint</th><th>Status</th><th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4, 5].map((k) => <SkeletonRow key={k} />)}
                  </tbody>
                </table>
              </div>
            ) : error ? (
              <div className="at-error-state">
                <span>Error: {error}</span>
              </div>
            ) : pageAppointments.length === 0 ? (
              <div className="at-table-fixed at-empty-state">
                <h3 className="at-empty-title">
                  {activeTab === "Pending" ? "You're all caught up!" :
                    activeTab === "Completed" ? "Ready for your first patient today" :
                      activeTab === "Cancelled" ? "No cancellations today" :
                        activeTab === "No Show" ? "Perfect attendance today!" :
                          "You're all caught up!"}
                </h3>
                <p className="at-empty-subtitle">
                  {activeTab === "Pending" ? "No patients are waiting at the moment. Great job keeping up with your schedule." :
                    activeTab === "Completed" ? "Once you complete an active appointment from your queue, the consultation summary details will appear here." :
                      activeTab === "Cancelled" ? "All scheduled appointments are currently active in your queue." :
                        activeTab === "No Show" ? "Every scheduled patient has successfully attended their session or cancelled ahead of time. No missed appointments recorded." :
                          "No patients are waiting at the moment. Great job keeping up with your schedule."}
                </p>
                <button
                  className="at-empty-btn"
                  onClick={() => {
                    if (activeTab === "Pending" || activeTab === "All Appointments") {
                      if (onNextDay) onNextDay();
                    } else {
                      handleTabChange("Pending");
                    }
                  }}
                >
                  <Calendar style={{ fontSize: "1.1rem" }} />
                  {activeTab === "Pending" || activeTab === "All Appointments" ? "View next day's schedule" :
                    activeTab === "Completed" ? "View Patients in queue" :
                      "View Pending Appointments"}
                </button>
              </div>
            ) : (
              <div className="at-table-wrap at-table-fixed" ref={tableBodyRef}>
                <table className="at-table">
                  <colgroup>
                    <col style={{ width: "100px" }} />
                    <col style={{ width: "160px" }} />
                    <col style={{ width: "150px" }} />
                    <col style={{ width: "140px" }} />
                    <col style={{ width: "150px" }} />
                    <col style={{ width: "100px" }} />
                    <col style={{ width: "180px" }} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Patient</th>
                      <th>Principle Doctor</th>
                      <th>Type / Issue</th>
                      <th>Chief Complaint</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageAppointments.map((appt, i) => {
                      const statusStyle = getStatusStyle(appt.status);
                      const typeStyle = (appt.type === "Follow-up" || appt.type === "Follow up")
                        ? { color: "#0D9B5C", bg: "#E8F8F0" }
                        : { color: "#2E7DF7", bg: "#E8F0FF" };
                      // Highlight the first row as 'Next'
                      const isNext = i === 0;

                      return (
                        <tr
                          key={appt.apptId ?? i}
                          className={`at-row ${isNext ? "at-row-selected" : ""}`}
                          onClick={() => {
                            if (onOpenChart) onOpenChart(appt.patientId, appt.apptId);
                          }}
                        >
                          {/* Time */}
                          <td className="at-time-cell">
                            <div className={`at-time-wrap ${isNext ? "at-time-selected" : ""}`}>
                              <span className="at-time" style={isNext ? { color: "#2E7DF7" } : {}}>
                                {appt.startTime}
                              </span>
                              {isNext && <span className="at-next-badge">Next</span>}
                            </div>
                          </td>

                          {/* Patient */}
                          <td>
                            <div className="at-patient-cell">
                              <AvatarInitials name={appt.patientName} cls="at-avatar" />
                              <div className="at-patient-info">
                                <span className="at-patient-name">{appt.patientName}</span>
                                <span className="at-patient-meta">
                                  {appt.patientType || "New"}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Principle Doctor */}
                          <td>
                            <div className="at-doctor-cell">
                              <AvatarInitials name={appt.providerName} cls="at-doctor-avatar" />
                              <div className="at-patient-info">
                                <span className="at-patient-name" style={{ fontSize: "0.82rem" }}>{appt.providerName || "—"}</span>
                              </div>
                            </div>
                          </td>

                          {/* Type / Issue */}
                          <td>
                            <div className="at-type-cell">
                              {appt.type && appt.type !== "" ? (
                                <span
                                  className="at-type-text"
                                  style={{ color: typeStyle.color, background: typeStyle.bg }}
                                >
                                  {appt.type}
                                </span>
                              ) : (
                                <span style={{ color: "#9ca3af" }}>--</span>
                              )}
                            </div>
                          </td>

                          {/* Chief Complaint */}
                          <td>
                            <span className="at-issue">{appt.reason || "—"}</span>
                          </td>

                          {/* Status */}
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
                                className="at-action-btn at-btn-solid"
                                onClick={() => {
                                  if (onOpenChart) onOpenChart(appt.patientId, appt.apptId);
                                }}
                              >
                                Start Consultation
                              </button>
                              <button className="at-more-btn">
                                <MoreVertical />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination — always shown when there are appointments */}
            {!loading && !error && hasAppointments && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            )}
          </div>
        </div>
      </div>

      <style>{`
        .at-wrapper {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin: 16px 28px 28px 28px;
          flex: 1;
          overflow: hidden;
          min-height: 0;
        }
        .at-main-container {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          min-height: 0;
        }
        .at-main {
          background: #fff;
          border: 1px solid #eef0f5;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          flex: 1;
        }

        /* Table area fills remaining height — no fixed min-height */
        .at-table-fixed {
          flex: 1;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        /* ── Tabs ── */
        .at-tabs-container {
          background: #fff;
          border-radius: 8px;
          border: 1px solid #eef0f5;
          padding: 0 16px;
          flex-shrink: 0;
        }
        .at-tabs {
          display: flex;
          gap: 24px;
        }
        .at-tab {
          padding: 16px 0;
          border: none;
          background: none;
          font-size: 0.95rem;
          font-weight: 600;
          color: #1a1a2e;
          cursor: pointer;
          white-space: nowrap;
          border-bottom: 3px solid transparent;
          margin-bottom: -1px;
          transition: all 0.15s;
        }
        .at-tab:hover { color: #2E7DF7; }
        .at-tab-active {
          color: #2E7DF7 !important;
          border-bottom-color: #2E7DF7 !important;
        }

        /* ── Queue header ── */
        .at-queue-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px 12px 20px;
          flex-shrink: 0;
        }
        .at-queue-title {
          font-size: 0.95rem;
          font-weight: 600;
          color: #1a1a2e;
        }
        .at-search-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #fff;
          border: 1px solid #e0e4ec;
          border-radius: 8px;
          padding: 7px 12px;
        }
        .at-search-icon { color: #9ca3af; font-size: 1.1rem; flex-shrink: 0; }
        .at-search-input {
          border: none; background: transparent; outline: none;
          font-size: 0.85rem; color: #1a1a2e; width: 180px;
        }
        .at-search-input::placeholder { color: #9ca3af; }

        /* ── Table ── */
        .at-table-wrap { 
          overflow-x: auto; 
          overflow-y: hidden; 
          flex: 1; 
          min-height: 0; 
          margin: 0 20px 5px 20px;
          border: 1px solid #e0e4ec;
          border-radius: 8px;
        }
        .at-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
          table-layout: fixed;
        }
        .at-table thead tr { background: #f8fafc; }
        .at-table th {
          padding: 12px 16px;
          text-align: left;
          font-weight: 600;
          font-size: 14px;
          color: #4b5563;
          white-space: nowrap;
        }
        .at-table td {
          padding: 0 16px;
          height: 57px;
          border-bottom: 1px solid #f0f2f5;
          vertical-align: middle;
          box-sizing: border-box;
        }
        .at-row { cursor: pointer; transition: background 0.12s; }
        .at-row:hover { background: #fafbfd; }
        .at-row-selected { background: #f4f8ff !important; }
        .at-row:last-child td { border-bottom: none; }

        /* Filler rows */
        .at-empty-filler-row td {
          height: 57px;
          border-bottom: 1px solid #f0f2f5;
          box-sizing: border-box;
        }
        .at-empty-filler-row:last-child td { border-bottom: none; }

        /* Time cell */
        .at-time-cell { white-space: nowrap; padding-left: 10px !important; }
        .at-time-wrap {
          border-left: 3px solid transparent;
          padding-left: 12px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .at-time-selected {
          border-left-color: #2E7DF7;
        }
        .at-time { display: block; font-weight: 600; color: #1a1a2e; font-size: 0.88rem; }
        .at-next-badge {
          display: inline-block; margin-top: 3px;
          background: #2E7DF7; color: #fff;
          font-size: 0.6rem; font-weight: 600;
          padding: 2px 8px; border-radius: 4px;
        }

        /* Patient cell */
        .at-patient-cell { display: flex; align-items: center; gap: 10px; }
        .at-avatar {
          width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
          background: #e8f0ff;
          color: #2E7DF7; font-size: 0.8rem; font-weight: 600;
          display: flex; align-items: center; justify-content: center;
        }
        /* Doctor cell */
        .at-doctor-cell { display: flex; align-items: center; gap: 8px; }
        .at-doctor-avatar {
          width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
          background: #F0FDF4;
          color: #059669; font-size: 0.72rem; font-weight: 600;
          display: flex; align-items: center; justify-content: center;
        }
        .at-patient-info { display: flex; flex-direction: column; gap: 2px; }
        .at-patient-name { font-weight: 600; color: #1a1a2e; white-space: nowrap; font-size: 0.85rem; }
        .at-patient-meta { font-size: 0.75rem; color: #6b7280; white-space: nowrap; }

        /* Type cell */
        .at-type-cell { display: flex; flex-direction: column; gap: 2px; }
        .at-type-text {
          font-size: 0.78rem; font-weight: 600; width: fit-content;
          padding: 3px 8px; border-radius: 6px; display: inline-block;
        }
        .at-issue { font-size: 0.75rem; color: #6b7280; }

        /* Status cell */
        .at-status-cell { display: flex; flex-direction: column; gap: 3px; }
        .at-status-badge {
          display: inline-block; padding: 3px 10px;
          border-radius: 6px; font-size: 0.75rem; font-weight: 600; width: fit-content;
        }

        /* Actions */
        .at-actions-cell { display: flex; align-items: center; gap: 8px; white-space: nowrap; min-width: 170px; }
        .at-action-btn {
          padding: 6px 14px; border-radius: 6px; font-size: 0.75rem;
          font-weight: 600; cursor: pointer; transition: all 0.15s;
          white-space: nowrap;
        }
        .at-btn-solid { 
          background: #2E7DF7; 
          color: #fff; 
          border: none; 
        }
        .at-btn-solid:hover { background: #1b63cc; }
        .at-more-btn {
          width: 30px; height: 30px; border-radius: 6px;
          border: 1px solid #e0e4ec; background: #fff;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #6b7280; font-size: 1.1rem; transition: all 0.15s;
        }
        .at-more-btn:hover { background: #f0f4ff; color: #2E7DF7; }

        /* ── Empty state ── */
        .at-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 40px 14px;
          flex: 1;
        }
        .at-empty-title {
          font-size: 1.5rem;
          color: #1a1a2e;
          font-weight: 600;
          margin: 0 0 10px 0;
        }
        .at-empty-subtitle {
          color: #9ca3af;
          font-size: 1rem;
          font-weight: 400;
          margin: 0 0 20px 0;
        }
        .at-empty-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #2E7DF7;
          color: #fff;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .at-empty-btn:hover { background: #2264cc; }
        .at-error-state {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 24px;
          color: #E74C3C;
          font-size: 0.88rem;
        }

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
        .at-skeleton-row:last-child td { border-bottom: none; }
      `}</style>
    </>
  );
};

export default AppointmentTable;
