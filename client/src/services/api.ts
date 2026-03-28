import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const projectsAPI = {
  getAll: () => api.get('/projects'),
  getById: (id: string) => api.get(`/projects/${id}`),
  create: (data: any) => api.post('/projects', data),
  update: (id: string, data: any) => api.put(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
};

export const postsAPI = {
  getAll: (page = 1, limit = 10) => api.get(`/posts?page=${page}&limit=${limit}`),
  getById: (id: string) => api.get(`/posts/${id}`),
  create: (data: any) => api.post('/posts', data),
  update: (id: string, data: any) => api.put(`/posts/${id}`, data),
  delete: (id: string) => api.delete(`/posts/${id}`),
  like: (id: string) => api.post(`/posts/${id}/like`),
  addComment: (id: string, data: any) => api.post(`/posts/${id}/comment`, data),
};

export const skillsAPI = {
  getAll: () => api.get('/skills'),
  create: (data: any) => api.post('/skills', data),
  update: (id: string, data: any) => api.put(`/skills/${id}`, data),
  delete: (id: string) => api.delete(`/skills/${id}`),
};

export const uploadAPI = {
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deleteImage: (publicId: string) => api.delete('/upload', { data: { publicId } }),
};

export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
  trackEvent: (data: any) => api.post('/analytics/track', data),
};

export const resumeAPI = {
  get: () => api.get('/resume'),
  upload: (data: any) => api.post('/resume', data),
  delete: (id: string) => api.delete(`/resume/${id}`),
};

export const settingsAPI = {
  get: () => api.get('/settings'),
  update: (data: any) => api.put('/settings', data),
};

export const contentAPI = {
  get: (type: 'hero' | 'about') => api.get(`/content/${type}`),
  update: (type: 'hero' | 'about', data: any) => api.put(`/content/${type}`, data),
};

export const experienceAPI = {
  getAll: () => api.get('/experience'),
  create: (data: any) => api.post('/experience', data),
  update: (id: string, data: any) => api.put(`/experience/${id}`, data),
  delete: (id: string) => api.delete(`/experience/${id}`),
};

export const educationAPI = {
  getAll: () => api.get('/education'),
  create: (data: any) => api.post('/education', data),
  update: (id: string, data: any) => api.put(`/education/${id}`, data),
  delete: (id: string) => api.delete(`/education/${id}`),
};

export default api;
