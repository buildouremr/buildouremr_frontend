import React, { useState } from "react";
import { usePatientProfile, createEncounter } from "./PatientProfile";
import "./PatientProfile.css";

// SVG Icons
const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const AlertTriangleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.00008 1.16666L1.16675 11.0833H12.8334L7.00008 1.16666Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 5.25V7.58333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 9.91666V9.975" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const FileTextIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.16667 1.16666H4.08333C3.43899 1.16666 2.91667 1.68899 2.91667 2.33333V11.6667C2.91667 12.311 3.43899 12.8333 4.08333 12.8333H9.91667C10.561 12.8333 11.0833 12.311 11.0833 11.6667V4.08333L8.16667 1.16666Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ExpandIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 2H14V6M6 14H2V10M14 2L9.33333 6.66667M2 14L6.66667 9.33333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const StethoscopeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 10V8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8V10C8 13.3137 10.6863 16 14 16C17.3137 16 20 13.3137 20 10V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 16V20M12 20H15M9 20H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DocumentHeartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 2V5M16 2V5M3 8H21M5 4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10.5 14L12 15.5L15 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const AlertCircleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PatientProfile = ({ patientId, appointmentId, onBack, onOpenNotes }) => {
  const { patientData, loading, tabs } = usePatientProfile(patientId);
  const [isCreatingVisit, setIsCreatingVisit] = useState(false);

  if (loading || !patientData) {
    return <div className="flex items-center justify-center h-screen text-gray-500">Loading Patient Profile...</div>;
  }

  const handleCreateVisit = async () => {
    setIsCreatingVisit(true);
    // Ideally extract numeric ID from PT-9081 or pass the actual DB ID.
    // For now, if patientId is not a number, we might need a workaround. Assuming patientId is the DB ID (e.g., 1)
    const dbPatientId = typeof patientId === 'number' ? patientId : 1; 
    
    const res = await createEncounter(dbPatientId);
    setIsCreatingVisit(false);
    
    if (res && res.status === "SUCCESS") {
      onOpenNotes(patientId, res.data.encounterId);
    } else {
      alert("Failed to create encounter");
    }
  };

  const { header, alerts, vitals, tables, clinicalJourney } = patientData;

  return (
    <div className="patient-profile-container">
      {/* HEADER SECTION */}
      <div className="pp-header">
        <div className="pp-header-left">
          <button className="pp-back-btn" onClick={onBack}>
            <BackIcon />
          </button>
          
          <img 
            className="pp-avatar" 
            src="https://randomuser.me/api/portraits/women/44.jpg" 
            alt="Patient Avatar" 
          />
          
          <div className="pp-patient-info">
            <div className="pp-name-row">
              <h2 className="pp-name">{header.name}</h2>
              <div className="pp-status">
                <span className="pp-status-dot"></span>
                {header.status}
              </div>
            </div>
            
            <div className="pp-details-row">
              <span className="pp-badge">ID: {header.id}</span>
              <span className="pp-badge">
                <span className="pp-gender-icon">♀</span> {header.gender}
              </span>
              <span>{header.age}</span>
              <span>Dob: {header.dob}</span>
            </div>
          </div>
        </div>

        <div className="pp-header-right">
          <button 
            className="create-visit-btn" 
            onClick={handleCreateVisit}
            disabled={isCreatingVisit}
            style={{ marginBottom: '16px', background: '#2563eb', color: 'white', padding: '10px 16px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
          >
            {isCreatingVisit ? 'Creating...' : '+ Create Visit'}
          </button>
          
          <div className="pp-metric">
            <span className="pp-metric-label">Blood Group</span>
            <span className="pp-metric-val red">{header.bloodGroup.value}</span>
            <span className="pp-metric-date">{header.bloodGroup.date}</span>
          </div>
          <div className="pp-metric">
            <span className="pp-metric-label">Height</span>
            <span className="pp-metric-val">{header.height.value}</span>
            <span className="pp-metric-date">{header.height.date}</span>
          </div>
          <div className="pp-metric">
            <span className="pp-metric-label">Weight</span>
            <span className="pp-metric-val">{header.weight.value}</span>
            <span className="pp-metric-date">{header.weight.date}</span>
          </div>
          <div className="pp-metric">
            <span className="pp-metric-label">BMI</span>
            <span className="pp-metric-val red">{header.bmi.value}</span>
            <span className="pp-metric-date">{header.bmi.date}</span>
          </div>
          <div className="pp-last-visit">
            <span className="pp-metric-label">Last Visit</span>
            <span className="pp-metric-val">{header.lastVisit}</span>
          </div>
        </div>
      </div>

      {/* ALERTS & VITALS SECTION */}
      <div className="pp-alerts-vitals">
        <div className="pp-alerts-container">
          <div className="pp-alerts-row">
            {alerts.allergies.map((allergy, idx) => (
              <div key={idx} className="pp-alert-pill red">
                <AlertTriangleIcon /> {allergy}
              </div>
            ))}
          </div>
          <div className="pp-alerts-row">
            {alerts.conditions.map((condition, idx) => (
              <div key={idx} className="pp-alert-pill blue">
                <FileTextIcon /> {condition}
              </div>
            ))}
          </div>
          <a className="pp-view-trends">View Trends</a>
        </div>

        <div className="pp-vitals-row">
          {vitals.map((v, idx) => (
            <div key={idx} className="pp-vital-item">
              <span className="pp-vital-label">{v.label}</span>
              <span className="pp-vital-value">{v.value || '-'}</span>
              {v.unit && v.value && <span className="pp-vital-unit">{v.unit}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="pp-content">
        
        {/* Conditions & Problems Card */}
        <div className="pp-card">
          <div className="pp-card-header">
            <h3 className="pp-card-title">Conditions & Problems</h3>
            <span className="pp-card-action">View all</span>
          </div>
          <div className="pp-tabs">
            <div className={`pp-tab ${tabs.conditions.active === 'Active' ? 'active' : ''}`} onClick={() => tabs.conditions.set('Active')}>
              Active <span className="pp-tab-count">(4)</span>
            </div>
            <div className={`pp-tab ${tabs.conditions.active === 'Resolved / History' ? 'active' : ''}`} onClick={() => tabs.conditions.set('Resolved / History')}>
              Resolved / History <span className="pp-tab-count">(2)</span>
            </div>
          </div>
          <div className="pp-table-container">
            <table className="pp-table">
              <thead>
                <tr>
                  <th>Condition / Problem</th>
                  <th>Status</th>
                  <th>Since</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {tables.conditions.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.condition}</td>
                    <td>{item.status}</td>
                    <td>{item.since}</td>
                    <td>{item.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Medications Card */}
        <div className="pp-card">
          <div className="pp-card-header">
            <h3 className="pp-card-title">Medications</h3>
            <span className="pp-card-action">View all</span>
          </div>
          <div className="pp-tabs">
            <div className={`pp-tab ${tabs.medications.active === 'Current' ? 'active' : ''}`} onClick={() => tabs.medications.set('Current')}>
              Current <span className="pp-tab-count">(3)</span>
            </div>
            <div className={`pp-tab ${tabs.medications.active === 'Recent Changes' ? 'active' : ''}`} onClick={() => tabs.medications.set('Recent Changes')}>
              Recent Changes <span className="pp-tab-count">(2)</span>
            </div>
            <div className={`pp-tab ${tabs.medications.active === 'Discontinued' ? 'active' : ''}`} onClick={() => tabs.medications.set('Discontinued')}>
              Discontinued <span className="pp-tab-count">(4)</span>
            </div>
          </div>
          <div className="pp-table-container">
            <table className="pp-table">
              <thead>
                <tr>
                  <th>Drug Name</th>
                  <th>Frequency</th>
                  <th>Route</th>
                  <th>Duration</th>
                  <th>Start Date</th>
                  <th>Prescriber</th>
                </tr>
              </thead>
              <tbody>
                {tables.medications.map((med, idx) => (
                  <tr key={idx}>
                    <td>
                      {med.name}
                      <span className="pp-subtext">{med.type}</span>
                    </td>
                    <td>
                      <div className="pp-dropdown">
                        {med.frequency} <ChevronDownIcon />
                      </div>
                    </td>
                    <td>{med.route}</td>
                    <td>{med.duration}</td>
                    <td>{med.startDate}</td>
                    <td>{med.prescriber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Allergies & Risks Card */}
        <div className="pp-card">
          <div className="pp-card-header">
            <h3 className="pp-card-title">Allergies & Risks</h3>
            <span className="pp-card-action">View all</span>
          </div>
          <div className="pp-tabs">
            <div className={`pp-tab ${tabs.allergies.active === 'Allergies' ? 'active' : ''}`} onClick={() => tabs.allergies.set('Allergies')}>
              Allergies <span className="pp-tab-count">(3)</span>
            </div>
            <div className={`pp-tab ${tabs.allergies.active === 'Risks / Precautions' ? 'active' : ''}`} onClick={() => tabs.allergies.set('Risks / Precautions')}>
              Risks / Precautions <span className="pp-tab-count">(2)</span>
            </div>
            <div className={`pp-tab ${tabs.allergies.active === 'Discontinued' ? 'active' : ''}`} onClick={() => tabs.allergies.set('Discontinued')}>
              Discontinued <span className="pp-tab-count">(4)</span>
            </div>
          </div>
          <div className="pp-table-container">
            <table className="pp-table">
              <thead>
                <tr>
                  <th>Allergy / Risk</th>
                  <th>Type</th>
                  <th>Severity</th>
                  <th>Reaction</th>
                  <th>Recorded On</th>
                </tr>
              </thead>
              <tbody>
                {tables.allergies.map((allergy, idx) => (
                  <tr key={idx}>
                    <td>{allergy.allergy}</td>
                    <td>{allergy.type}</td>
                    <td className={allergy.severity === 'Severe' ? 'text-red' : 'text-orange'}>
                      {allergy.severity}
                    </td>
                    <td>{allergy.reaction}</td>
                    <td>{allergy.recordedOn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Clinical Journey Card */}
        <div className="pp-card">
          <div className="pp-card-header">
            <h3 className="pp-card-title">Clinical Journey</h3>
            <span className="pp-card-action">View all</span>
          </div>
          <div className="pp-journey-grid">
            
            <div className="pp-journey-card">
              <div className="pp-journey-icon blue">
                <StethoscopeIcon />
              </div>
              <div className="pp-journey-details">
                <span className="pp-journey-title">Previous Consultations</span>
                <span className="pp-journey-sub">Last: {clinicalJourney.consultations.last}</span>
                <span className="pp-journey-sub">Total: {clinicalJourney.consultations.total}</span>
              </div>
              <div className="pp-journey-expand"><ExpandIcon /></div>
            </div>

            <div className="pp-journey-card">
              <div className="pp-journey-icon green">
                <DocumentHeartIcon />
              </div>
              <div className="pp-journey-details">
                <span className="pp-journey-title">Treatment Changes</span>
                <span className="pp-journey-sub">Last Change: {clinicalJourney.treatmentChanges.last}</span>
                <span className="pp-journey-sub">Total Changes: {clinicalJourney.treatmentChanges.total}</span>
              </div>
              <div className="pp-journey-expand"><ExpandIcon /></div>
            </div>

            <div className="pp-journey-card">
              <div className="pp-journey-icon red">
                <AlertCircleIcon />
              </div>
              <div className="pp-journey-details">
                <span className="pp-journey-title">Important Events</span>
                <span className="pp-journey-sub">Last event: {clinicalJourney.importantEvents.last}</span>
                <span className="pp-journey-sub">Total events: {clinicalJourney.importantEvents.total}</span>
              </div>
              <div className="pp-journey-expand"><ExpandIcon /></div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default PatientProfile;
