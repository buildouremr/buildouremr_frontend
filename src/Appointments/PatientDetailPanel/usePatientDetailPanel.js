const usePatientDetailPanel = (patient) => {
  const data = {
    patient,
    // Derive display fields from the mapped appointment object
    displayName:    patient?.name ?? "—",
    patientId:      patient?.id ?? "—",
    sessionType:    patient?.sessionType ?? "—",
    caseDetails:    patient?.caseDetails ?? "—",
    dateDisplay:    patient?.date ?? "—",
    startTime:      patient?.startTime ?? "—",
    endTime:        patient?.endTime ?? "—",
    ptType:         patient?.ptType ?? "—",
    doctorName:     patient?.doctorName ?? "—",
  };

  const meth = {
    handleStartConsultation: () => console.log("Start consultation:", patient?.id),
    handleEdit:              () => console.log("Edit sticky notes:", patient?.id),
    handleCallPhone:         () => console.log("Call:", patient?.raw?.mobileNo),
    handleEmail:             () => console.log("Email:", patient?.raw?.email),
  };

  const result = { ...data, ...meth };
  return result;
};

export default usePatientDetailPanel;
