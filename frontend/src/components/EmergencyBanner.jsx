import React from 'react';
import { Link } from 'react-router-dom';
import { AlertOctagon, PhoneCall, Building2, Flame } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function EmergencyBanner() {
  const { t } = useTheme();

  return (
    <div className="emergency-warning-banner" role="alert">
      <div className="banner-content">
        <div className="banner-text-group">
          <AlertOctagon size={32} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div className="banner-title">{t('warning_banner_title')}</div>
            <div className="banner-desc">{t('warning_banner_desc')}</div>
          </div>
        </div>

        <div className="banner-actions">
          <a href="tel:108" className="btn-banner-action">
            <PhoneCall size={16} />
            <span>{t('quick_call_ambulance')}</span>
          </a>
          <Link to="/hospitals" className="btn-banner-action">
            <Building2 size={16} />
            <span>{t('quick_find_hospital')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
