import AppointmentHeader from "./AppointmentHeader/AppointmentHeader";
import AppointmentStats from "./AppointmentStats/AppointmentStats";
import AppointmentTable from "./AppointmentTable/AppointmentTable";

const Appointments = () => {
  return (
    <>
      <div className="appt-page">
        <AppointmentHeader />
        <AppointmentStats />
        <AppointmentTable />
      </div>

      <style>{`
        .appt-page {
          flex: 1;
          overflow-y: auto;
          background: #f5f7fa;
          padding-bottom: 40px;
          display: flex;
          flex-direction: column;
          gap: 0;
        }
      `}</style>
    </>
  );
};

export default Appointments;
