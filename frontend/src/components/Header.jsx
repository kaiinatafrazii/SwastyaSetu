import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Phone, 
  Home, 
  HeartPulse, 
  Sparkles, 
  HeartHandshake, 
  Target, 
  LayoutDashboard 
} from 'lucide-react';

export default function Header() {
  const { language, setLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const hi = language === 'hi';

  const navItems = [
    { type: 'anchor', target: 'home', icon: Home, label: hi ? 'होम' : 'Home' },
    { type: 'anchor', target: 'about', icon: HeartPulse, label: hi ? 'हमारे बारे में' : 'About' },
    { type: 'anchor', target: 'features', icon: Sparkles, label: hi ? 'सुविधाएँ' : 'Features' },
    { type: 'anchor', target: 'inspiration', icon: HeartHandshake, label: hi ? 'विचार व प्रेरणा' : 'Inspiration' },
    { type: 'anchor', target: 'vision', icon: Target, label: hi ? 'विज़न व लक्ष्य' : 'Vision & Goal' },
    { type: 'route', to: '/my-dashboard', icon: LayoutDashboard, label: hi ? 'डैशबोर्ड' : 'Dashboard', highlight: true }
  ];

  const handleNavClick = (e, item) => {
    if (item.type === 'anchor') {
      e.preventDefault();
      if (location.pathname !== '/') {
        navigate(`/#${item.target}`);
        setTimeout(() => {
          const el = document.getElementById(item.target);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 120);
      } else {
        const el = document.getElementById(item.target);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          window.history.replaceState(null, '', `#${item.target}`);
        }
      }
    }
  };

  return (
    <header className="site-header">
      <div className="site-header__bar">
        {/* Top-Left: Logo & Title */}
        <Link to="/" className="site-header__brand">
          <span className="site-header__mark" aria-hidden="true">
            <HeartPulse size={24} color="#ffffff" strokeWidth={2.5} />
          </span>
          <span className="site-header__words">
            <span className="site-header__name">
              {hi ? 'स्वास्थ्‍यसेतु' : 'SwasthyaSetu'}
            </span>
            <span className="site-header__tag">
              {hi ? 'ग्रामीण आपातकालीन स्वास्थ्य सेतु' : 'Rural Emergency & Health Bridge'}
            </span>
          </span>
        </Link>

        {/* Top-Right: Emergency Call & Language Switcher */}
        <div className="site-header__right">
          <a href="tel:112" className="site-header__call is-pulsing">
            <Phone size={18} fill="currentColor" />
            <span>{hi ? '112 पर कॉल' : 'Call 112'}</span>
          </a>

          <div className="lang-switch" role="group" aria-label="Language Selector">
            <button 
              type="button"
              onClick={() => setLanguage('en')} 
              aria-pressed={language === 'en'}
              title="English"
            >
              EN
            </button>
            <button 
              type="button"
              onClick={() => setLanguage('hi')} 
              aria-pressed={language === 'hi'}
              title="हिन्दी"
            >
              हिं
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Bar */}
      <nav className="site-nav no-print">
        <div className="site-nav__inner">
          {navItems.map((item) => {
            const Icon = item.icon;
            if (item.type === 'route') {
              const isActive = location.pathname === item.to;
              return (
                <Link 
                  key={item.to} 
                  to={item.to} 
                  aria-current={isActive ? 'page' : undefined}
                  style={item.highlight ? { 
                    fontWeight: 800, 
                    color: isActive ? '#991b1b' : '#b91c1c', 
                    background: isActive ? '#fee2e2' : '#fef2f2',
                    border: '1px solid #fecaca' 
                  } : undefined}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            }

            return (
              <a 
                key={item.target} 
                href={`#${item.target}`}
                onClick={(e) => handleNavClick(e, item)}
              >
                <Icon size={16} />
                {item.label}
              </a>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
