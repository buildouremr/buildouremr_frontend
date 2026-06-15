import axiosInstance from "../../utils/useAPIClient";

const AppointmentsAPI = {
    getAppointmentStatusCounts: (userId, date) => {
        const apptDate = date || new Date().toISOString().split('T')[0];
        return axiosInstance.get(`/appointments/getAppointmentStatusCounts?userId=${userId}&apptDate=${apptDate}`);
    },

    getAppointments: (userId, apptDate, pageNo) =>
        axiosInstance.get(`/appointments/getAppointments?userId=${userId}&apptDate=${apptDate}&pageNo=${pageNo}`),

    getAppointmentPatientDetails: (appointmentId) =>
        axiosInstance.get(`/appointments/getAppointmentPatientDetails?appointmentId=${appointmentId}`),

    createAppointment: (data) =>
        axiosInstance.post(`/appointments/createAppointments`, data),

    getCreateApptDetails: () =>
        axiosInstance.get(`/appointments/getCreateApptDetails`),

    getPatients: (patientName) =>
        axiosInstance.get(`/appointments/getPatients?patientname=${patientName}`),
};

export default AppointmentsAPI;
