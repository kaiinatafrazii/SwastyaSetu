/**
 * API Service
 * Handles communication with backend, timeouts, retries, and offline fallback.
 */

import { getOfflineCategory } from '../data/offlineFirstAid';
import { getVideosForCategory } from '../data/emergencyVideos';

const API_BASE = '/api';

export async function analyzeSymptoms(description, isDemo = false) {
  // If offline, provide offline keyword matching directly
  if (!navigator.onLine) {
    return getOfflineAnalysis(description);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    const response = await fetch(`${API_BASE}/emergency/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description, isDemo }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.warn('[API Service] Falling back to local offline analysis:', err.message);
    return getOfflineAnalysis(description);
  }
}

export async function fetchCategories() {
  try {
    const res = await fetch(`${API_BASE}/emergency/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return await res.json();
  } catch {
    return {
      success: true,
      categories: Object.values(await import('../data/offlineFirstAid').then(m => m.offlineFirstAidData))
    };
  }
}

export async function fetchCategoryDetails(id) {
  try {
    const res = await fetch(`${API_BASE}/emergency/category/${id}`);
    if (!res.ok) throw new Error('Failed to fetch category details');
    return await res.json();
  } catch {
    const cat = getOfflineCategory(id);
    return {
      success: true,
      category: {
        ...cat,
        severityInfo: {
          level: cat.severity,
          label: cat.severity.toUpperCase(),
          color: cat.severity === 'critical' ? 'red' : 'orange'
        },
        videos: getVideosForCategory(id)
      }
    };
  }
}

export async function fetchNearbyFacilities(lat, lng, radius = 15000) {
  /*
    Overpass is free and heavily loaded; a real query against it takes
    20-40 seconds. The old 12s abort meant this never once succeeded.
  */
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);

  try {
    const res = await fetch(
      `${API_BASE}/facilities/nearby?lat=${lat}&lng=${lng}&radius=${radius}`,
      { signal: controller.signal }
    );

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      const err = new Error(body.error || `Server returned ${res.status}`);
      err.code = body.code || 'SERVER_ERROR';
      throw err;
    }

    return body;
  } catch (err) {
    if (err.name === 'AbortError') {
      const timeout = new Error('The map service did not respond in time.');
      timeout.code = 'TIMEOUT';
      throw timeout;
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function fetchDashboardStats() {
  try {
    const res = await fetch(`${API_BASE}/dashboard/stats`);
    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    return await res.json();
  } catch (err) {
    /*
      No invented numbers here. This screen reports how much the service is
      actually being used; filling it with plausible-looking figures when the
      server is down makes it worse than useless.
    */
    console.warn('[API Service] Dashboard stats unavailable:', err.message);
    return { success: false, error: 'unavailable' };
  }
}

/**
 * Client-side keyword categorization for total offline resilience
 */
function getOfflineAnalysis(text) {
  const lower = (text || '').toLowerCase();
  let categoryId = 'other_emergency';

  if (lower.includes('chest') || lower.includes('heart') || lower.includes('angina')) categoryId = 'chest_pain';
  else if (lower.includes('breath') || lower.includes('suffocat') || lower.includes('asthma') || lower.includes('gasp')) categoryId = 'breathing_difficulty';
  else if (lower.includes('bleed') || lower.includes('blood') || lower.includes('cut') || lower.includes('wound')) categoryId = 'severe_bleeding';
  else if (lower.includes('burn') || lower.includes('fire') || lower.includes('scald')) categoryId = 'burns';
  else if (lower.includes('fractur') || lower.includes('bone') || lower.includes('sprain') || lower.includes('fall')) categoryId = 'fracture';
  else if (lower.includes('unconscious') || lower.includes('faint') || lower.includes('collapsed') || lower.includes('passed out')) categoryId = 'unconsciousness';
  else if (lower.includes('seizure') || lower.includes('convuls') || lower.includes('epilep') || lower.includes('shaking')) categoryId = 'seizure';
  else if (lower.includes('poison') || lower.includes('swallow') || lower.includes('overdose') || lower.includes('toxic') || lower.includes('pesticide')) categoryId = 'poisoning';
  else if (lower.includes('stroke') || lower.includes('slur') || lower.includes('paraly') || lower.includes('droop')) categoryId = 'stroke';
  else if (lower.includes('allerg') || lower.includes('anaph') || lower.includes('hive') || lower.includes('swell')) categoryId = 'allergic_reaction';
  else if (lower.includes('chok') || lower.includes('throat') || lower.includes('stuck')) categoryId = 'choking';
  else if (lower.includes('fever') || lower.includes('temperature') || lower.includes('hot') || lower.includes('chill')) categoryId = 'high_fever';
  else if (lower.includes('snake') || lower.includes('bite') || lower.includes('insect') || lower.includes('sting') || lower.includes('scorpion')) categoryId = 'snake_bite';

  const category = getOfflineCategory(categoryId);
  const isCritical = category.severity === 'critical';

  return {
    success: true,
    assessment: {
      category: {
        id: category.id,
        name: category.name,
        nameHi: category.nameHi,
        icon: category.icon,
        description: category.description,
        descriptionHi: category.descriptionHi
      },
      severity: {
        level: category.severity,
        label: isCritical ? 'Critical' : 'Urgent',
        labelHi: isCritical ? 'गंभीर' : 'अत्यावश्यक',
        color: isCritical ? 'red' : 'orange',
        icon: isCritical ? '🔴' : '🟠',
        message: isCritical ? 'Immediate professional emergency help required.' : 'Medical attention required as soon as possible.',
        messageHi: isCritical ? 'तत्काल पेशेवर आपातकालीन सहायता आवश्यक।' : 'जल्द से जल्द चिकित्सा ध्यान आवश्यक।',
        callEmergency: isCritical
      },
      immediateAction: category.immediateAction,
      emergencyCallPrompt: isCritical
    },
    firstAid: {
      steps: category.firstAidSteps,
      warnings: category.warnings,
      warningsHi: category.warningsHi,
      doNots: category.doNots
    },
    videos: getVideosForCategory(categoryId),
    safety: {
      disclaimer: 'This information is for emergency first-aid support only. It does not replace a doctor or emergency medical service.',
      disclaimerHi: 'यह जानकारी केवल आपातकालीन प्राथमिक चिकित्सा सहायता के लिए है। यह डॉक्टर या आपातकालीन चिकित्सा सेवा का विकल्प नहीं है।',
      seekProfessionalHelp: true,
      safetyOverride: false
    },
    meta: {
      source: 'offline_client_engine',
      confidence: 0.6
    }
  };
}

/**
 * LocalStorage-backed client API for Patient Dashboard
 * Works seamlessly offline without requiring login/auth
 */
export const api = {
  async getAppointments() {
    try {
      const data = localStorage.getItem('swasthyasetu_appointments');
      if (!data) {
        const initial = [
          {
            id: 'appt-1',
            doctor_name: 'Dr. Rajiv Gupta',
            department: 'Cardiology',
            appointment_date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
            appointment_time: '10:30 AM',
            reason: 'Routine ECG & Blood Pressure follow-up',
            status: 'confirmed'
          },
          {
            id: 'appt-2',
            doctor_name: 'Dr. Ananya Sharma',
            department: 'General Medicine',
            appointment_date: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
            appointment_time: '02:00 PM',
            reason: 'Annual Health Checkup & Blood Sugar Test',
            status: 'confirmed'
          }
        ];
        localStorage.setItem('swasthyasetu_appointments', JSON.stringify(initial));
        return { success: true, data: initial };
      }
      return { success: true, data: JSON.parse(data) };
    } catch {
      return { success: true, data: [] };
    }
  },

  async createAppointment(appt) {
    const res = await this.getAppointments();
    const list = res.data || [];
    const newAppt = {
      id: 'appt-' + Date.now(),
      ...appt,
      status: 'confirmed',
      created_at: new Date().toISOString()
    };
    list.unshift(newAppt);
    localStorage.setItem('swasthyasetu_appointments', JSON.stringify(list));
    return { success: true, data: newAppt };
  },

  async cancelAppointment(id) {
    const res = await this.getAppointments();
    const list = res.data || [];
    const updated = list.map(item => item.id === id ? { ...item, status: 'cancelled' } : item);
    localStorage.setItem('swasthyasetu_appointments', JSON.stringify(updated));
    return { success: true };
  },

  async deleteAppointment(id) {
    const res = await this.getAppointments();
    const list = (res.data || []).filter(item => item.id !== id);
    localStorage.setItem('swasthyasetu_appointments', JSON.stringify(list));
    return { success: true };
  },

  async getHealthRecords() {
    try {
      const data = localStorage.getItem('swasthyasetu_records');
      if (!data) {
        const initial = [
          {
            id: 'rec-1',
            record_type: 'Lab Report',
            title: 'Complete Blood Count (CBC) & Lipid Panel',
            doctor_or_lab: 'Apollo Diagnostics',
            record_date: new Date(Date.now() - 86400000 * 7).toISOString().split('T')[0],
            description: 'Hemoglobin: 14.2 g/dL, Total Cholesterol: 185 mg/dL. All parameters normal.'
          },
          {
            id: 'rec-2',
            record_type: 'Prescription',
            title: 'Cardiology Maintenance Rx',
            doctor_or_lab: 'Dr. Rajiv Gupta',
            record_date: new Date(Date.now() - 86400000 * 14).toISOString().split('T')[0],
            description: 'Amlodipine 5mg OD, Aspirin 75mg post lunch. Review after 30 days.'
          }
        ];
        localStorage.setItem('swasthyasetu_records', JSON.stringify(initial));
        return { success: true, data: initial };
      }
      return { success: true, data: JSON.parse(data) };
    } catch {
      return { success: true, data: [] };
    }
  },

  async createHealthRecord(rec) {
    const res = await this.getHealthRecords();
    const list = res.data || [];
    const newRecord = {
      id: 'rec-' + Date.now(),
      ...rec,
      created_at: new Date().toISOString()
    };
    list.unshift(newRecord);
    localStorage.setItem('swasthyasetu_records', JSON.stringify(list));
    return { success: true, data: newRecord };
  },

  async deleteHealthRecord(id) {
    const res = await this.getHealthRecords();
    const list = (res.data || []).filter(item => item.id !== id);
    localStorage.setItem('swasthyasetu_records', JSON.stringify(list));
    return { success: true };
  },

  async getEmergencyContacts() {
    try {
      const data = localStorage.getItem('swasthyasetu_contacts');
      if (!data) {
        const initial = [
          {
            id: 'con-1',
            name: 'Pooja Verma',
            relationship: 'Spouse',
            phone: '+91 98765 43210',
            is_primary: true
          },
          {
            id: 'con-2',
            name: 'Ramesh Sharma',
            relationship: 'Brother / Family Doctor',
            phone: '+91 98123 45678',
            is_primary: false
          }
        ];
        localStorage.setItem('swasthyasetu_contacts', JSON.stringify(initial));
        return { success: true, data: initial };
      }
      return { success: true, data: JSON.parse(data) };
    } catch {
      return { success: true, data: [] };
    }
  },

  async createEmergencyContact(con) {
    const res = await this.getEmergencyContacts();
    let list = res.data || [];
    if (con.is_primary) {
      list = list.map(c => ({ ...c, is_primary: false }));
    }
    const newContact = {
      id: 'con-' + Date.now(),
      ...con,
      created_at: new Date().toISOString()
    };
    list.push(newContact);
    localStorage.setItem('swasthyasetu_contacts', JSON.stringify(list));
    return { success: true, data: newContact };
  },

  async deleteEmergencyContact(id) {
    const res = await this.getEmergencyContacts();
    const list = (res.data || []).filter(item => item.id !== id);
    localStorage.setItem('swasthyasetu_contacts', JSON.stringify(list));
    return { success: true };
  },

  getProfile() {
    try {
      const p = localStorage.getItem('swasthyasetu_profile');
      if (p) return JSON.parse(p);
    } catch {}
    return {
      name: 'Aarav Sharma',
      email: 'aarav.sharma@swasthyasetu.org',
      phone: '+91 98765 00000',
      blood_group: 'B+',
      allergies: 'Penicillin, Dust Mites',
      medical_conditions: 'Mild Hypertension'
    };
  },

  saveProfile(profile) {
    localStorage.setItem('swasthyasetu_profile', JSON.stringify(profile));
    return { success: true, data: profile };
  },

  // Mock methods in case AuthContext is touched
  async getMe() {
    return { success: true, user: this.getProfile() };
  },
  async login(cred) {
    return { success: true, user: this.getProfile(), token: 'mock-token' };
  },
  async register(data) {
    return { success: true, user: this.getProfile(), token: 'mock-token' };
  },
  logout() {
    localStorage.removeItem('swasthyasetu_token');
  },
  async updateProfile(profileData) {
    return this.saveProfile(profileData);
  }
};
