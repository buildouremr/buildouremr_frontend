import useStatsCards from "./useStatsCards";
import { Users, Calendar, CalendarX } from 'lucide-react';

const iconMap = {
  pending: Users,
  appointments: Calendar,
  cancelled: CalendarX,
};

/** Map card → appointments filter tab */
const CARD_TO_FILTER = {
  pending:      "Pending",
  appointments: "All Appointments",
  cancelled:    "Cancelled",
};

const StatsCards = ({ summaryData, summaryLoading, onCardClick }) => {
  const { stats } = useStatsCards(summaryData);

  return (
    <>
      <div className="sc-container">
        {stats.map((stat, index) => {
          const IconComp = iconMap[stat.iconType];
          return (
            <div
              className="sc-card sc-card-clickable"
              key={index}
              onClick={() => onCardClick && onCardClick(CARD_TO_FILTER[stat.iconType] || "All Appointments")}
              title={`Go to ${stat.title}`}
            >
              <div className="sc-info">
                <p className="sc-title">{stat.title}</p>
                <div className="sc-value-row">
                  <span className="sc-value">{stat.value}</span>
                  <span className="sc-change" style={{ color: stat.change === "0%" ? "#9ca3af" : (stat.change.startsWith("+") ? "#10b981" : "#E74C3C") }}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div
                className="sc-icon-wrap"
                style={{ backgroundColor: stat.bgColor }}
              >
                <IconComp style={{ color: stat.color, fontSize: "1.4rem" }} />
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .sc-container {
          display: flex;
          gap: 20px;
          padding: 0 28px 16px 28px;
        }
        .sc-card {
          flex: 1;
          background: #fff;
          border-radius: 12px;
          padding: 20px 22px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border: 1px solid #eef0f5;
          transition: box-shadow 0.2s ease;
        }
        .sc-card-clickable {
          cursor: pointer;
          transition: box-shadow 0.18s, transform 0.15s, border-color 0.18s;
        }
        .sc-card-clickable:hover {
          box-shadow: 0 6px 20px rgba(46,125,247,0.1);
          border-color: #c3d9ff;
          transform: translateY(-2px);
        }
        .sc-title {
          font-size: 0.82rem;
          color: #6b7280;
          margin: 0 0 8px 0;
        }
        .sc-value-row {
          display: flex;
          align-items: baseline;
          gap: 10px;
        }
        .sc-value {
          font-size: 1.6rem;
          font-weight: 700;
          color: #1a1a2e;
        }
        .sc-change {
          font-size: 0.8rem;
          font-weight: 600;
        }
        .sc-icon-wrap {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </>
  );
};

export default StatsCards;
