import { useState } from "react";
import Sidebar from "./Sidebar/Sidebar";
import Topbar from "./Topbar/Topbar";
import WelcomeSection from "./WelcomeSection/WelcomeSection";
import StatsCards from "./StatsCards/StatsCards";
import PatientQueue from "./PatientQueue/PatientQueue";
import PriorityCenter from "./PriorityCenter/PriorityCenter";
import TeamSection from "./TeamSection/TeamSection";
import PatientsChart from "./PatientsChart/PatientsChart";
import RevenueChart from "./RevenueChart/RevenueChart";
import Appointments from "../Appointments/Appointments";
import useDashboard from "./useDashboard";
import SessionTimeoutModal from "../components/SessionTimeoutModal";


const Dashboard = ({ onLogout }) => {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const {
    summaryData,
    summaryLoading,
    showTimeoutModal,
    countdown,
    continueSession
  } = useDashboard();

  const renderContent = () => {
    if (activeMenu === "Appointments") {
      return <Appointments />;
    }

    // Default Dashboard Overview
    return (
      <div className="db-content">
        <WelcomeSection summaryData={summaryData} summaryLoading={summaryLoading} />
        <StatsCards summaryData={summaryData} summaryLoading={summaryLoading} />
        <PatientQueue />
        <div className="db-row">
          <div className="db-col-left">
            <PriorityCenter />
          </div>
          <div className="db-col-right">
            <TeamSection />
          </div>
        </div>
        <div className="db-row">
          <div className="db-col-left">
            <PatientsChart />
          </div>
          <div className="db-col-right">
            <RevenueChart />
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="db-layout">
        <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} onLogout={onLogout} />
        <div className="db-main">
          <Topbar onLogout={onLogout} />
          {renderContent()}
        </div>
      </div>
      <style>{`
        .db-layout { display: flex; height: 100vh; overflow: hidden; }
        .db-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
        .db-content {
          flex: 1; overflow-y: auto; background: #f5f7fa;
          padding-bottom: 40px;
        }
        .db-row {
          display: flex; gap: 20px; padding: 0 28px; margin-bottom: 20px;
        }
        .db-col-left { flex: 1; }
        .db-col-right { flex: 1; }
      `}</style>

      <SessionTimeoutModal
        open={showTimeoutModal}
        countdown={countdown}
        onContinue={continueSession}
      />

    </>
  );
};

export default Dashboard;