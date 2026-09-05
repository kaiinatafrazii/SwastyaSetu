import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  Navigation, 
  PhoneCall, 
  Bed, 
  Droplets, 
  Clock, 
  ShieldCheck, 
  LocateFixed, 
  AlertCircle 
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';

export default function Hospitals() {
  const { t } = useTheme();
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [radius, setRadius] = useState('15');
  const [emergencyOnly, setEmergencyOnly] = useState(false);

  // Detect location on mount
  useEffect(() => {
    detectLocation();
  }, []);

  // Fetch hospitals whenever location, radius, or filter changes
  useEffect(() => {
    async function loadHospitals() {
      setLoading(true);
      try {
        const params = {
          radius,
          emergencyOnly
        };
        if (userLocation) {
          params.lat = userLocation.latitude;
          params.lng = userLocation.longitude;
        }
        const res = await api.getHospitals(params);
        if (res.data) {
          setHospitals(res.data);
        }
      } catch (err) {
        console.error('Failed to load hospitals:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHospitals();
  }, [userLocation, radius, emergencyOnly]);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setLocating(false);
      },
      (error) => {
        console.warn('Geolocation error:', error.message);
        setLocationError(t('location_unavailable_note'));
        setLocating(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const getMapDirectionUrl = (hospital) => {
    const query = encodeURIComponent(`${hospital.name}, ${hospital.address}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <div style={{ background: 'var(--light-red)', color: 'var(--primary-red)', padding: '0.4rem', borderRadius: '8px', display: 'flex' }}>
              <Building2 size={26} />
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{t('hospitals_title')}</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            {t('hospitals_subtitle')}
          </p>
        </div>

        {/* Detect GPS Button */}
        <button 
          onClick={detectLocation} 
          className="btn-primary"
          style={{ fontSize: '0.9rem', padding: '0.55rem 1.1rem' }}
          disabled={locating}
        >
          <LocateFixed size={18} className={locating ? 'animate-pulse-emergency' : ''} />
          <span>{locating ? 'Detecting GPS...' : t('detect_location')}</span>
        </button>
      </div>

      {/* Location Status Notice */}
      {(!userLocation || locationError) && (
        <div style={{ 
          background: '#fffbeb', 
          border: '1px solid #fef3c7', 
          borderLeft: '4px solid #f59e0b', 
          color: '#92400e', 
          padding: '0.75rem 1rem', 
          borderRadius: 'var(--radius-sm)', 
          fontSize: '0.88rem', 
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{locationError || t('location_unavailable_note')}</span>
        </div>
      )}

      {/* Radius and Emergency Filter Controls */}
      <div style={{ 
        background: '#ffffff', 
        border: '1px solid var(--border-light)', 
        borderRadius: 'var(--radius-md)', 
        padding: '1rem 1.25rem', 
        marginBottom: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            {t('filter_radius')}:
          </span>

          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {['5', '15', '30', '50'].map((r) => (
              <button
                key={r}
                onClick={() => setRadius(r)}
                className={`filter-tab-btn ${radius === r ? 'active' : ''}`}
                style={{ padding: '0.3rem 0.8rem', fontSize: '0.85rem' }}
              >
                {r} km
              </button>
            ))}
          </div>
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>
          <input 
            type="checkbox"
            checked={emergencyOnly}
            onChange={(e) => setEmergencyOnly(e.target.checked)}
            style={{ width: '18px', height: '18px', accentColor: 'var(--primary-red)' }}
          />
          <span>{t('emergency_247_only')}</span>
        </label>
      </div>

      {/* Hospital Cards Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
          <Building2 size={36} color="var(--primary-red)" style={{ margin: '0 auto 1rem auto', display: 'block' }} />
          Locating nearby emergency medical facilities...
        </div>
      ) : hospitals.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', background: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Hospitals Found Within {radius} km</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Try expanding the search radius to 30 km or 50 km.</p>
          <button onClick={() => setRadius('50')} className="btn-primary">
            Expand to 50 km
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
          {hospitals.map((hosp) => (
            <div key={hosp.id} className="hospital-card">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem', gap: '0.5rem' }}>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    fontWeight: 700, 
                    background: 'var(--bg-main)', 
                    color: 'var(--text-secondary)', 
                    padding: '0.2rem 0.5rem', 
                    borderRadius: '4px' 
                  }}>
                    {hosp.type}
                  </span>

                  {hosp.distance_km != null && (
                    <span className="hospital-badge-distance">
                      <Navigation size={13} />
                      <span>{hosp.distance_km} km</span>
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827', marginBottom: '0.35rem' }}>
                  {hosp.name}
                </h3>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '0.9rem' }}>
                  <MapPin size={16} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{hosp.address}</span>
                </div>

                {/* Facilities Pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
                  {hosp.emergency_available && (
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, background: '#fee2e2', color: '#b91c1c', padding: '0.2rem 0.5rem', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Clock size={12} /> {hosp.open_hours || '24/7 Open'}
                    </span>
                  )}

                  {hosp.icu_beds > 0 && (
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, background: '#e0f2fe', color: '#0369a1', padding: '0.2rem 0.5rem', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Bed size={12} /> {hosp.icu_beds} ICU Beds
                    </span>
                  )}

                  {hosp.blood_bank && (
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, background: '#fef2f2', color: '#dc2626', padding: '0.2rem 0.5rem', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Droplets size={12} /> Blood Bank
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="hospital-actions">
                <a 
                  href={getMapDirectionUrl(hosp)} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-direction"
                  id={`hospital-dir-${hosp.id}`}
                >
                  <Navigation size={16} />
                  <span>{t('get_directions')}</span>
                </a>

                <a 
                  href={`tel:${hosp.phone}`} 
                  className="btn-hospital-call"
                  id={`hospital-call-${hosp.id}`}
                >
                  <PhoneCall size={16} />
                  <span>{t('call_hospital')}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
