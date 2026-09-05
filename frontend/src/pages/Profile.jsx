import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Heart, 
  ShieldCheck, 
  Save, 
  CheckCircle, 
  AlertCircle 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const { t } = useTheme();

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    blood_group: user?.blood_group || 'O+',
    emergency_contact: user?.emergency_contact || '',
    allergies: user?.allergies || '',
    medical_conditions: user?.medical_conditions || ''
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');
    setLoading(true);

    try {
      const res = await updateProfile(form);
      if (res.success) {
        setMsg('Profile and medical information updated successfully.');
        setTimeout(() => setMsg(''), 4000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '650px', margin: '0 auto' }}>
      <div className="dash-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
          <div style={{ background: 'var(--light-red)', color: 'var(--primary-red)', padding: '0.5rem', borderRadius: '8px', display: 'flex' }}>
            <User size={26} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>User Profile & Medical Info</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              Account Email: <strong>{user?.email}</strong> • Role: <span style={{ textTransform: 'capitalize' }}>{user?.role}</span>
            </p>
          </div>
        </div>

        {msg && (
          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
            <CheckCircle size={18} />
            <span>{msg}</span>
          </div>
        )}

        {error && (
          <div style={{ background: '#fee2e2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">{t('full_name_label')}</label>
            <input 
              type="text" 
              className="form-input" 
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">{t('phone_label')}</label>
              <input 
                type="tel" 
                className="form-input" 
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t('blood_group')}</label>
              <select 
                className="form-select"
                value={form.blood_group}
                onChange={(e) => setForm({ ...form, blood_group: e.target.value })}
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Primary Emergency Contact Phone</label>
            <input 
              type="tel" 
              className="form-input" 
              placeholder="+91 9876543211"
              value={form.emergency_contact}
              onChange={(e) => setForm({ ...form, emergency_contact: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('known_allergies')}</label>
            <textarea 
              className="form-textarea" 
              rows="2"
              placeholder="e.g. Penicillin, Peanuts, Latex, Dust..."
              value={form.allergies}
              onChange={(e) => setForm({ ...form, allergies: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('chronic_conditions')}</label>
            <textarea 
              className="form-textarea" 
              rows="2"
              placeholder="e.g. Hypertension, Asthma, Type 2 Diabetes, Epilepsy..."
              value={form.medical_conditions}
              onChange={(e) => setForm({ ...form, medical_conditions: e.target.value })}
            />
          </div>

          <div style={{ marginTop: '1.25rem' }}>
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={loading}
              style={{ width: '100%', height: '46px', fontSize: '1rem' }}
            >
              <Save size={18} />
              <span>{loading ? 'Saving Changes...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
