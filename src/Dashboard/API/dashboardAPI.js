import axiosInstance from "../../utils/useAPIClient";

const DashboardAPI = {
    getDashboardSummary: (userId) => axiosInstance.get(`/dashboard/getSummary?userId=${userId}`),

    getDashboardAppointments: () => axiosInstance.get("/dashboard/getAppointments?userId=1"),

    getTeamList: (userId) => axiosInstance.get(`/dashboard/getTeamList?userId=${userId}`),
};

export default DashboardAPI;
