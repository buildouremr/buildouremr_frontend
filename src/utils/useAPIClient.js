import axios from "axios";

const BASE_URL = "http://localhost:8080/api";

// ✅ Create instance
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

// ✅ REQUEST INTERCEPTOR (Attach Token Automatically)
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        // Skip token for auth APIs if needed
        const isAuthApi = config.url.includes("/login/login") || config.url.includes("/login/auth");

        if (token && !isAuthApi) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// ✅ RESPONSE INTERCEPTOR (Global Error Handling)
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;

        // 🔐 Handle Unauthorized (Token Expired / Invalid)
        if (status === 401 || status === 403) {
            localStorage.removeItem("token");

            // Dispatch event to show custom UI modal
            window.dispatchEvent(new Event("session-expired"));
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;