import { BsCalendarCheck, BsCalendarX, BsCalendarMinus } from "react-icons/bs";
import { MdCalendarToday, MdOutlineEventBusy } from "react-icons/md";
import useAppointmentStats from "./useAppointmentStats";

const ICON_CONFIG = {
  total:     { icon: <MdCalendarToday />,    iconBg: "#E8F0FF", iconColor: "#2E7DF7" },
  completed: { icon: <BsCalendarCheck />,    iconBg: "#E8F8F0", iconColor: "#0D9B5C" },
  pending:   { icon: <MdOutlineEventBusy />, iconBg: "#FFF8E8", iconColor: "#F59E0B" },
  cancelled: { icon: <BsCalendarX />,        iconBg: "#FFE8E8", iconColor: "#E74C3C" },
  noShow:    { icon: <BsCalendarMinus />,    iconBg: "#FFF8E8", iconColor: "#F59E0B" },
};

const AppointmentStats = () => {
  const { stats, loading } = useAppointmentStats();

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
                <div className="as-card" key={s.key}>
                  <div className="as-card-left">
                    <span className="as-label">{s.label}</span>
                    <div className="as-value-row">
                      <span className="as-value">{s.value}</span>
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
          gap: 0;
          background: #fff;
          border: 1px solid #eef0f5;
          border-radius: 12px;
          margin: 16px 28px 0 28px;
          overflow: hidden;
        }
        .as-card {
          flex: 1;
          padding: 16px 20px;
          border-right: 1px solid #eef0f5;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .as-card:last-child { border-right: none; }
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
