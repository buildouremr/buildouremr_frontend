import { useState } from "react";
import PatientHeader from "./PatientHeader/PatientHeader";
import PatientTable from "./PatientTable/PatientTable";
import NewPatientModal from "./NewPatientModal/NewPatientModal";

const Patients = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="pt-page">
        <PatientHeader onCreatePatient={() => setIsModalOpen(true)} />
        <PatientTable />
      </div>

      {isModalOpen && (
        <NewPatientModal onClose={() => setIsModalOpen(false)} />
      )}

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
