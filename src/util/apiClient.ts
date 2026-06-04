import axios from 'axios';

// const API_BASE_URL = 'http://127.0.0.1:8000';
// const API_BASE_URL = 'http://10.3.43.72:8000';
const API_BASE_URL = 'https://api-majors.aztu.edu.az';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;