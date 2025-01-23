// services/api.js
export const BASE_URL = 'http://15.206.149.28/api';
export const IMAGE_BASE_URL="http://15.206.149.28"
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Define the base URL

// Create an Axios instance
const instance = axios.create({
  baseURL: BASE_URL, // Correct the key to baseURL
  timeout: 10000, // Timeout of 10 seconds
});

// Request interceptor to add the Authorization header if the token is available
instance.interceptors.request.use(
  async config => {
    // Set default headers for JSON requests
    config.headers['Content-Type'] = 'application/json';

    // Get the token from AsyncStorage
    const token = await AsyncStorage.getItem('token');

    // If the token exists, set it in the request header
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('Token added to request header');
    } else {
      console.warn('No token found in AsyncStorage. Please log in.');
    }

    return config;
  },
  error => {
    // Handle request error
    return Promise.reject(error);
  },
);

// Response interceptor to handle 401 (Unauthorized) and token refresh
instance.interceptors.response.use(
  response => {
    // If the request is successful, simply return the response
    return response;
  },
  async error => {
    const originalRequest = error.config;

    // Handle unauthorized (401) errors
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // Handle token refresh logic here if your API supports it
        // For now, we assume the token is expired and remove it from AsyncStorage
        console.log('Token expired. Attempting to refresh token...');

        // Example: You might call a refresh token endpoint here
        // const refreshedToken = await refreshToken();
        // await AsyncStorage.setItem('token', refreshedToken);

        // Retry the original request with the new token (if you have refreshed the token)
        return instance(originalRequest);
      } catch (refreshError) {
        console.error('Failed to refresh token:', refreshError);
        // Clear token from AsyncStorage and handle unauthorized access
        AsyncStorage.removeItem('token');
        // You can redirect the user to the login screen here
      }
    }

    return Promise.reject(error);
  },
);

export default instance;

// Function to manually set the token in the Axios headers (if needed)
export const setAuthToken = async token => {
  if (token) {
    // Set the token in AsyncStorage
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

// const instance = axios.create({
//   BASE_URL: 'http://15.206.149.28/api', // Replace with your API base URL
//   timeout: 10000, // Timeout of 10 seconds
// });

// instance.interceptors.request.use(
//   async config => {
//     config.headers['Content-Type'] = 'application/json';

//     return config;
//   },
//   error => {
//     // Handle request error
//     return Promise.reject(error);
//   },
// );
// instance.interceptors.request.use(
//   async config => {
//     // Modify config, such as adding headers
//     const token = await AsyncStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   error => {
//     // Handle request error
//     return Promise.reject(error);
//   },
// );

// // Response interceptor
// instance.interceptors.response.use(
//   response => {
//     // Modify response data
//     return response;
//   },
//   async error => {
//     // Handle response error
//     const originalRequest = error.config;

//     // Token expired or unauthorized handling
//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
//         // Refresh token logic (if applicable)
//         // Example: const refreshedToken = await refreshToken();
//         // Example: AsyncStorage.setItem('token', refreshedToken);
//         console.log(
//           'Token expired. Refresh token logic should be implemented.',
//         );
//       } catch (refreshError) {
//         console.error('Failed to refresh token:', refreshError);
//         // Handle refresh token failure (e.g., redirect to login screen)
//         AsyncStorage.removeItem('token');
//         // Redirect to login screen or handle unauthorized access
//       }
//     }

//     return Promise.reject(error);
//   },
// );

// export default instance;

// export const setAuthToken = async token => {
//   if (token) {
//     // Set token in AsyncStorage
//     await AsyncStorage.setItem('token', token);
//     // Set token in Axios headers
//     instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//   } else {
//     // Remove token from AsyncStorage
//     await AsyncStorage.removeItem('token');
//     // Remove token from Axios headers
//     delete instance.defaults.headers.common['Authorization'];
//   }
// };
