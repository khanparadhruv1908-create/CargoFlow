import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

let getTokenFunction = null;

export const setTokenGetter = (fn) => {
    getTokenFunction = fn;
};

// Request interceptor to attach JWT token
api.interceptors.request.use(
    async (config) => {
        if (getTokenFunction) {
            try {
                const token = await getTokenFunction();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (error) {
                console.error("Error getting Clerk token in Admin", error);
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
        toast.error(message);

        if (error.response?.status === 401) {
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default api;
