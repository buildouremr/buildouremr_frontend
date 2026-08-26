import axiosInstance from "../../utils/useAPIClient";

const PatientChartAPI = {
  // Get patient snapshot (demographics, allergies, chronic conditions, risk factors)
  getPatientSnapshot: (patientId) => {
    return axiosInstance.get(`/patient-chart/${patientId}/snapshot`);
  },

  getPatientProfile: (patientId) => {
    return axiosInstance.get(`/patient-chart/${patientId}/profile`);
  },

  // Auto save section
  autoSaveSection: (encounterId, sectionName, content, patientId) => {
    return axiosInstance.patch(`/patient-chart/encounter/${encounterId}/section/${sectionName}`, { content, patientId });
  },

  // Save vitals array
  saveVitals: (encounterId, vitalsArray) => {
    return axiosInstance.patch(`/patient-chart/encounter/${encounterId}/vitals`, vitalsArray);
  },

  // Sign Encounter
  signEncounter: (encounterId) => {
    return axiosInstance.post(`/encounters/${encounterId}/sign`);
  },

  // Get active chart for an appointment
  getChart: (appointmentId) => {
    return axiosInstance.get(`/patient-chart/appointment/${appointmentId}`);
  },

  // Save chart as draft
  saveDraft: (chartData) => {
    return axiosInstance.post(`/patient-chart/draft`, chartData);
  },

  // Submit chart
  submitChart: (chartData) => {
    return axiosInstance.post(`/patient-chart/submit`, chartData);
  },

  // Process Ambient Scribe Audio
  processAmbientScribe: (audioBlob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    return axiosInstance.post(`/patient-chart/ambient-scribe`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  // Get medications
  getMedications: () => {
    return axiosInstance.get('/medications');
  }
};

export default PatientChartAPI;
