// Offline Caching & Fallback Service for SwasthyaSetu First-Aid Library

const CACHE_KEYS = {
  EMERGENCIES: 'swasthyasetu_cached_emergencies',
  STEPS_PREFIX: 'swasthyasetu_cached_steps_',
  HELPLINES: 'swasthyasetu_cached_helplines',
  HOSPITALS: 'swasthyasetu_cached_hospitals'
};

export const offlineStorage = {
  // Save emergencies list to localStorage
  cacheEmergencies(emergencies) {
    try {
      if (Array.isArray(emergencies) && emergencies.length > 0) {
        localStorage.setItem(CACHE_KEYS.EMERGENCIES, JSON.stringify(emergencies));
      }
    } catch (e) {
      console.warn('LocalStorage cache write error:', e);
    }
  },

  // Get cached emergencies
  getCachedEmergencies() {
    try {
      const data = localStorage.getItem(CACHE_KEYS.EMERGENCIES);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.warn('LocalStorage cache read error:', e);
      return null;
    }
  },

  // Cache emergency steps
  cacheEmergencySteps(emergencyId, stepsData) {
    try {
      if (emergencyId && stepsData) {
        localStorage.setItem(`${CACHE_KEYS.STEPS_PREFIX}${emergencyId}`, JSON.stringify(stepsData));
      }
    } catch (e) {
      console.warn('LocalStorage steps write error:', e);
    }
  },

  // Get cached emergency steps
  getCachedEmergencySteps(emergencyId) {
    try {
      const data = localStorage.getItem(`${CACHE_KEYS.STEPS_PREFIX}${emergencyId}`);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.warn('LocalStorage steps read error:', e);
      return null;
    }
  },

  // Cache Helplines
  cacheHelplines(helplines) {
    try {
      if (Array.isArray(helplines)) {
        localStorage.setItem(CACHE_KEYS.HELPLINES, JSON.stringify(helplines));
      }
    } catch (e) {
      console.warn('LocalStorage helplines write error:', e);
    }
  },

  getCachedHelplines() {
    try {
      const data = localStorage.getItem(CACHE_KEYS.HELPLINES);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  // Cache Hospitals
  cacheHospitals(hospitals) {
    try {
      if (Array.isArray(hospitals)) {
        localStorage.setItem(CACHE_KEYS.HOSPITALS, JSON.stringify(hospitals));
      }
    } catch (e) {
      console.warn('LocalStorage hospitals write error:', e);
    }
  },

  getCachedHospitals() {
    try {
      const data = localStorage.getItem(CACHE_KEYS.HOSPITALS);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }
};
