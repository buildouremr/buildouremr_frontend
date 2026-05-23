import usePatientsChart from "./usePatientsChart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const PatientsChart = () => {
  const { totalPatients, chartData, handleViewAll } = usePatientsChart();

  return (
    <>
      <div className="ptc-container">
        <div className="ptc-header">
          <h2 className="ptc-title">Patients</h2>
          <span className="ptc-view-all" onClick={handleViewAll}>View All</span>
        </div>
        <div className="ptc-sub-header">
          <span className="ptc-total">
            Total No of Patients : <span className="ptc-total-num">{totalPatients}</span>
          </span>
          <div className="ptc-legend">
            <div className="ptc-legend-item">
              <span className="ptc-dot" style={{ background: "#2E7DF7" }}></span>
              New Patients
            </div>
            <div className="ptc-legend-item">
              <span className="ptc-dot" style={{ background: "#A8D4FF" }}></span>
              Old Patients
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} barGap={2} barSize={16}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9ca3af" }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9ca3af" }} domain={[0, 100]} />
            <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #eee", fontSize: "0.8rem" }} />
            <Bar dataKey="newPatients" fill="#2E7DF7" radius={[0, 0, 0, 0]} name="New Patients" />
            <Bar dataKey="oldPatients" fill="#A8D4FF" radius={[4, 4, 0, 0]} name="Old Patients" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <style>{`
        .ptc-container { background:#fff; border-radius:12px; padding:22px; border:1px solid #eef0f5; height:100%; box-sizing:border-box; }
        .ptc-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; }
        .ptc-title { font-size:1.05rem; font-weight:700; color:#1a1a2e; margin:0; }
        .ptc-view-all { font-size:0.85rem; color:#374151; cursor:pointer; font-weight:500; border: 1px solid #eef0f5; padding: 6px 14px; border-radius: 6px; transition: all 0.2s ease; }
        .ptc-view-all:hover { color:#2E7DF7; border-color: #2E7DF7; }
        .ptc-sub-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; }
        .ptc-total { font-size:0.82rem; color:#6b7280; }
        .ptc-total-num { color:#2E7DF7; font-weight:700; }
        .ptc-legend { display:flex; gap:16px; }
        .ptc-legend-item { display:flex; align-items:center; gap:6px; font-size:0.78rem; color:#6b7280; }
        .ptc-dot { width:8px; height:8px; border-radius:50%; }
      `}</style>
    </>
  );
};

export default PatientsChart;
