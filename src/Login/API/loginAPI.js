import axiosInstance from "../../utils/useAPIClient";

const LoginAPI = {
    login: (data) => axiosInstance.post("/login/login", data),

    logout: () => axiosInstance.post("/login/logout"),

    getCurrentUser: () => axiosInstance.get("/login/me"),

    sendOtp: (data) => axiosInstance.post("/login/forgot-password/send-otp", data),

    verifyOtp: (data) => axiosInstance.post("/login/forgot-password/verify-otp", data),

    resetPassword: (data) => axiosInstance.post("/login/forgot-password/reset", data),

    resendOtp: (data) => axiosInstance.post("/login/forgot-password/resend-otp", data),
};

export default LoginAPI;
