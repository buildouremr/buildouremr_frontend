import usePatientTable from "./usePatientTable";
import { useState, useRef, useCallback } from "react";
import { MdMoreVert, MdSearch, MdOutlineEmail, MdOutlinePhone } from "react-icons/md";
import Pagination from "../../components/Pagination/Pagination";

// Height of a single data row (must match .pt-table td height in CSS below)
const ROW_HEIGHT = 65;
// Minimum rows to always show (prevents an empty-looking table on tiny screens)
const MIN_ROWS = 3;

const AvatarInitials = ({ name, cls }) => {
  const initials = (name || "")
    .split(" ").slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "").join("");
  return <div className={cls}>{initials}</div>;
};

const SkeletonRow = () => (
  <tr className="pt-skeleton-row">
    {[1, 2, 3, 4, 5, 6, 7].map((k) => (
      <td key={k}><div className="pt-skel" style={{ width: k === 2 ? 140 : 80 }} /></td>
    ))}
  </tr>
);

const EmptyRow = () => (
  <tr className="pt-empty-filler-row">
    <td colSpan={7}>&nbsp;</td>
  </tr>
);

const calculateAge = (dobString) => {
  if (!dobString) return "--";
  const dob = new Date(dobString);
  const diff = Date.now() - dob.getTime();
  const ageDate = new Date(diff); 
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

const formatPatientId = (id) => {
  return `PT${String(id).padStart(4, '0')}`;
};

const PatientTable = () => {
  const observerRef = useRef(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const tableBodyRef = useCallback((el) => {
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
    measure();
  }, []);

  const {
    pagePatients, tabs, tabCounts, activeTab,
    loading, error, searchQuery, totalPages, currentPage,
    handleTabChange, handleSearchChange, handlePageChange
  } = usePatientTable({ rowsPerPage });

  const emptyRowCount = loading || error || pagePatients.length === 0
    ? 0
    : Math.max(0, rowsPerPage - pagePatients.length);

  const hasPatients = !loading && !error && pagePatients.length > 0;

  return (
    <>
      <div className="pt-wrapper">
        
        {/* Tabs Container */}
        <div className="pt-tabs-container">
          <div className="pt-tabs">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`pt-tab ${activeTab === tab ? "pt-tab-active" : ""}`}
                onClick={() => handleTabChange(tab)}
              >
                {tab} ({tabCounts[tab] || 0})
              </button>
            ))}
          </div>
        </div>

        {/* Main table area */}
        <div className="pt-main-container">
          <div className="pt-main">
            <div className="pt-queue-header">
              <span className="pt-queue-title">In Patients Queue</span>
              <div className="pt-queue-actions">
                <div className="pt-filter-wrap">
                  <span className="pt-filter-label">Filter by</span>
                  <select className="pt-filter-select">
                    <option value="">All</option>
                  </select>
                </div>
                <div className="pt-search-wrap">
                  <input
                    type="text"
                    className="pt-search-input"
                    placeholder="Search Patients"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                  />
                  <MdSearch className="pt-search-icon" />
                </div>
              </div>
            </div>

            {loading ? (
              <div className="pt-table-wrap pt-table-fixed" ref={tableBodyRef}>
                <table className="pt-table">
                  <thead>
                    <tr>
                      <th>Patient ID</th><th>Patient Details</th><th>Chronic Baseline</th><th>Principle Doctor</th><th>Contact</th><th>Status</th><th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4, 5].map((k) => <SkeletonRow key={k} />)}
                  </tbody>
                </table>
              </div>
            ) : error ? (
              <div className="pt-error-state">
                <span>⚠ {error}</span>
              </div>
            ) : pagePatients.length === 0 ? (
              <div className="pt-table-fixed pt-empty-state">
                <h3 className="pt-empty-title">No patients found.</h3>
              </div>
            ) : (
              <div className="pt-table-wrap pt-table-fixed" ref={tableBodyRef}>
                <table className="pt-table">
                  <thead>
                    <tr>
                      <th>Patient ID</th>
                      <th>Patient Details</th>
                      <th>Chronic Baseline</th>
                      <th>Principle Doctor</th>
                      <th>Contact</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagePatients.map((patient, i) => {
                      const fullName = [patient.patientRegistrationFirstName, patient.patientRegistrationLastName].filter(Boolean).join(" ");
                      const age = calculateAge(patient.patientRegistrationDob);
                      const sex = patient.patientRegistrationSex === 'M' ? 'Male' : (patient.patientRegistrationSex === 'F' ? 'Female' : patient.patientRegistrationSex || '--');
                      const city = patient.patientRegistrationCity || '--';
                      const isChronic = patient.patientRegistrationChronic;
                      const isActive = patient.patientRegistrationActive;
                      
                      return (
                        <tr key={patient.patientRegistrationId ?? i} className="pt-row">
                          <td>
                            <span className="pt-id">{formatPatientId(patient.patientRegistrationId)}</span>
                          </td>
                          <td>
                            <div className="pt-patient-cell">
                              <AvatarInitials name={fullName} cls="pt-avatar" />
                              <div className="pt-patient-info">
                                <span className="pt-patient-name">{fullName}</span>
                                <span className="pt-patient-meta">
                                  {age} Y &bull; {sex} &bull; {city}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td>
                            {isChronic ? (
                              <span className="pt-chronic-badge" style={{ color: '#E74C3C', background: '#FFE8E8' }}>Type-2 Diabetes</span>
                            ) : <span className="pt-chronic-badge" style={{ color: '#6b7280', background: '#f0f2f5' }}>None</span>}
                          </td>
                          <td>
                            <div className="pt-patient-cell">
                              <AvatarInitials name={patient.principalDoctorName || "Unassigned"} cls="pt-avatar-doctor" />
                              <span className="pt-doctor-name">{patient.principalDoctorName || "Unassigned"}</span>
                            </div>
                          </td>
                          <td>
                            <div className="pt-contact-info">
                              <span className="pt-contact-phone">(+91) {patient.patientRegistrationMobileNo || "N/A"}</span>
                              <span className="pt-contact-email">{patient.patientRegistrationEmailId || "--"}</span>
                            </div>
                          </td>
                          <td>
                            <span className="pt-status-badge" style={isActive ? { color: '#0D9B5C', background: '#E8F8F0' } : { color: '#F59E0B', background: '#FFF8E8' }}>
                              {isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td>
                            <div className="pt-actions-cell">
                              <button className="pt-action-btn"><MdOutlineEmail /></button>
                              <button className="pt-action-btn"><MdOutlinePhone /></button>
                              <button className="pt-action-btn"><MdMoreVert /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {Array.from({ length: emptyRowCount }).map((_, i) => (
                      <EmptyRow key={`filler-${i}`} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {hasPatients && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>

      <style>{`
        .pt-wrapper {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin: 0 28px 28px 28px;
          flex: 1;
          overflow: hidden;
          min-height: 0;
        }
        
        .pt-tabs-container {
          background: #fff;
          border-radius: 8px;
          border: 1px solid #eef0f5;
          padding: 0 16px;
          flex-shrink: 0;
        }

        .pt-tabs {
          display: flex;
          gap: 24px;
        }

        .pt-tab {
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
        .pt-tab-active {
          color: #2E7DF7;
          border-bottom-color: #2E7DF7;
        }

        .pt-main-container {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          min-height: 0;
        }
        .pt-main {
          background: #fff;
          border: 1px solid #eef0f5;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          flex: 1;
        }

        .pt-table-fixed {
          flex: 1;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .pt-queue-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          flex-shrink: 0;
        }
        .pt-queue-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1a1a2e;
        }
        .pt-queue-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .pt-filter-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid #e0e4ec;
          border-radius: 8px;
          padding: 6px 12px;
          background: #fff;
        }
        .pt-filter-label {
          font-size: 0.85rem;
          color: #4b5563;
        }
        .pt-filter-select {
          border: none;
          outline: none;
          font-size: 0.85rem;
          color: #1a1a2e;
          font-weight: 500;
          background: transparent;
        }
        .pt-search-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #fff;
          border: 1px solid #e0e4ec;
          border-radius: 8px;
          padding: 7px 12px;
        }
        .pt-search-input {
          border: none; background: transparent; outline: none;
          font-size: 0.85rem; color: #1a1a2e; width: 180px;
        }
        .pt-search-input::placeholder { color: #9ca3af; }
        .pt-search-icon { color: #9ca3af; font-size: 1.1rem; flex-shrink: 0; }

        .pt-table-wrap { 
          overflow-x: auto; 
          overflow-y: hidden; 
          flex: 1; 
          min-height: 0; 
          margin: 0 20px 5px 20px;
          border-radius: 8px;
        }
        .pt-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
        }
        .pt-table thead tr { background: #f4f5f8; }
        .pt-table th {
          padding: 12px 16px;
          text-align: left;
          font-weight: 700;
          font-size: 0.82rem;
          color: #4b5563;
          white-space: nowrap;
        }
        .pt-table td {
          padding: 0 16px;
          height: 65px;
          border-bottom: 1px solid #f0f2f5;
          vertical-align: middle;
          box-sizing: border-box;
        }
        .pt-row { transition: background 0.12s; }
        .pt-row:hover { background: #fafbfd; }
        .pt-row:last-child td { border-bottom: none; }

        .pt-empty-filler-row td {
          height: 65px;
          border-bottom: 1px solid #f0f2f5;
          box-sizing: border-box;
        }
        .pt-empty-filler-row:last-child td { border-bottom: none; }

        .pt-id { font-weight: 500; color: #6b7280; font-size: 0.85rem; }

        .pt-patient-cell { display: flex; align-items: center; gap: 12px; }
        .pt-avatar {
          width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0;
          background: #e8f0ff; color: #2E7DF7; font-size: 0.9rem; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
        }
        .pt-patient-info { display: flex; flex-direction: column; gap: 3px; }
        .pt-patient-name { font-weight: 700; color: #1a1a2e; white-space: nowrap; font-size: 0.9rem; }
        .pt-patient-meta { font-size: 0.75rem; color: #9ca3af; white-space: nowrap; font-weight: 500; }

        .pt-chronic-badge {
          display: inline-block; padding: 4px 10px;
          border-radius: 12px; font-size: 0.75rem; font-weight: 600; white-space: nowrap;
        }

        .pt-avatar-doctor {
          width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0;
          background: #e8f8f0; color: #0D9B5C; font-size: 0.75rem; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
        }
        .pt-doctor-name { font-weight: 600; color: #1a1a2e; font-size: 0.85rem; }

        .pt-contact-info { display: flex; flex-direction: column; gap: 3px; }
        .pt-contact-phone { font-weight: 500; color: #4b5563; font-size: 0.82rem; }
        .pt-contact-email { font-size: 0.75rem; color: #9ca3af; }

        .pt-status-badge {
          display: inline-block; padding: 4px 12px;
          border-radius: 6px; font-size: 0.75rem; font-weight: 700;
        }

        .pt-actions-cell { display: flex; align-items: center; gap: 8px; white-space: nowrap; }
        .pt-action-btn {
          width: 32px; height: 32px; border-radius: 8px;
          border: 1.5px solid #2E7DF7; background: transparent;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #2E7DF7; font-size: 1.1rem; transition: all 0.15s;
        }
        .pt-action-btn:hover { background: #e8f0ff; }

        .pt-empty-state {
          display: flex; align-items: center; justify-content: center;
          padding: 60px 24px; text-align: center;
        }
        .pt-empty-title { font-size: 1.25rem; font-weight: 700; color: #1a1a2e; }

        .pt-error-state {
          display: flex; align-items: center; justify-content: center;
          padding: 48px 24px; color: #E74C3C; font-size: 0.88rem;
        }

        .pt-skel {
          height: 12px; border-radius: 6px;
          background: linear-gradient(90deg, #f0f2f5 25%, #e4e7ec 50%, #f0f2f5 75%);
          background-size: 200% 100%; animation: pt-shimmer 1.4s infinite;
        }
        @keyframes pt-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .pt-skeleton-row td { padding: 18px 16px; }
        .pt-skeleton-row:last-child td { border-bottom: none; }
      `}</style>
    </>
  );
};

export default PatientTable;
