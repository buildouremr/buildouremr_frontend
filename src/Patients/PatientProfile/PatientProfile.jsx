import React, { useState } from "react";
import { usePatientProfile, createEncounter } from "./PatientProfile";
import ChartHeader from "../PatientChart/ChartHeader";
import Pagination from "../../components/Pagination/Pagination";
import ClinicalJourneyDrawer from "../../components/Drawers/ClinicalJourneyDrawer/ClinicalJourneyDrawer";
import StartConsultationModal from "./StartConsultationModal";
import UnsignedChartPreviewModal from "./UnsignedChartPreviewModal";
import "./PatientProfile.css";

// SVG Icons
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

// ─── Empty State Component ─────────────────────────────────────────
const EmptyState = ({ title, subtitle }) => (
  <div className="pp-empty-state">
    <h4 className="pp-empty-title">{title}</h4>
    <p className="pp-empty-subtitle">{subtitle}</p>
  </div>
);

const PatientProfile = ({ patientId, appointmentId, onBack, onOpenNotes }) => {
  const { patientData, loading, refetch, tabs, pagination, counts } = usePatientProfile(patientId);
  const [isCreatingVisit, setIsCreatingVisit] = useState(false);
  const [isJourneyDrawerOpen, setIsJourneyDrawerOpen] = useState(false);
  const [isStartConsultationModalOpen, setIsStartConsultationModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  if (loading || !patientData) {
    return <div className="flex items-center justify-center h-screen text-gray-500">Loading Patient Profile...</div>;
  }

  const { header, alerts, vitals, clinicalJourney, unsignedChart } = patientData;

  const handleCreateVisit = async () => {
    if (unsignedChart?.hasUnsignedChart) {
      setIsStartConsultationModalOpen(true);
      return;
    }
    setIsCreatingVisit(true);
    const dbPatientId = typeof patientId === 'number' ? patientId : (parseInt(patientId, 10) || 1); 
    const res = await createEncounter(dbPatientId);
    setIsCreatingVisit(false);
    if (res && res.status === "SUCCESS") {
      onOpenNotes(patientId, res.data.encounterId);
    } else {
      alert("Failed to create encounter");
    }
  };

  return (
    <div className="patient-profile-container">
      {/* HEADER SECTION */}
      <ChartHeader 
        patientData={header}
        onBack={onBack}
        rightAction={
          <button 
            className="pp-start-new-btn" 
            onClick={handleCreateVisit}
            disabled={isCreatingVisit}
          >
            {isCreatingVisit ? 'Creating...' : '+ Start New Consultation'}
          </button>
        }
      />

      {/* ALERTS & VITALS SECTION */}
      <div className="pp-alerts-vitals">
        <div className="pp-alerts-container">
          {alerts.allergies && alerts.allergies.length > 0 && (
            <div className="pp-alerts-row">
              {alerts.allergies.map((allergy, idx) => (
                <div key={idx} className="pp-alert-pill red">
                  <AlertTriangleIcon /> {allergy}
                </div>
              ))}
            </div>
          )}
          {alerts.conditions && alerts.conditions.length > 0 && (
            <div className="pp-alerts-row">
              {alerts.conditions.map((condition, idx) => (
                <div key={idx} className="pp-alert-pill blue">
                  <FileTextIcon /> {condition}
                </div>
              ))}
            </div>
          )}
          <a className="pp-view-trends">View Trends</a>
        </div>

        {/* UNSIGNED CHART AMBER BANNER */}
        {unsignedChart?.hasUnsignedChart && (
          <div className="pp-unsigned-banner">
            <div className="pp-unsigned-left">
              <div className="pp-unsigned-icon-wrapper">
                <AlertTriangleIcon />
              </div>
              <div className="pp-unsigned-text-group">
                <h4 className="pp-unsigned-title">Unsigned Chart</h4>
                <p className="pp-unsigned-subtitle">
                  Last updated: {unsignedChart.lastUpdated}
                </p>
              </div>
            </div>
            <div className="pp-unsigned-actions">
              <button 
                className="pp-unsigned-btn review" 
                onClick={() => setIsPreviewModalOpen(true)}
              >
                Review & Close
              </button>
              <button 
                className="pp-unsigned-btn continue"
                onClick={() => onOpenNotes(patientId, unsignedChart.encounterId)}
              >
                Continue Unsigned Chart
              </button>
            </div>
          </div>
        )}

        <div className="pp-vitals-row">
          {vitals.map((v, idx) => (
            <div key={idx} className="pp-vital-item">
              <span className="pp-vital-label">{v.label}</span>
              <span className="pp-vital-value">
                {v.value && !v.value.startsWith('--') 
                  ? v.value 
                  : (v.label === 'BP' ? '-- / --' : v.label === 'HR' ? '-- bpm' : v.label === 'SpO2' ? '--%' : v.label === 'Temp' ? '-- °C' : '-')}
              </span>
              {v.unit && v.value && <span className="pp-vital-unit">{v.unit}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="pp-content">
        
        {/* ─── Conditions & Problems Card ──────────────────────────── */}
        <div className="pp-card">
          <div className="pp-card-header">
            <h3 className="pp-card-title">Conditions & Problems</h3>
            <span className="pp-card-action">View all</span>
          </div>
          <div className="pp-tabs">
            <div 
              className={`pp-tab ${tabs.conditions.active === 'Active' ? 'active' : ''}`} 
              onClick={() => tabs.conditions.set('Active')}
            >
              Active <span className="pp-tab-count">({counts.activeConditions})</span>
            </div>
            <div 
              className={`pp-tab ${tabs.conditions.active === 'Resolved / History' ? 'active' : ''}`} 
              onClick={() => tabs.conditions.set('Resolved / History')}
            >
              Resolved / History <span className="pp-tab-count">({counts.resolvedConditions})</span>
            </div>
          </div>

          {pagination.conditions.totalCount === 0 ? (
            <EmptyState 
              title={tabs.conditions.active === 'Active' 
                ? "No Active Conditions & Problems" 
                : "No Resolved Conditions & Problems"}
              subtitle={tabs.conditions.active === 'Active'
                ? "There's no active conditions recorded for this patient till date"
                : "There's no such conditions has resolved for this patient till date"}
            />
          ) : (
            <>
              <div className="pp-table-container">
                <table className="pp-table">
                  <thead>
                    <tr>
                      {tabs.conditions.active === 'Active' ? (
                        <>
                          <th>Condition / Problem</th>
                          <th>Status</th>
                          <th>Since</th>
                          <th>Notes</th>
                        </>
                      ) : (
                        <>
                          <th>Condition / Problem</th>
                          <th>Period</th>
                          <th>Notes</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {pagination.conditions.items.map((item, idx) => (
                      <tr key={idx}>
                        {tabs.conditions.active === 'Active' ? (
                          <>
                            <td>{item.condition}</td>
                            <td>{item.status}</td>
                            <td>{item.since}</td>
                            <td>{item.notes || '-'}</td>
                          </>
                        ) : (
                          <>
                            <td>{item.condition}</td>
                            <td>{item.period || item.since || '-'}</td>
                            <td>{item.notes || '-'}</td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {pagination.conditions.totalCount > 5 && (
                <Pagination
                  currentPage={pagination.conditions.page}
                  totalPages={pagination.conditions.totalPages}
                  onPageChange={pagination.conditions.setPage}
                />
              )}
            </>
          )}
        </div>

        {/* ─── Medications Card ────────────────────────────────────── */}
        <div className="pp-card">
          <div className="pp-card-header">
            <h3 className="pp-card-title">Medications</h3>
            <span className="pp-card-action">View all</span>
          </div>
          <div className="pp-tabs">
            <div 
              className={`pp-tab ${tabs.medications.active === 'Current' ? 'active' : ''}`} 
              onClick={() => tabs.medications.set('Current')}
            >
              Current <span className="pp-tab-count">({counts.currentMedications})</span>
            </div>
            <div 
              className={`pp-tab ${tabs.medications.active === 'Recent Changes' ? 'active' : ''}`} 
              onClick={() => tabs.medications.set('Recent Changes')}
            >
              Recent Changes <span className="pp-tab-count">({counts.recentChangeMedications})</span>
            </div>
          </div>

          {pagination.medications.totalCount === 0 ? (
            <EmptyState 
              title={tabs.medications.active === 'Current'
                ? "No Current Medications"
                : "No Recent Changes In Medications"}
              subtitle={tabs.medications.active === 'Current'
                ? "There's no medications recorded for this patient till date"
                : "There's no changes in the medications for this patient till date"}
            />
          ) : (
            <>
              <div className="pp-table-container">
                <table className="pp-table">
                  <thead>
                    <tr>
                      {tabs.medications.active === 'Current' ? (
                        <>
                          <th>Drug Name</th>
                          <th>Frequency</th>
                          <th>Route</th>
                          <th>Duration</th>
                          <th>Start and End Date</th>
                          <th>Prescriber</th>
                        </>
                      ) : (
                        <>
                          <th>Drug Name</th>
                          <th>Duration</th>
                          <th>Reason</th>
                          <th>Changed to</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {pagination.medications.items.map((med, idx) => (
                      <tr key={idx}>
                        {tabs.medications.active === 'Current' ? (
                          <>
                            <td>
                              {med.name}
                              <span className="pp-subtext">{med.type}</span>
                            </td>
                            <td>{med.frequency}</td>
                            <td>{med.route}</td>
                            <td>{med.duration}</td>
                            <td>
                              {med.startDate || '-'}
                              {med.endDate && med.endDate !== '-' ? ` - ${med.endDate}` : ''}
                            </td>
                            <td>{med.prescriber}</td>
                          </>
                        ) : (
                          <>
                            <td>
                              {med.name}
                              <span className="pp-subtext">{med.type}</span>
                            </td>
                            <td>{med.startDate || '-'} - {med.endDate || '-'}</td>
                            <td>-</td>
                            <td>-</td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {pagination.medications.totalCount > 5 && (
                <Pagination
                  currentPage={pagination.medications.page}
                  totalPages={pagination.medications.totalPages}
                  onPageChange={pagination.medications.setPage}
                />
              )}
            </>
          )}
        </div>

        {/* ─── Allergies & Risks Card ─────────────────────────────── */}
        <div className="pp-card">
          <div className="pp-card-header">
            <h3 className="pp-card-title">Allergies & Risks</h3>
            <span className="pp-card-action">View all</span>
          </div>
          <div className="pp-tabs">
            <div className={`pp-tab active`}>
              Allergies <span className="pp-tab-count">({counts.allergies})</span>
            </div>
          </div>

          {pagination.allergies.totalCount === 0 ? (
            <EmptyState 
              title="No Allergies for this patient"
              subtitle="There's no Allergies recorded for this patient till date"
            />
          ) : (
            <>
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
                    {pagination.allergies.items.map((allergy, idx) => (
                      <tr key={idx}>
                        <td>{allergy.allergy}</td>
                        <td>{allergy.type}</td>
                        <td className={
                          allergy.severity === 'Severe' ? 'text-red' : 
                          allergy.severity === 'Moderate' ? 'text-orange' : ''
                        }>
                          {allergy.severity}
                        </td>
                        <td>{allergy.reaction}</td>
                        <td>{allergy.recordedOn}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {pagination.allergies.totalCount > 5 && (
                <Pagination
                  currentPage={pagination.allergies.page}
                  totalPages={pagination.allergies.totalPages}
                  onPageChange={pagination.allergies.setPage}
                />
              )}
            </>
          )}
        </div>

        {/* ─── Clinical Journey Card ──────────────────────────────── */}
        <div className="pp-card">
          <div className="pp-card-header">
            <h3 className="pp-card-title">Clinical Journey</h3>
            <span className="pp-card-action">View all</span>
          </div>

          {(!clinicalJourney.items || clinicalJourney.items.length === 0) ? (
            <EmptyState 
              title="No Clinical Consultation for this patient"
              subtitle="There's no Clinical Consultation recorded for this patient till date"
            />
          ) : (
            <div className="pp-table-container">
              <table className="pp-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Provider</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {clinicalJourney.items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.date}</td>
                      <td>{item.type}</td>
                      <td>{item.provider}</td>
                      <td>
                        <span className={`pp-pill ${item.isCompleted ? 'green' : 'orange'}`}>
                          {item.isCompleted ? 'Signed' : 'Unsigned'}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="pp-action-btn" 
                          style={{color: '#3b82f6', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 500}}
                          onClick={() => {
                            if (!item.isCompleted && unsignedChart?.hasUnsignedChart) {
                              setIsPreviewModalOpen(true);
                            } else {
                              setIsJourneyDrawerOpen(true);
                            }
                          }}
                        >
                          {item.isCompleted ? 'View' : 'Review'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      <ClinicalJourneyDrawer 
        isOpen={isJourneyDrawerOpen} 
        onClose={() => setIsJourneyDrawerOpen(false)} 
      />

      <StartConsultationModal
        isOpen={isStartConsultationModalOpen}
        onClose={() => setIsStartConsultationModalOpen(false)}
        unsignedInfo={unsignedChart}
        onContinueUnsigned={(encId) => {
          setIsStartConsultationModalOpen(false);
          onOpenNotes(patientId, encId);
        }}
        onReviewAndClose={(encId) => {
          setIsStartConsultationModalOpen(false);
          setIsPreviewModalOpen(true);
        }}
      />

      <UnsignedChartPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        patientId={patientId}
        encounterId={unsignedChart?.encounterId}
        unsignedInfo={unsignedChart}
        onContinueEditing={(encId) => {
          setIsPreviewModalOpen(false);
          onOpenNotes(patientId, encId);
        }}
        onSignAndStartNew={(newEncounterId) => {
          setIsPreviewModalOpen(false);
          onOpenNotes(patientId, newEncounterId);
        }}
        onSignOnlySuccess={() => {
          refetch();
        }}
      />
    </div>
  );
};

export default PatientProfile;
