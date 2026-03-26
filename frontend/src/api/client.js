import axios from 'axios';
import { Capacitor } from '@capacitor/core';

// Machine IP or production backend URL
const DEV_URL = 'http://127.0.0.1:5001'; // Default for web
const ANDROID_HOST_URL = 'http://10.0.2.2:5001'; // Default for Android Emulator to access local host
const REMOTE_URL = 'https://vyomveda-orbitx-backend.vercel.app'; // Mock production URL

const getBaseURL = () => {
    if (import.meta.env.VITE_BACKEND_URL) return import.meta.env.VITE_BACKEND_URL;
    
    const platform = Capacitor.getPlatform();
    if (platform === 'android') return ANDROID_HOST_URL;
    if (platform === 'ios') return 'http://localhost:5001'; // iOS simulator uses local host
    return DEV_URL;
};

const apiClient = axios.create({
    baseURL: getBaseURL(),
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Interceptor to add JWT
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default apiClient;
