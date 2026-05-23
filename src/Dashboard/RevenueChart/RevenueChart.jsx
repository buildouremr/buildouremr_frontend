import useRevenueChart from "./useRevenueChart";

const RevenueChart = () => {
  const { revenueData, maxAmount, handleViewAll, formatCurrency } = useRevenueChart();

  return (
    <>
      <div className="rc-container">
        <div className="rc-header">
          <h2 className="rc-title">Revenue</h2>
          <span className="rc-view-all" onClick={handleViewAll}>View All</span>
        </div>
        <div className="rc-list">
          {revenueData.map((item, idx) => (
            <div className="rc-row" key={idx}>
              <div className="rc-text-row">
                <span className="rc-day">{item.day}</span>
                <span className="rc-amount">{formatCurrency(item.amount)}</span>
              </div>
              <div className="rc-bar-wrap">
                <div
                  className="rc-bar"
                  style={{ width: `${(item.amount / maxAmount) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .rc-container { background:#fff; border-radius:12px; padding:22px; border:1px solid #eef0f5; height:100%; box-sizing:border-box; }
        .rc-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; }
        .rc-title { font-size:1.05rem; font-weight:700; color:#1a1a2e; margin:0; }
        .rc-view-all { font-size:0.85rem; color:#374151; cursor:pointer; font-weight:500; border: 1px solid #eef0f5; padding: 6px 14px; border-radius: 6px; transition: all 0.2s ease; }
        .rc-view-all:hover { color:#2E7DF7; border-color: #2E7DF7; }
        .rc-list { display:flex; flex-direction:column; gap:16px; }
        .rc-row { display:flex; flex-direction:column; gap:6px; }
        .rc-text-row { display:flex; justify-content:space-between; align-items:center; }
        .rc-day { font-size:0.82rem; color:#374151; font-weight:500; }
        .rc-bar-wrap { width:100%; height:8px; background:#f0f2f5; border-radius:6px; overflow:hidden; }
        .rc-bar { height:100%; background:linear-gradient(90deg,#2E7DF7,#60a5fa); border-radius:6px; transition:width 0.6s ease; }
        .rc-amount { text-align:right; font-size:0.82rem; color:#374151; font-weight:600; }
      `}</style>
    </>
  );
};

export default RevenueChart;
