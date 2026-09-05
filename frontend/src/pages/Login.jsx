import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  AlertCircle, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Login() {
  const { login } = useAuth();
  const { t } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login({ email, password });
      if (res.success) {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoPatient = () => {
    setEmail('patient@swasthyasetu.org');
    setPassword('password123');
    setError('');
  };

  const fillDemoAdmin = () => {
    setEmail('admin@swasthyasetu.org');
    setPassword('password123');
    setError('');
  };

  return (
    <div style={{ maxWidth: '460px', margin: '2rem auto' }}>
      <div style={{ background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', padding: '2rem', boxShadow: 'var(--shadow-md)' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'inline-flex', background: 'var(--light-red)', color: 'var(--primary-red)', padding: '0.6rem', borderRadius: '12px', marginBottom: '0.75rem' }}>
            <Lock size={28} />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{t('login_title')}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            {t('login_subtitle')}
          </p>
        </div>

        {/* Demo Account Fill Bar */}
        <div style={{ background: 'var(--bg-main)', border: '1px dashed var(--border-medium)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', marginBottom: '1.25rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
            <Sparkles size={14} color="var(--primary-red)" />
            <span>Quick Demo Credentials</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            <button 
              type="button" 
              onClick={fillDemoPatient}
              className="btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem', fontWeight: 700 }}
              id="demo-patient-fill-btn"
            >
              {t('demo_patient_btn')}
            </button>

            <button 
              type="button" 
              onClick={fillDemoAdmin}
              className="btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem', fontWeight: 700 }}
              id="demo-admin-fill-btn"
            >
              {t('demo_admin_btn')}
            </button>
          </div>
        </div>

        {error && (
          <div style={{ background: '#fee2e2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">{t('email_label')}</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="email"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="name@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="login-email-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t('password_label')}</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="password"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="login-password-input"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: '100%', height: '46px', fontSize: '1rem', marginTop: '0.5rem' }}
            disabled={loading}
            id="login-submit-btn"
          >
            <span>{loading ? 'Signing In...' : t('sign_in_button')}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          {t('no_account')}{' '}
          <Link to="/register" style={{ color: 'var(--primary-red)', fontWeight: 700 }}>
            {t('register_now')}
          </Link>
        </div>
      </div>
    </div>
  );
}
