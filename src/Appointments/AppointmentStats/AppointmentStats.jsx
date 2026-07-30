import { BsCalendarCheck, BsCalendarX, BsCalendarMinus } from "react-icons/bs";
import { MdCalendarToday, MdOutlineEventBusy } from "react-icons/md";
import useAppointmentStats from "./useAppointmentStats";

const ICON_CONFIG = {
  total:     { icon: <MdCalendarToday />,    iconBg: "#E8F0FF", iconColor: "#2E7DF7", percentage: "+55%", percentColor: "#10b981" },
  completed: { icon: <BsCalendarCheck />,    iconBg: "#E8F8F0", iconColor: "#0D9B5C", percentage: "+55%", percentColor: "#10b981" },
  pending:   { icon: <MdOutlineEventBusy />, iconBg: "#FFF8E8", iconColor: "#F59E0B", percentage: "+55%", percentColor: "#10b981" },
  cancelled: { icon: <BsCalendarX />,        iconBg: "#FFE8E8", iconColor: "#E74C3C", percentage: "-3%", percentColor: "#E74C3C" },
  noShow:    { icon: <BsCalendarMinus />,    iconBg: "#FFF8E8", iconColor: "#F59E0B", percentage: "+55%", percentColor: "#10b981" },
};

/** Map stat key → tab name used in AppointmentTable */
const KEY_TO_TAB = {
  total:     "All Appointments",
  completed: "Completed",
  pending:   "Pending",
  cancelled: "Cancelled",
  noShow:    "No Show",
};

const AppointmentStats = ({ selectedDate, onFilterSelect, refreshKey }) => {
  const { stats, loading } = useAppointmentStats(selectedDate, refreshKey);

  const handleCardClick = (key) => {
    if (onFilterSelect) onFilterSelect(KEY_TO_TAB[key] || "All Appointments");
  };

  return (
    <>
      <div className="as-container">
        {loading
          ? [1, 2, 3, 4, 5].map((k) => (
              <div className="as-card" key={k}>
                <div className="as-card-left">
                  <div className="as-skel as-skel-label" />
                  <div className="as-skel as-skel-value" />
                </div>
                <div className="as-icon-wrap as-skel-icon" />
              </div>
            ))
          : stats.map((s) => {
              const cfg = ICON_CONFIG[s.key] || ICON_CONFIG.total;
              return (
                <div
                  className="as-card as-card-clickable"
                  key={s.key}
                  onClick={() => handleCardClick(s.key)}
                  title={`Filter by ${s.label}`}
                >
                  <div className="as-card-left">
                    <span className="as-label">{s.label}</span>
                    <div className="as-value-row">
                      <span className="as-value">{s.value}</span>
                      {cfg.percentage && (
                        <span style={{ color: cfg.percentColor, fontSize: '0.75rem', fontWeight: 600, marginLeft: '4px' }}>
                          {cfg.percentage}
                        </span>
                      )}
                    </div>
                  </div>
                  <div
                    className="as-icon-wrap"
                    style={{ background: cfg.iconBg, color: cfg.iconColor }}
                  >
                    {cfg.icon}
                  </div>
                </div>
              );
            })}
      </div>

      <style>{`
        .as-container {
          display: flex;
          align-items: stretch;
          gap: 16px;
          margin: 16px 28px 0 28px;
        }
        .as-card {
          flex: 1;
          background: #fff;
          border: 1px solid #eef0f5;
          border-radius: 12px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
        }
        .as-card-clickable {
          cursor: pointer;
          transition: box-shadow 0.18s, transform 0.15s, border-color 0.18s;
        }
        .as-card-clickable:hover {
          box-shadow: 0 4px 16px rgba(46,125,247,0.1);
          border-color: #c3d9ff;
          transform: translateY(-1px);
        }
        .as-card-left {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .as-label {
          font-size: 0.78rem;
          color: #6b7280;
          font-weight: 500;
        }
        .as-value-row {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }
        .as-value {
          font-size: 1.6rem;
          font-weight: 700;
          color: #1a1a2e;
          line-height: 1;
        }
        .as-icon-wrap {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          flex-shrink: 0;
        }

        /* Skeleton */
        .as-skel {
          border-radius: 6px;
          background: linear-gradient(90deg, #f0f2f5 25%, #e4e7ec 50%, #f0f2f5 75%);
          background-size: 200% 100%;
          animation: as-shimmer 1.4s infinite;
        }
        .as-skel-label { height: 10px; width: 60px; margin-bottom: 6px; }
        .as-skel-value { height: 24px; width: 40px; }
        .as-skel-icon  { background: #f0f2f5 !important; }
        @keyframes as-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </>
  );
};

export default AppointmentStats;
