import {
  MdPhone, MdEmail, MdLocationOn,
  MdCalendarMonth, MdAccessTime,
} from "react-icons/md";
import { BsListNested } from "react-icons/bs";

// API response keys from getAppointmentPatientDetails:
// patientName, gender, patientId, emailId, mobileNo, dob,
// stateAndCity, apptDate, apptStartTime, apptEndTime,
// apptSessionType, reason
// (appointmentStatus is intentionally NOT shown)

const AvatarInitials = ({ name }) => {
  const initials = (name || "").split(" ").slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "").join("");
  return <div className="pdp-avatar">{initials}</div>;
};

const ActionIcon = ({ children, color, bg }) => (
  <button className="pdp-action-icon" style={{ color, background: bg, borderColor: color + "33" }}>
    {children}
  </button>
);

// Format ISO date string → "10 May 2026"
const formatDate = (iso) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric",
    });
  } catch {
    return iso;
  }
};

// Format DOB "2004-06-08" → "08 Jun 2004"
const formatDob = (dob) => {
  if (!dob) return "—";
  try {
    return new Date(dob).toLocaleDateString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
    });
  } catch {
    return dob;
  }
};

const SkeletonPanel = () => (
  <div className="pdp-panel">
    <div className="pdp-header">
      <div className="pdp-avatar pdp-skel-avatar" />
      <div className="pdp-header-info">
        <div className="pdp-skel" style={{ width: 120, height: 14, marginBottom: 6 }} />
        <div className="pdp-skel" style={{ width: 90, height: 10 }} />
      </div>
    </div>
    <div className="pdp-scroll">
      {[1, 2, 3, 4].map((k) => (
        <div className="pdp-section" key={k}>
          <div className="pdp-skel" style={{ width: 100, height: 12, marginBottom: 8 }} />
          {[1, 2].map((j) => (
            <div key={j} className="pdp-detail-row">
              <div className="pdp-skel" style={{ width: 16, height: 16, borderRadius: 4 }} />
              <div className="pdp-skel" style={{ flex: 1, height: 11 }} />
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

const PatientDetailPanel = ({ patient, loading, onClose }) => {
  if (loading) return <SkeletonPanel />;
  if (!patient) return null;

  const typeIsFollowUp =
    patient.apptSessionType === "Follow-up" ||
    patient.apptSessionType === "Follow up";
  const typeColor = typeIsFollowUp ? "#0D9B5C" : "#2E7DF7";
  const typeBg    = typeIsFollowUp ? "#E8F8F0"  : "#E8F0FF";

  const genderFull = patient.gender === "M" ? "Male"
    : patient.gender === "F" ? "Female"
    : patient.gender || "—";

  return (
    <>
      <div className="pdp-panel">
        {/* ── Header ── */}
        <div className="pdp-header">
          <AvatarInitials name={patient.patientName} />
          <div className="pdp-header-info">
            <span className="pdp-name">{patient.patientName}</span>
            <span className="pdp-meta">
              {genderFull}
              {patient.patientId ? ` • #${patient.patientId}` : ""}
            </span>
          </div>
        </div>

        <div className="pdp-scroll">
          {/* ── Patient Details ── */}
          <div className="pdp-section">
            <span className="pdp-section-title">Patient Details</span>
            <div className="pdp-detail-rows">

              {/* mobileNo */}
              <div className="pdp-detail-row">
                <MdPhone className="pdp-detail-icon" />
                <span className="pdp-detail-val">{patient.mobileNo || "—"}</span>
                <ActionIcon color="#2E7DF7" bg="#EEF4FF">
                  <MdPhone style={{ fontSize: "0.85rem" }} />
                </ActionIcon>
              </div>

              {/* emailId */}
              <div className="pdp-detail-row">
                <MdEmail className="pdp-detail-icon" />
                <span className="pdp-detail-val">{patient.emailId || "—"}</span>
                <ActionIcon color="#2E7DF7" bg="#EEF4FF">
                  <MdEmail style={{ fontSize: "0.85rem" }} />
                </ActionIcon>
              </div>

              {/* dob */}
              <div className="pdp-detail-row">
                <MdCalendarMonth className="pdp-detail-icon" />
                <span className="pdp-detail-val">{formatDob(patient.dob)}</span>
              </div>

              {/* stateAndCity */}
              <div className="pdp-detail-row">
                <MdLocationOn className="pdp-detail-icon" />
                <span className="pdp-detail-val">{patient.stateAndCity || "—"}</span>
              </div>
            </div>
          </div>

          {/* ── Appointment Details ── */}
          <div className="pdp-section">
            <span className="pdp-section-title">Appointment Details</span>
            <div className="pdp-detail-rows">

              {/* apptDate */}
              <div className="pdp-detail-row">
                <MdCalendarMonth className="pdp-detail-icon" />
                <span className="pdp-detail-val">{formatDate(patient.apptDate)}</span>
              </div>

              {/* apptStartTime – apptEndTime */}
              <div className="pdp-detail-row">
                <MdAccessTime className="pdp-detail-icon" />
                <span className="pdp-detail-val">
                  {patient.apptStartTime || "—"}
                  {patient.apptEndTime ? ` - ${patient.apptEndTime}` : ""}
                </span>
              </div>

              {/* apptSessionType */}
              <div className="pdp-detail-row">
                <BsListNested className="pdp-detail-icon" />
                <span
                  className="pdp-type-chip"
                  style={{ color: typeColor, background: typeBg }}
                >
                  {patient.apptSessionType || "—"}
                </span>
              </div>

              {/* reason */}
              <div className="pdp-case-row">
                <span className="pdp-case-text">{patient.reason || "—"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer CTA ── */}
        <div className="pdp-footer">
          <button
            className="pdp-cta-btn"
            onClick={() => console.log("Start consultation:", patient.patientId)}
          >
            Start Consultation &nbsp;→
          </button>
        </div>
      </div>

      <style>{`
        .pdp-panel {
          width: 290px;
          min-width: 290px;
          border-left: 1px solid #eef0f5;
          display: flex;
          flex-direction: column;
          background: #fff;
          overflow: hidden;
        }

        /* Header */
        .pdp-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 18px 16px 14px 16px;
          border-bottom: 1px solid #eef0f5;
        }
        .pdp-avatar {
          width: 46px; height: 46px; border-radius: 50%; flex-shrink: 0;
          background: linear-gradient(135deg, #c8d8f8, #d8e8ff);
          color: #2E7DF7; font-size: 0.84rem; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
        }
        .pdp-header-info { display: flex; flex-direction: column; gap: 3px; }
        .pdp-name { font-size: 0.96rem; font-weight: 700; color: #1a1a2e; }
        .pdp-meta { font-size: 0.75rem; color: #9ca3af; }

        /* Scroll body */
        .pdp-scroll { flex: 1; overflow-y: auto; padding: 0 16px; }

        /* Sections */
        .pdp-section {
          padding: 14px 0 12px 0;
          border-bottom: 1px solid #f0f2f5;
          display: flex; flex-direction: column; gap: 12px;
        }
        .pdp-section:last-child { border-bottom: none; }
        .pdp-section-title { font-size: 0.85rem; font-weight: 700; color: #1a1a2e; }

        /* Detail rows */
        .pdp-detail-rows { display: flex; flex-direction: column; gap: 10px; }
        .pdp-detail-row { display: flex; align-items: center; gap: 10px; }
        .pdp-detail-icon { font-size: 1rem; color: #6b7280; flex-shrink: 0; }
        .pdp-detail-val { font-size: 0.82rem; color: #374151; flex: 1; word-break: break-all; }
        .pdp-action-icon {
          width: 30px; height: 30px; border-radius: 8px; border: 1px solid;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; flex-shrink: 0; transition: opacity 0.15s;
        }
        .pdp-action-icon:hover { opacity: 0.75; }

        .pdp-type-chip {
          font-size: 0.72rem; font-weight: 600;
          padding: 3px 10px; border-radius: 20px; flex-shrink: 0;
        }
        .pdp-case-row { padding-left: 26px; }
        .pdp-case-text { font-size: 0.82rem; color: #374151; }

        /* Footer */
        .pdp-footer { padding: 14px 16px; border-top: 1px solid #eef0f5; }
        .pdp-cta-btn {
          width: 100%; padding: 13px;
          background: #2E7DF7; color: #fff;
          border: none; border-radius: 10px;
          font-size: 0.9rem; font-weight: 600; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 4px;
          transition: background 0.2s;
        }
        .pdp-cta-btn:hover { background: #1b65d4; }

        /* Skeleton */
        .pdp-skel {
          border-radius: 6px;
          background: linear-gradient(90deg, #f0f2f5 25%, #e4e7ec 50%, #f0f2f5 75%);
          background-size: 200% 100%;
          animation: pdp-shimmer 1.4s infinite;
        }
        .pdp-skel-avatar { background: #e4e7ec !important; animation: pdp-shimmer 1.4s infinite; }
        @keyframes pdp-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </>
  );
};

export default PatientDetailPanel;
