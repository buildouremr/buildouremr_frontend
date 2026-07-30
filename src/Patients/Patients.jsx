import { useState } from "react";
import PatientHeader from "./PatientHeader/PatientHeader";
import PatientTable from "./PatientTable/PatientTable";
import NewPatientModal from "./NewPatientModal/NewPatientModal";

import { useToast } from "../components/Toast/Toast";

const Patients = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { showToast } = useToast();

  const handleSuccess = () => {
    setIsModalOpen(false);
    setRefreshTrigger((prev) => prev + 1);
    showToast({
      type: "success",
      title: "New Patient Saved",
      message: "You have successfully created a Patient.",
    });
  };

  return (
    <>
      <div className="pt-page">
        <PatientHeader onCreatePatient={() => setIsModalOpen(true)} />
        <PatientTable refreshTrigger={refreshTrigger} />
      </div>

      {isModalOpen && (
        <NewPatientModal 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={handleSuccess} 
        />
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
