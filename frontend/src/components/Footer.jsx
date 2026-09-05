import React from 'react';
import { Link } from 'react-router-dom';
import { PhoneCall, ShieldAlert, HeartHandshake, Award } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Footer() {
  const { t } = useTheme();

  return (
    <footer className="site-footer">
      <div className="footer-container">
        {/* Col 1: Brand & Disclaimer */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <div style={{ background: '#d32f2f', padding: '0.35rem', borderRadius: '6px', color: '#fff', display: 'flex' }}>
              <HeartHandshake size={22} />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
              Swasthya<span style={{ color: '#ef5350' }}>Setu</span>
            </span>
          </div>
          <p style={{ fontSize: '0.88rem', lineHeight: 1.5, color: '#9ca3af', marginBottom: '1rem' }}>
            {t('disclaimer_text')}
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#1f2937', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem', color: '#6ee7b7' }}>
            <Award size={16} />
            <span>{t('good_samaritan_title')}</span>
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h4 className="footer-heading">Emergency Navigation</h4>
          <ul className="footer-links-list">
            <li><Link to="/">{t('nav_home')}</Link></li>
            <li><Link to="/library">{t('nav_library')}</Link></li>
            <li><Link to="/hospitals">{t('nav_hospitals')}</Link></li>
            <li><Link to="/helplines">{t('nav_helplines')}</Link></li>
            <li><Link to="/assistant">{t('nav_assistant')}</Link></li>
            <li><Link to="/about">{t('nav_about')}</Link></li>
          </ul>
        </div>

        {/* Col 3: Direct Emergency Dials */}
        <div>
          <h4 className="footer-heading">24x7 Emergency Helplines</h4>
          <ul className="footer-links-list">
            <li>
              <a href="tel:112" style={{ color: '#f87171', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <PhoneCall size={14} /> 112 - National Emergency (All-in-one)
              </a>
            </li>
            <li>
              <a href="tel:108" style={{ color: '#fca5a5', fontWeight: 600 }}>
                108 - Emergency Medical Ambulance
              </a>
            </li>
            <li>
              <a href="tel:102" style={{ color: '#e5e7eb' }}>
                102 - Maternal & Infant Transport
              </a>
            </li>
            <li>
              <a href="tel:1075" style={{ color: '#e5e7eb' }}>
                1075 - National Health Helpline (MoHFW)
              </a>
            </li>
            <li>
              <a href="tel:1066" style={{ color: '#e5e7eb' }}>
                1066 - National Poison Control (AIIMS)
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div>
          © {new Date().getFullYear()} SwasthyaSetu. Emergency Healthcare & First-Aid Bridge.
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/about">Good Samaritan Protection</Link>
          <Link to="/about">Medical Disclaimer</Link>
        </div>
      </div>
    </footer>
  );
}
