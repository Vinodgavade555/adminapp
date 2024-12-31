// services/api.js

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://15.206.149.28/api', // Replace with your API base URL
  timeout: 10000, // Timeout of 10 seconds
});

instance.interceptors.request.use(
  async config => {
    config.headers['Content-Type'] = 'application/json';

    return config;
  },
  error => {
    // Handle request error
    return Promise.reject(error);
  },
);
instance.interceptors.request.use(
  async config => {
    // Modify config, such as adding headers
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    // Handle request error
    return Promise.reject(error);
  },
);

// Response interceptor
instance.interceptors.response.use(
  response => {
    // Modify response data
    return response;
  },
  async error => {
    // Handle response error
    const originalRequest = error.config;

    // Token expired or unauthorized handling
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Refresh token logic (if applicable)
        // Example: const refreshedToken = await refreshToken();
        // Example: AsyncStorage.setItem('token', refreshedToken);
        console.log(
          'Token expired. Refresh token logic should be implemented.',
        );
      } catch (refreshError) {
        console.error('Failed to refresh token:', refreshError);
        // Handle refresh token failure (e.g., redirect to login screen)
        AsyncStorage.removeItem('token');
        // Redirect to login screen or handle unauthorized access
      }
    }

    return Promise.reject(error);
  },
);

export default instance;

export const setAuthToken = async token => {
  if (token) {
    // Set token in AsyncStorage
    await AsyncStorage.setItem('token', token);
    // Set token in Axios headers
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    // Remove token from AsyncStorage
    await AsyncStorage.removeItem('token');
    // Remove token from Axios headers
    delete instance.defaults.headers.common['Authorization'];
  }
};
