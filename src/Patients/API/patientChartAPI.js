import axiosInstance from "../../utils/useAPIClient";

const PatientChartAPI = {
  // Get patient snapshot (demographics, allergies, chronic conditions, risk factors)
  getPatientSnapshot: (patientId, encounterId) => {
    let url = `/patient-chart/${patientId}/snapshot`;
    if (encounterId) {
      url += `?encounterId=${encounterId}`;
    }
    return axiosInstance.get(url);
  },

  getPatientProfile: (patientId) => {
    return axiosInstance.get(`/patient-chart/${patientId}/profile`);
  },

  getPatientHeader: (patientId) => {
    return axiosInstance.get(`/patient-chart/${patientId}/header`);
  },

  getChartByEncounter: (patientId, encounterId) => {
    return axiosInstance.get(`/patient-chart/encounter/${encounterId}?patientId=${patientId}`);
  },

  // Sign Encounter
  signEncounter: (encounterId, noteName) => {
    let url = `/encounters/${encounterId}/sign`;
    if (noteName) {
      url += `?noteName=${encodeURIComponent(noteName)}`;
    }
    return axiosInstance.post(url);
  },

  // Get active chart for an appointment
  getChart: (appointmentId) => {
    return axiosInstance.get(`/patient-chart/appointment/${appointmentId}`);
  },

  // Save chart
  saveChart: (chartData) => {
    return axiosInstance.post(`/patient-chart/save`, chartData);
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

  // Get all medications
  getMedications: () => {
    return axiosInstance.get('/medications/all');
  },

  // Search medications
  searchMedications: (keyword) => {
    return axiosInstance.get(`/medications/search?keyword=${encodeURIComponent(keyword)}`);
  },

  // Search assessments
  searchAssessments: (keyword) => {
    return axiosInstance.get(`/assessments/search?keyword=${encodeURIComponent(keyword)}`);
  },

  // Get recent assessments
  getRecentAssessments: () => {
    return axiosInstance.get('/assessments/recent');
  },

  // Save patient allergies
  savePatientAllergies: (patientId, allergiesData) => {
    return axiosInstance.post(`/patient-chart/patient/${patientId}/allergies`, allergiesData);
  },

  // Save patient chronic conditions
  savePatientChronicConditions: (patientId, conditionsData) => {
    return axiosInstance.post(`/patient-chart/patient/${patientId}/chronic-conditions`, conditionsData);
  }
};

export default PatientChartAPI;
