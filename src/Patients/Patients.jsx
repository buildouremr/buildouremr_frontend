import PatientHeader from "./PatientHeader/PatientHeader";
import PatientTable from "./PatientTable/PatientTable";

const Patients = () => {
  return (
    <>
      <div className="pt-page">
        <PatientHeader />
        <PatientTable />
      </div>

      <style>{`
        .pt-page {
          flex: 1;
          overflow: hidden;
          background: #f5f7fa;
          display: flex;
          flex-direction: column;
          gap: 0;
        }
      `}</style>
    </>
  );
};

export default Patients;
