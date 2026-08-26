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
import Patients from "../Patients/Patients";
import PatientProfile from "../Patients/PatientProfile/PatientProfile.jsx";
import PatientChart from "../Patients/PatientChart/PatientChart";
import useDashboard from "./useDashboard";
import SessionTimeoutModal from "../components/SessionTimeoutModal";


const Dashboard = ({ onLogout }) => {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [apptInitialFilter, setApptInitialFilter] = useState("All Appointments");
  const [chartPatientId, setChartPatientId] = useState(null);
  const [chartAppointmentId, setChartAppointmentId] = useState(null);
  const [chartEncounterId, setChartEncounterId] = useState(null);
  const [previousMenu, setPreviousMenu] = useState("Dashboard");

  const {
    summaryData,
    summaryLoading,
    selectedDate,
    handleDateChange,
    showTimeoutModal,
    countdown,
    continueSession
  } = useDashboard();

  /** Navigate to Appointments tab with a pre-selected status filter */
  const goToAppointments = (filter) => {
    setApptInitialFilter(filter);
    setActiveMenu("Appointments");
  };

  /** Navigate to Patient Chart / Profile */
  const goToPatientProfile = (patientId, appointmentId = null) => {
    setChartPatientId(patientId);
    setChartAppointmentId(appointmentId);
    setPreviousMenu(activeMenu);
    setActiveMenu("PatientProfile");
  };

  /** Navigate to Notes */
  const goToPatientNotes = (patientId, encounterId = null) => {
    setChartPatientId(patientId);
    setChartEncounterId(encounterId);
    setPreviousMenu(activeMenu);
    setActiveMenu("PatientChart");
  };

  const renderContent = () => {
    if (activeMenu === "Appointments") {
      return <Appointments initialFilter={apptInitialFilter} onOpenChart={goToPatientProfile} />;
    }
    if (activeMenu === "Patients") {
      return <Patients onOpenChart={goToPatientProfile} />;
    }
    if (activeMenu === "PatientProfile") {
      return <PatientProfile 
               patientId={chartPatientId} 
               appointmentId={chartAppointmentId} 
               onBack={() => setActiveMenu(previousMenu)} 
               onOpenNotes={goToPatientNotes} 
             />;
    }
    if (activeMenu === "PatientChart") {
      return <PatientChart patientId={chartPatientId} appointmentId={chartAppointmentId} encounterId={chartEncounterId} onBack={() => setActiveMenu(previousMenu)} />;
    }

    // Default Dashboard Overview
    return (
      <div className="db-content">
        <WelcomeSection
          summaryData={summaryData}
          summaryLoading={summaryLoading}
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
          onViewAll={() => goToAppointments("All Appointments")}
        />
        <StatsCards
          summaryData={summaryData}
          summaryLoading={summaryLoading}
          onCardClick={goToAppointments}
        />
        <PatientQueue selectedDate={selectedDate} onViewAll={() => goToAppointments("All Appointments")} />
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
        <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} onLogout={onLogout} summaryData={summaryData} />
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
          align-items: stretch;
        }
        .db-col-left { flex: 1; display: flex; flex-direction: column; }
        .db-col-right { flex: 1; display: flex; flex-direction: column; }
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