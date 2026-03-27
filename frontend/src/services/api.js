import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

// We need a way to set the token from Clerk
let getTokenFunction = null;

export const setTokenGetter = (fn) => {
    getTokenFunction = fn;
};

// Request interceptor to attach JWT token from Clerk
api.interceptors.request.use(
    async (config) => {
        if (getTokenFunction) {
            try {
                const token = await getTokenFunction();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (error) {
                console.error("Error getting Clerk token", error);
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for global error handling
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const message = error.response?.data?.message || 'An unexpected error occurred';
        
        // Prevent toast spam (multiple requests failing at once)
        if (!window.lastErrorToast || Date.now() - window.lastErrorToast > 3000) {
            toast.error(message);
            window.lastErrorToast = Date.now();
        }

        if (error.response?.status === 401) {
            // Unauthorized - Clerk handles auth state, but we might want to redirect if not already on login
            if (!window.location.pathname.includes('/login')) {
                // window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default api;
