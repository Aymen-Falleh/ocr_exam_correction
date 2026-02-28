import axios from 'axios';

const api = axios.create({
    baseURL: '/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('ocr_token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        // On 401, clear stored credentials and reject
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                const token = localStorage.getItem('ocr_token');
                if (token) {
                    localStorage.removeItem('ocr_token');
                    localStorage.removeItem('ocr_user');
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
