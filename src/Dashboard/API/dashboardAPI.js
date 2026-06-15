import axiosInstance from "../../utils/useAPIClient";

const DashboardAPI = {
    getDashboardSummary: (userId, date) => {
        const apptDate = date || new Date().toISOString().split('T')[0];
        return axiosInstance.get(`/dashboard/getSummary?userId=${userId}&apptDate=${apptDate}`);
    },

    getDashboardAppointments: (apptDate, pageNo) =>
        axiosInstance.get(`/dashboard/getAppointments?userId=1&apptDate=${apptDate}&pageNo=${pageNo}`),

    getTeamList: (userId) => axiosInstance.get(`/dashboard/getTeamList?userId=${userId}`),
};

export default DashboardAPI;
