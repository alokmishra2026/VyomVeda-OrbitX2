import io from 'socket.io-client';
import { Capacitor } from '@capacitor/core';

const DEV_URL = 'http://127.0.0.1:5001';
const ANDROID_HOST_URL = 'http://10.0.2.2:5001';

const getSocketURL = () => {
    if (import.meta.env.VITE_BACKEND_URL) return import.meta.env.VITE_BACKEND_URL;
    
    const platform = Capacitor.getPlatform();
    if (platform === 'android') return ANDROID_HOST_URL;
    return DEV_URL;
};

const socket = io(getSocketURL(), {
    transports: ['websocket'],
    autoConnect: true,
});

export default socket;
