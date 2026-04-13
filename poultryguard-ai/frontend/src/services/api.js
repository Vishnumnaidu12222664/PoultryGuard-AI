import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (email, password) => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
    return api.post('/auth/login', formData);
  },
  register: (userData) => api.post('/auth/register', userData),
};

export const diagnoseService = {
  uploadImage: (flockId, file) => {
    const formData = new FormData();
    formData.append('flock_id', flockId);
    formData.append('file', file);
    return api.post('/diagnose/image', formData);
  },
  uploadAudio: (flockId, file) => {
    const formData = new FormData();
    formData.append('flock_id', flockId);
    formData.append('file', file);
    return api.post('/diagnose/audio', formData);
  },
};

export const predictionService = {
  predictOutbreak: (data) => api.post('/predict/outbreak', data),
  predictEconomicLoss: (data) => api.post('/economic/loss', data),
};

export const chatService = {
  sendMessage: (sessionId, content) => api.post('/chat/vet-assistant', { session_id: sessionId, content }),
};

export const vaccinationService = {
  getAll: () => api.get('/vaccinations/'),
  create: (data) => api.post('/vaccinations/', data),
  update: (id, data) => api.put(`/vaccinations/${id}`, data),
  delete: (id) => api.delete(`/vaccinations/${id}`),
};

export const mapService = {
  getOutbreaks: () => api.get('/map/outbreaks'),
};

export default api;
