import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  BookOpen, 
  Search, 
  Filter, 
  WifiOff, 
  ShieldCheck, 
  X,
  HeartPulse,
  Flame,
  Droplet,
  Bone
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';
import EmergencyCard from '../components/EmergencyCard';

export default function FirstAidLibrary() {
  const { lang, t } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();

  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  const initialSearch = searchParams.get('search') || '';
  const initialSeverity = searchParams.get('severity') || 'all';

  const [search, setSearch] = useState(initialSearch);
  const [selectedSeverity, setSelectedSeverity] = useState(initialSeverity);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    async function fetchEmergencies() {
      setLoading(true);
      try {
        const res = await api.getEmergencies({
          severity: selectedSeverity !== 'all' ? selectedSeverity : undefined,
          search: search.trim() || undefined,
          category: selectedCategory !== 'all' ? selectedCategory : undefined
        });

        if (res.data) {
          setEmergencies(res.data);
          setIsOffline(Boolean(res.is_offline));
        }
      } catch (err) {
        console.error('Failed to load first-aid library:', err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      fetchEmergencies();
    }, 200);

    return () => clearTimeout(timer);
  }, [search, selectedSeverity, selectedCategory]);

  const handleSeverityChange = (sev) => {
    setSelectedSeverity(sev);
    if (sev === 'all') {
      searchParams.delete('severity');
    } else {
      searchParams.set('severity', sev);
    }
    setSearchParams(searchParams);
  };

  const categories = [
    'all',
    'Cardiovascular',
    'Respiratory',
    'Trauma',
    'Thermal',
    'Neurological',
    'Toxins',
    'Environmental',
    'General'
  ];

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <BookOpen size={28} color="var(--primary-red)" />
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{t('library_title')}</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            {t('library_subtitle')}
          </p>
        </div>

        {/* Offline Cache Indicator Badge */}
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '0.4rem', 
          background: isOffline ? '#fef3c7' : '#ecfdf5', 
          color: isOffline ? '#92400e' : '#065f46', 
          padding: '0.4rem 0.8rem', 
          borderRadius: 'var(--radius-full)', 
          fontSize: '0.82rem', 
          fontWeight: 700,
          border: `1px solid ${isOffline ? '#fde68a' : '#a7f3d0'}`
        }}>
          {isOffline ? <WifiOff size={15} /> : <ShieldCheck size={15} />}
          <span>{isOffline ? 'Offline Mode (Local Cache)' : t('offline_ready')}</span>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
        <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input 
          type="text"
          className="form-input"
          style={{ paddingLeft: '2.8rem', paddingRight: '2.5rem', height: '48px', fontSize: '1rem', borderRadius: 'var(--radius-md)' }}
          placeholder={t('search_guides')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          id="library-search-input"
        />
        {search && (
          <button 
            onClick={() => setSearch('')}
            style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex' }}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Severity Filter Tabs */}
      <div className="filter-tabs-bar">
        <button 
          onClick={() => handleSeverityChange('all')}
          className={`filter-tab-btn ${selectedSeverity === 'all' ? 'active' : ''}`}
        >
          {t('filter_all')} ({emergencies.length})
        </button>

        <button 
          onClick={() => handleSeverityChange('critical')}
          className={`filter-tab-btn ${selectedSeverity === 'critical' ? 'active' : ''}`}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }}></span>
          {t('filter_critical')}
        </button>

        <button 
          onClick={() => handleSeverityChange('moderate')}
          className={`filter-tab-btn ${selectedSeverity === 'moderate' ? 'active' : ''}`}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }}></span>
          {t('filter_moderate')}
        </button>

        <button 
          onClick={() => handleSeverityChange('mild')}
          className={`filter-tab-btn ${selectedSeverity === 'mild' ? 'active' : ''}`}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
          {t('filter_mild')}
        </button>
      </div>

      {/* Category Pills Bar */}
      <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '0.3rem 0.75rem',
              borderRadius: '6px',
              fontSize: '0.82rem',
              fontWeight: selectedCategory === cat ? 700 : 500,
              background: selectedCategory === cat ? '#111827' : '#ffffff',
              color: selectedCategory === cat ? '#ffffff' : 'var(--text-secondary)',
              border: '1px solid var(--border-medium)',
              whiteSpace: 'nowrap'
            }}
          >
            {cat === 'all' ? 'All Types' : cat}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
          <BookOpen size={36} color="var(--primary-red)" style={{ margin: '0 auto 1rem auto', display: 'block' }} />
          Loading First-Aid Protocols...
        </div>
      ) : emergencies.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', background: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>No First-Aid Guides Found</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Try clearing filters or searching for different symptoms like "burn", "chest pain", or "bleeding".</p>
          <button onClick={() => { setSearch(''); setSelectedSeverity('all'); setSelectedCategory('all'); }} className="btn-primary">
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="cards-grid">
          {emergencies.map((item) => (
            <EmergencyCard key={item.id} emergency={item} />
          ))}
        </div>
      )}
    </div>
  );
}
