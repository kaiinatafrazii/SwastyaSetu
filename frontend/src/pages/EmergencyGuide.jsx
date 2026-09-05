import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShieldAlert, 
  PhoneCall, 
  BookOpen, 
  WifiOff, 
  AlertOctagon 
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';
import StepWizard from '../components/StepWizard';

export default function EmergencyGuide() {
  const { id } = useParams();
  const { lang, t } = useTheme();

  const [emergency, setEmergency] = useState(null);
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadSteps() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.getEmergencySteps(id);
        if (res.data) {
          setSteps(res.data);
          setEmergency(res.emergency || null);
          setIsOffline(Boolean(res.is_offline));
        } else {
          setError('No steps found for this emergency.');
        }
      } catch (err) {
        console.error('Error fetching emergency steps:', err);
        setError('Failed to load emergency steps. Please check connection or return to library.');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadSteps();
    }
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <ShieldAlert size={40} color="var(--primary-red)" style={{ margin: '0 auto 1rem auto', display: 'block' }} className="animate-pulse-emergency" />
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Loading Emergency Protocol Steps...</h2>
      </div>
    );
  }

  if (error || !emergency) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1rem', background: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
        <AlertOctagon size={44} color="var(--primary-red)" style={{ margin: '0 auto 1rem auto', display: 'block' }} />
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>Emergency Guide Unavailable</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{error || 'Unable to load emergency steps.'}</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <Link to="/library" className="btn-secondary">
            <ArrowLeft size={16} /> Back to Library
          </Link>
          <a href="tel:112" className="btn-call-112">
            <PhoneCall size={18} /> Call 112
          </a>
        </div>
      </div>
    );
  }

  const title = lang === 'hi' && emergency.title_hi ? emergency.title_hi : emergency.title;

  return (
    <div>
      {/* Back to Library Navigation & Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <Link to="/library" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', padding: '0.4rem 0.8rem' }}>
          <ArrowLeft size={16} />
          <span>{t('nav_library')}</span>
        </Link>

        {isOffline && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: '#fef3c7', color: '#92400e', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700 }}>
            <WifiOff size={14} /> Offline Mode Active
          </div>
        )}
      </div>

      {/* Emergency Wizard Component */}
      <StepWizard emergency={emergency} steps={steps} />
    </div>
  );
}
