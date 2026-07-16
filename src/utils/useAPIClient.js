import axios from "axios";

const BASE_URL = "http://localhost:8080/api";

// Create axios instance with cookie credentials
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true  // Required: sends HttpOnly cookies with every request
});

// REQUEST INTERCEPTOR
axiosInstance.interceptors.request.use(
    (config) => {
        // Prevent Chrome from aggressively caching GET requests by appending a unique timestamp
        if (config.method === 'get') {
            config.params = {
                ...config.params,
                _t: new Date().getTime()
            };
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR (Global Error Handling)
axiosInstance.interceptors.response.use(
    (response) => {
        console.log(`✅ [API SUCCESS] ${response.config.method.toUpperCase()} ${response.config.url} returned ${response.status}`);
        return response;
    },
    (error) => {
        const status = error?.response?.status;
        console.log(`❌ [API FAILED] ${error.config?.method?.toUpperCase()} ${error.config?.url} returned ${status}`);

        // Handle Unauthorized (Token Expired / Invalid)
        // Only fire the session-expired event when the user is expected to be logged in
        // (i.e. the request was NOT to a public auth endpoint).
        const url = error?.config?.url || '';
        const isPublicAuth = url.includes("/login/login")
            || url.includes("/login/forgot-password")
            || url.includes("/login/me")
            || url.includes("/login/logout")
            || url.includes("/login/register");

        if ((status === 401 || status === 403) && !isPublicAuth) {
            console.log("🔒 [SESSION EXPIRED] Dispatching session-expired event!");
            window.dispatchEvent(new Event("session-expired"));
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;