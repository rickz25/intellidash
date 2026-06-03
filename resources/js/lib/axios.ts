import axios from 'axios';

axios.interceptors.response.use(
    response => response,
    error => {
        const status = error.response?.status;

        if (status === 401 || status === 419) {
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default axios;