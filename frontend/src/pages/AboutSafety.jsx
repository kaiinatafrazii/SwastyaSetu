import React from 'react';
import { 
  HeartHandshake, 
  Award, 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  PhoneCall, 
  BookOpen, 
  CheckCircle2 
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function AboutSafety() {
  const { t } = useTheme();

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', background: 'var(--light-red)', color: 'var(--primary-red)', padding: '0.6rem', borderRadius: '12px', marginBottom: '0.75rem' }}>
          <HeartHandshake size={36} />
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem' }}>
          {t('about_title')}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          {t('about_subtitle')}
        </p>
      </div>

      {/* Good Samaritan Law Section */}
      <div className="dash-card" style={{ borderLeft: '6px solid #059669', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <Award size={26} color="#059669" />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
            {t('good_samaritan_title')}
          </h2>
        </div>

        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
          In India, the Supreme Court and the Ministry of Road Transport and Highways (MoRTH) have established strict legal safeguards to protect bystanders who help road crash or trauma victims:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', background: '#f0fdf4', padding: '1.25rem', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
            <CheckCircle2 size={18} color="#166534" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span style={{ fontSize: '0.95rem', color: '#14532d' }}>
              <strong>No Police Harassment:</strong> Good Samaritans are not forced to disclose their name, address, or identity, nor forced to become a witness.
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
            <CheckCircle2 size={18} color="#166534" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span style={{ fontSize: '0.95rem', color: '#14532d' }}>
              <strong>No Hospital Detainment:</strong> Hospitals (both government and private) cannot demand admission fees from the bystander who transports an injured victim.
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
            <CheckCircle2 size={18} color="#166534" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span style={{ fontSize: '0.95rem', color: '#14532d' }}>
              <strong>Immunity from Civil & Criminal Liability:</strong> Bystanders acting in good faith to save a life cannot be held liable for accidental complications.
            </span>
          </div>
        </div>
      </div>

      {/* The Golden Hour Section */}
      <div className="dash-card" style={{ borderLeft: '6px solid var(--primary-red)', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
          <Clock size={26} color="var(--primary-red)" />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
            {t('golden_hour_title')}
          </h2>
        </div>

        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
          The first 60 minutes following a severe physical injury, cardiovascular arrest, or stroke are known as the <strong>Golden Hour</strong>. Immediate first aid—such as opening an airway, controlling heavy bleeding, and chest compressions—prevents irreversible organ failure and dramatically boosts survival rates before advanced EMS arrives.
        </p>
      </div>

      {/* Medical Disclaimer Section */}
      <div style={{ background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
          <AlertTriangle size={24} color="#d97706" />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
            {t('disclaimer_title')}
          </h3>
        </div>

        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {t('disclaimer_text')} SwasthyaSetu does not provide direct medical treatment or replace licensed physicians, surgeons, or certified paramedics. Always dial 112 or transport critical patients to the nearest hospital trauma center immediately.
        </p>
      </div>
    </div>
  );
}
