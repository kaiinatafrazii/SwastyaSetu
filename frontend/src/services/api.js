import axios from 'axios';
import { offlineStorage } from './offlineStorage';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('swasthyasetu_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const api = {
  // Authentication
  async login(credentials) {
    const response = await apiClient.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('swasthyasetu_token', response.data.token);
      localStorage.setItem('swasthyasetu_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async register(userData) {
    const response = await apiClient.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('swasthyasetu_token', response.data.token);
      localStorage.setItem('swasthyasetu_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async getMe() {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  async updateProfile(profileData) {
    const response = await apiClient.put('/auth/profile', profileData);
    if (response.data.user) {
      localStorage.setItem('swasthyasetu_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout() {
    localStorage.removeItem('swasthyasetu_token');
    localStorage.removeItem('swasthyasetu_user');
  },

  // Emergencies & First Aid Library
  async getEmergencies(params = {}) {
    try {
      const response = await apiClient.get('/emergencies', { params });
      if (response.data.success && response.data.data) {
        offlineStorage.cacheEmergencies(response.data.data);
      }
      return response.data;
    } catch (err) {
      console.warn('API getEmergencies network error. Attempting offline cache fallback:', err.message);
      const cached = offlineStorage.getCachedEmergencies();
      if (cached) {
        let filtered = [...cached];
        if (params.severity && params.severity !== 'all') {
          filtered = filtered.filter(e => e.severity === params.severity);
        }
        if (params.search) {
          const s = params.search.toLowerCase();
          filtered = filtered.filter(e => e.title.toLowerCase().includes(s) || e.description.toLowerCase().includes(s));
        }
        return { success: true, count: filtered.length, data: filtered, is_offline: true };
      }
      throw err;
    }
  },

  async getEmergencyById(id) {
    try {
      const response = await apiClient.get(`/emergencies/${id}`);
      return response.data;
    } catch (err) {
      const cachedList = offlineStorage.getCachedEmergencies();
      if (cachedList) {
        const found = cachedList.find(e => e.id === parseInt(id) || e.slug === id);
        if (found) return { success: true, data: found, is_offline: true };
      }
      throw err;
    }
  },

  async getEmergencySteps(emergencyId) {
    try {
      const response = await apiClient.get(`/emergencies/${emergencyId}/steps`);
      if (response.data.success) {
        offlineStorage.cacheEmergencySteps(emergencyId, response.data);
      }
      return response.data;
    } catch (err) {
      console.warn('API getEmergencySteps error. Attempting offline cache fallback:', err.message);
      const cached = offlineStorage.getCachedEmergencySteps(emergencyId);
      if (cached) {
        return { ...cached, is_offline: true };
      }
      throw err;
    }
  },

  // Helplines
  async getHelplines(category) {
    try {
      const params = category && category !== 'all' ? { category } : {};
      const response = await apiClient.get('/helplines', { params });
      if (response.data.success) {
        offlineStorage.cacheHelplines(response.data.data);
      }
      return response.data;
    } catch (err) {
      const cached = offlineStorage.getCachedHelplines();
      if (cached) {
        let filtered = [...cached];
        if (category && category !== 'all') {
          filtered = filtered.filter(h => h.category === category);
        }
        return { success: true, count: filtered.length, data: filtered, is_offline: true };
      }
      throw err;
    }
  },

  // Hospitals
  async getHospitals(params = {}) {
    try {
      const response = await apiClient.get('/hospitals', { params });
      if (response.data.success) {
        offlineStorage.cacheHospitals(response.data.data);
      }
      return response.data;
    } catch (err) {
      const cached = offlineStorage.getCachedHospitals();
      if (cached) {
        return { success: true, count: cached.length, data: cached, is_offline: true };
      }
      throw err;
    }
  },

  // Appointments (Protected)
  async getAppointments() {
    const response = await apiClient.get('/appointments');
    return response.data;
  },

  async createAppointment(appointmentData) {
    const response = await apiClient.post('/appointments', appointmentData);
    return response.data;
  },

  async cancelAppointment(id) {
    const response = await apiClient.put(`/appointments/${id}/cancel`);
    return response.data;
  },

  async deleteAppointment(id) {
    const response = await apiClient.delete(`/appointments/${id}`);
    return response.data;
  },

  // Health Records (Protected)
  async getHealthRecords() {
    const response = await apiClient.get('/health-records');
    return response.data;
  },

  async createHealthRecord(recordData) {
    const response = await apiClient.post('/health-records', recordData);
    return response.data;
  },

  async deleteHealthRecord(id) {
    const response = await apiClient.delete(`/health-records/${id}`);
    return response.data;
  },

  // Emergency Contacts
  async getEmergencyContacts() {
    const response = await apiClient.get('/user/contacts');
    return response.data;
  },

  async createEmergencyContact(contactData) {
    const response = await apiClient.post('/user/contacts', contactData);
    return response.data;
  },

  async deleteEmergencyContact(id) {
    const response = await apiClient.delete(`/user/contacts/${id}`);
    return response.data;
  },

  // AI Assistant Triage
  async askAssistant(query) {
    const response = await apiClient.post('/assistant', { query });
    return response.data;
  }
};
