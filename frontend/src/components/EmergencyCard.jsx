import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartPulse, 
  Wind, 
  Droplet, 
  Flame, 
  Bone, 
  UserX, 
  ShieldAlert, 
  AlertTriangle, 
  Thermometer, 
  Bug, 
  Sun, 
  Skull, 
  Zap, 
  Activity, 
  ArrowRight 
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ICON_MAP = {
  HeartPulse,
  Wind,
  Droplet,
  Flame,
  Bone,
  UserX,
  ShieldAlert,
  AlertTriangle,
  Thermometer,
  Bug,
  Sun,
  Skull,
  Zap,
  Activity
};

export default function EmergencyCard({ emergency }) {
  const { lang, t } = useTheme();

  const IconComponent = ICON_MAP[emergency.icon] || ShieldAlert;
  const severityClass = emergency.severity ? emergency.severity.toLowerCase() : 'critical';

  const title = lang === 'hi' && emergency.title_hi ? emergency.title_hi : emergency.title;
  const description = lang === 'hi' && emergency.description_hi ? emergency.description_hi : emergency.description;

  const symptomsList = Array.isArray(emergency.symptoms) ? emergency.symptoms.slice(0, 3) : [];

  return (
    <div className={`emergency-card ${severityClass}`}>
      <div>
        <div className="card-header">
          <div className="card-icon-title">
            <div className="card-icon-box">
              <IconComponent size={22} />
            </div>
            <div>
              <h3 className="card-title">{title}</h3>
              {lang === 'en' && emergency.title_hi && (
                <div className="card-title-hi">{emergency.title_hi}</div>
              )}
            </div>
          </div>
          <span className={`severity-pill ${severityClass}`}>
            {emergency.severity}
          </span>
        </div>

        <p className="card-description">
          {description}
        </p>

        {symptomsList.length > 0 && (
          <div className="card-symptoms-box">
            <div className="card-symptoms-label">{t('symptoms_label')}:</div>
            <ul className="symptoms-list">
              {symptomsList.map((symptom, idx) => (
                <li key={idx}>{symptom}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <Link 
        to={`/guide/${emergency.id}`} 
        className="btn-card-action"
        id={`emergency-btn-${emergency.id}`}
      >
        <span>{t('start_guide')}</span>
        <ArrowRight size={17} />
      </Link>
    </div>
  );
}
