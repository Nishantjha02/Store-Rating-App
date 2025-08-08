import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

// Admin API
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  createUser: (userData) => api.post('/admin/users', userData),
  getStores: (params) => api.get('/admin/stores', { params }),
  createStore: (storeData) => api.post('/admin/stores', storeData),
};

// User API
export const userAPI = {
  getStores: (params) => api.get('/user/stores', { params }),
  submitRating: (ratingData) => api.post('/user/rating', ratingData),
  updateRating: (ratingData) => api.put('/user/rating', ratingData),
  updatePassword: (passwordData) => api.put('/user/password', passwordData),
};

// Store API
export const storeAPI = {
  getDashboard: () => api.get('/store/dashboard'),
  getRatings: () => api.get('/store/ratings'),
  updatePassword: (passwordData) => api.put('/store/password', passwordData),
};

export default api;