import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  PhoneCall, 
  Search, 
  ShieldAlert, 
  Building2, 
  BookOpen, 
  Award, 
  ArrowRight, 
  HeartPulse, 
  Clock, 
  Phone,
  Flame,
  Droplet,
  Wind
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';
import EmergencyBanner from '../components/EmergencyBanner';
import EmergencyCard from '../components/EmergencyCard';

export default function EmergencyHome() {
  const { lang, t } = useTheme();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [helplines, setHelplines] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [emRes, helpRes] = await Promise.all([
          api.getEmergencies(),
          api.getHelplines('national')
        ]);
        if (emRes.data) setEmergencies(emRes.data);
        if (helpRes.data) setHelplines(helpRes.data);
      } catch (err) {
        console.warn('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/library?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  // Top critical emergencies for fast triage
  const priorityEmergencies = emergencies.slice(0, 6);

  return (
    <div>
      {/* Top Warning Banner */}
      <EmergencyBanner />

      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-heading">
          {t('hero_title')}
        </h1>
        <p className="hero-subtitle">
          {t('hero_subtitle')}
        </p>

        {/* Hero Search */}
        <form onSubmit={handleSearchSubmit} className="hero-search-wrapper">
          <Search size={22} className="hero-search-icon" />
          <input 
            type="text"
            className="hero-search-input"
            placeholder={t('hero_search_placeholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            id="home-search-input"
          />
        </form>

        {/* Quick Shortcut Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <a 
            href="tel:112" 
            className="btn-call-112 animate-pulse-emergency"
            style={{ fontSize: '1rem', padding: '0.65rem 1.4rem' }}
          >
            <PhoneCall size={20} />
            <span>{t('call_112')}</span>
          </a>

          <Link to="/library" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}>
            <BookOpen size={18} />
            <span>{t('view_all_guides')}</span>
          </Link>

          <Link to="/hospitals" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}>
            <Building2 size={18} />
            <span>{t('locate_hospitals_cta')}</span>
          </Link>
        </div>
      </section>

      {/* Quick Emergency Access Section */}
      <section style={{ marginBottom: '2.5rem' }}>
        <div className="section-title-bar">
          <div className="section-title">
            <ShieldAlert size={26} color="var(--primary-red)" />
            <span>{t('critical_emergencies')}</span>
          </div>
          <Link to="/library" className="nav-link" style={{ color: 'var(--primary-red)', fontWeight: 700 }}>
            <span>{t('view_all_guides')}</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            Loading First-Aid Protocols...
          </div>
        ) : (
          <div className="cards-grid">
            {priorityEmergencies.map((item) => (
              <EmergencyCard key={item.id} emergency={item} />
            ))}
          </div>
        )}
      </section>

      {/* 24x7 Helplines Quick Strip */}
      <section className="helplines-strip">
        <div className="section-title-bar" style={{ marginBottom: '0.5rem' }}>
          <div className="section-title" style={{ fontSize: '1.25rem' }}>
            <Phone size={22} color="var(--primary-red)" />
            <span>{t('helpline_bar_title')}</span>
          </div>
          <Link to="/helplines" className="nav-link" style={{ color: 'var(--primary-red)', fontWeight: 700 }}>
            <span>View All</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="helplines-grid">
          <div className="helpline-box">
            <div>
              <span className="section-title-badge">Unified National</span>
              <h4 style={{ fontWeight: 800, marginTop: '0.4rem' }}>National Emergency</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Police, Fire, Ambulance</p>
            </div>
            <a href="tel:112" className="helpline-phone-btn">
              <PhoneCall size={18} /> 112
            </a>
          </div>

          <div className="helpline-box">
            <div>
              <span className="section-title-badge">Ambulance</span>
              <h4 style={{ fontWeight: 800, marginTop: '0.4rem' }}>Medical Ambulance</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Immediate EMS Dispatch</p>
            </div>
            <a href="tel:108" className="helpline-phone-btn">
              <PhoneCall size={18} /> 108
            </a>
          </div>

          <div className="helpline-box">
            <div>
              <span className="section-title-badge">Maternal</span>
              <h4 style={{ fontWeight: 800, marginTop: '0.4rem' }}>Infant & Pregnancy</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Maternal Transport</p>
            </div>
            <a href="tel:102" className="helpline-phone-btn">
              <PhoneCall size={18} /> 102
            </a>
          </div>

          <div className="helpline-box">
            <div>
              <span className="section-title-badge">Health MoHFW</span>
              <h4 style={{ fontWeight: 800, marginTop: '0.4rem' }}>National Health Line</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Medical Guidance</p>
            </div>
            <a href="tel:1075" className="helpline-phone-btn">
              <PhoneCall size={18} /> 1075
            </a>
          </div>
        </div>
      </section>

      {/* Golden Hour & Bystander Safety Info Box */}
      <section style={{ background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'var(--light-red)', color: 'var(--primary-red)', padding: '0.5rem', borderRadius: '8px', display: 'flex' }}>
            <Clock size={26} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{t('golden_hour_title')}</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              {t('golden_hour_desc')}
            </p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            <Award size={18} color="#059669" />
            <span>{t('good_samaritan_desc')}</span>
          </div>
          <Link to="/about" className="btn-secondary" style={{ fontSize: '0.85rem' }}>
            Learn More
          </Link>
        </div>
      </section>
    </div>
  );
}
