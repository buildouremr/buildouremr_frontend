import useStatsCards from "./useStatsCards";
import { MdPeopleAlt, MdCalendarMonth, MdEventBusy } from "react-icons/md";

const iconMap = {
  waiting: MdPeopleAlt,
  appointments: MdCalendarMonth,
  cancelled: MdEventBusy,
};

const StatsCards = ({ summaryData, summaryLoading }) => {
  const { stats } = useStatsCards(summaryData);

  return (
    <>
      <div className="sc-container">
        {stats.map((stat, index) => {
          const IconComp = iconMap[stat.iconType];
          return (
            <div className="sc-card" key={index}>
              <div className="sc-info">
                <p className="sc-title">{stat.title}</p>
                <div className="sc-value-row">
                  <span className="sc-value">{stat.value}</span>
                  <span className="sc-change" style={{ color: "#28a745" }}>
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
        .sc-card:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.06);
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
