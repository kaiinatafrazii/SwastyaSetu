import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  PhoneCall, 
  Copy, 
  Check, 
  ShieldCheck, 
  LifeBuoy, 
  Heart, 
  Users, 
  Brain, 
  AlertTriangle 
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';

export default function Helplines() {
  const { lang, t } = useTheme();
  const [helplines, setHelplines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    async function loadHelplines() {
      setLoading(true);
      try {
        const res = await api.getHelplines(selectedCategory);
        if (res.data) {
          setHelplines(res.data);
        }
      } catch (err) {
        console.error('Failed to load helplines:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHelplines();
  }, [selectedCategory]);

  const handleCopy = (id, phone) => {
    navigator.clipboard.writeText(phone);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const categories = [
    { id: 'all', label: t('cat_all'), icon: Phone },
    { id: 'national', label: t('cat_national'), icon: ShieldCheck },
    { id: 'medical', label: t('cat_medical'), icon: Heart },
    { id: 'women_children', label: t('cat_women_children'), icon: Users },
    { id: 'mental_health', label: t('cat_mental_health'), icon: Brain },
    { id: 'disaster', label: t('cat_disaster'), icon: AlertTriangle }
  ];

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
          <div style={{ background: 'var(--light-red)', color: 'var(--primary-red)', padding: '0.4rem', borderRadius: '8px', display: 'flex' }}>
            <Phone size={26} />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{t('helplines_title')}</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
          {t('helplines_subtitle')}
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="filter-tabs-bar">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`filter-tab-btn ${selectedCategory === cat.id ? 'active' : ''}`}
            >
              <Icon size={16} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Helplines List Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
          Loading Helplines Directory...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {helplines.map((item) => {
            const name = lang === 'hi' && item.name_hi ? item.name_hi : item.name;
            const description = lang === 'hi' && item.description_hi ? item.description_hi : item.description;

            return (
              <div 
                key={item.id} 
                style={{ 
                  background: '#ffffff', 
                  border: '1px solid var(--border-light)', 
                  borderRadius: 'var(--radius-md)', 
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-sm)',
                  borderTop: item.phone === '112' ? '4px solid #b71c1c' : '1px solid var(--border-light)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem', gap: '0.5rem' }}>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: 700, 
                      textTransform: 'uppercase', 
                      background: 'var(--bg-main)', 
                      padding: '0.2rem 0.5rem', 
                      borderRadius: '4px',
                      color: 'var(--text-secondary)'
                    }}>
                      {item.category.replace('_', ' ')}
                    </span>

                    {item.toll_free && (
                      <span style={{ 
                        fontSize: '0.72rem', 
                        fontWeight: 700, 
                        background: '#ecfdf5', 
                        color: '#047857', 
                        padding: '0.2rem 0.5rem', 
                        borderRadius: '4px' 
                      }}>
                        {t('toll_free_badge')}
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#111827', marginBottom: '0.4rem' }}>
                    {name}
                  </h3>

                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '1.25rem' }}>
                    {description}
                  </p>
                </div>

                {/* Dial Actions */}
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <a 
                    href={`tel:${item.phone}`}
                    className="btn-call-112"
                    style={{ flex: 1, justifyContent: 'center', fontSize: '1rem', padding: '0.6rem 1rem' }}
                    id={`helpline-call-${item.id}`}
                  >
                    <PhoneCall size={18} />
                    <span>{t('call_now')} ({item.phone})</span>
                  </a>

                  <button 
                    onClick={() => handleCopy(item.id, item.phone)}
                    className="btn-secondary"
                    title={t('copy_number')}
                    style={{ padding: '0.6rem 0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    {copiedId === item.id ? <Check size={18} color="#059669" /> : <Copy size={18} />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
