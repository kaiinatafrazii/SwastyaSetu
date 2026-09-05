import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { 
  PhoneCall, 
  Globe, 
  Eye, 
  Menu, 
  X, 
  HeartHandshake, 
  ShieldAlert, 
  BookOpen, 
  Building2, 
  Phone, 
  Bot, 
  User, 
  LayoutDashboard,
  LogOut
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { lang, toggleLanguage, isBoldLook, toggleBoldLook, t } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="site-header">
      {/* Top Emergency Strip */}
      <div className="top-emergency-strip">
        <div className="top-strip-inner">
          <div className="top-strip-left">
            <ShieldAlert size={16} />
            <span>{t('warning_banner_title')}</span>
          </div>
          <div className="top-strip-right">
            {/* Accessibility Bold Look toggle */}
            <button 
              onClick={toggleBoldLook} 
              className="bold-switch-btn"
              title="Toggle high-contrast bold look"
              aria-label="Toggle Bold Look"
            >
              <Eye size={14} />
              <span>{isBoldLook ? 'Standard Look' : t('bold_mode')}</span>
            </button>

            {/* Language Toggle */}
            <button 
              onClick={toggleLanguage} 
              className="lang-switch-btn"
              title="Toggle Language"
              aria-label="Toggle Language"
            >
              <Globe size={14} />
              <span>{lang === 'en' ? 'हिंदी' : 'English'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="header-container">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo" onClick={closeMobileMenu}>
          <div className="brand-icon-wrapper">
            <HeartHandshake size={26} />
          </div>
          <div className="brand-text">
            <div className="brand-title">
              Swasthya<span>Setu</span>
            </div>
            <div className="brand-tagline">
              {t('brand_tagline')}
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="main-nav" aria-label="Main Navigation">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
            <ShieldAlert size={17} />
            <span>{t('nav_home')}</span>
          </NavLink>
          
          <NavLink to="/library" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <BookOpen size={17} />
            <span>{t('nav_library')}</span>
          </NavLink>

          <NavLink to="/hospitals" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Building2 size={17} />
            <span>{t('nav_hospitals')}</span>
          </NavLink>

          <NavLink to="/helplines" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Phone size={17} />
            <span>{t('nav_helplines')}</span>
          </NavLink>

          <NavLink to="/assistant" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Bot size={17} />
            <span>{t('nav_assistant')}</span>
          </NavLink>

          <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={17} />
            <span>{t('nav_dashboard')}</span>
          </NavLink>
        </nav>

        {/* Header Right Actions */}
        <div className="header-actions">
          {/* Prominent CALL 112 Red Button */}
          <a 
            href="tel:112" 
            className="btn-call-112 animate-pulse-emergency"
            title="Dial National Emergency Helpline 112"
            id="emergency-call-112-btn"
          >
            <PhoneCall size={18} />
            <span>{t('call_112')}</span>
          </a>

          {/* User Auth links */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/profile" className="nav-link" title="My Profile">
                <User size={18} />
                <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.name?.split(' ')[0] || 'User'}
                </span>
              </Link>
              <button 
                onClick={logout} 
                className="nav-link" 
                title={t('nav_logout')}
                style={{ padding: '0.4rem', color: '#b91c1c' }}
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="nav-link" style={{ fontWeight: 700 }}>
              <User size={18} />
              <span>{t('nav_login')}</span>
            </Link>
          )}

          {/* Mobile Hamburger Button */}
          <button 
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(prev => !prev)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-menu">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMobileMenu} end>
            <ShieldAlert size={18} />
            <span>{t('nav_home')}</span>
          </NavLink>

          <NavLink to="/library" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>
            <BookOpen size={18} />
            <span>{t('nav_library')}</span>
          </NavLink>

          <NavLink to="/hospitals" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>
            <Building2 size={18} />
            <span>{t('nav_hospitals')}</span>
          </NavLink>

          <NavLink to="/helplines" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>
            <Phone size={18} />
            <span>{t('nav_helplines')}</span>
          </NavLink>

          <NavLink to="/assistant" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>
            <Bot size={18} />
            <span>{t('nav_assistant')}</span>
          </NavLink>

          <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>
            <LayoutDashboard size={18} />
            <span>{t('nav_dashboard')}</span>
          </NavLink>

          <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>
            <HeartHandshake size={18} />
            <span>{t('nav_about')}</span>
          </NavLink>

          {isAuthenticated ? (
            <>
              <NavLink to="/profile" className="nav-link" onClick={closeMobileMenu}>
                <User size={18} />
                <span>{user?.name} ({t('user_medical_profile')})</span>
              </NavLink>
              <button 
                onClick={() => { logout(); closeMobileMenu(); }} 
                className="nav-link" 
                style={{ color: '#b91c1c', textAlign: 'left', width: '100%' }}
              >
                <LogOut size={18} />
                <span>{t('nav_logout')}</span>
              </button>
            </>
          ) : (
            <NavLink to="/login" className="nav-link" onClick={closeMobileMenu}>
              <User size={18} />
              <span>{t('nav_login')} / {t('nav_register')}</span>
            </NavLink>
          )}
        </div>
      )}
    </header>
  );
}
