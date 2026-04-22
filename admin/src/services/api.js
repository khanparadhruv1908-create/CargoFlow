import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Hardcode for now to be 100% sure
});

// Request interceptor to attach local JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('admin_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
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
        const message = error.response?.data?.message || 'Network Error - Is the backend running?';
        
        if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
            toast.error("Session expired. Please login again.");
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_user');
            window.location.href = '/login';
        } else if (error.response?.status !== 401) {
            toast.error(message);
        }

        return Promise.reject(error);
    }
);

export default api;
