import axiosInstance from "../../utils/useAPIClient";

const AppointmentsAPI = {
    getAppointmentStatusCounts: (userId) =>
        axiosInstance.get(`/appointments/getAppointmentStatusCounts?userId=${userId}`),

    getAppointments: (userId) =>
        axiosInstance.get(`/appointments/getAppointments?userId=1`),

    getAppointmentPatientDetails: (appointmentId) =>
        axiosInstance.get(`/appointments/getAppointmentPatientDetails?appointmentId=${appointmentId}`),
};

export default AppointmentsAPI;
