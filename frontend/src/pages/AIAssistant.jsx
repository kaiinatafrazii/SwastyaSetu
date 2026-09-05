import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  AlertTriangle, 
  PhoneCall, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Clock 
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';

export default function AIAssistant() {
  const { t } = useTheme();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      sender: 'assistant',
      disclaimer: '⚠️ Medical Disclaimer: SwasthyaSetu AI Assistant provides immediate first-aid guidance based on standard resuscitation protocols. It is NOT a substitute for professional medical diagnosis. In any life-threatening emergency, dial 112 or 108 immediately.',
      data: {
        title: 'Emergency First-Aid Triage Ready',
        urgency: 'ASSISTANCE READY',
        summary: 'I can guide you through step-by-step first-aid protocols for cardiac arrest (CPR), severe bleeding, burns, choking, fractures, snake bites, or high fever.',
        action_steps: [
          'Type the victim\'s symptoms or what emergency occurred in the box below.',
          'If the person is unconscious or not breathing normally, call 112 immediately and begin chest compressions.',
          'Keep calm and follow the recommended action checklist.'
        ],
        dos: ['Ensure scene safety first', 'Call 112 for severe trauma'],
        donts: ['Do NOT leave unconscious victims alone'],
        emergency_hotline: 'Call 112 for Immediate Emergency'
      }
    }
  ]);

  const quickPrompts = [
    'How to perform Hands-Only CPR?',
    'What to do for severe bleeding?',
    'First aid for 2nd degree burn',
    'Adult choking Heimlich maneuver',
    'Chest pain & heart attack steps',
    'Snake bite first aid protocol'
  ];

  const handleSend = async (questionText) => {
    const textToSend = questionText || query;
    if (!textToSend.trim() || loading) return;

    const userMessage = { sender: 'user', text: textToSend };
    setChatHistory(prev => [...prev, userMessage]);
    setQuery('');
    setLoading(true);

    try {
      const res = await api.askAssistant(textToSend);
      if (res.success) {
        setChatHistory(prev => [
          ...prev,
          {
            sender: 'assistant',
            disclaimer: res.disclaimer,
            data: res.response
          }
        ]);
      }
    } catch (err) {
      setChatHistory(prev => [
        ...prev,
        {
          sender: 'assistant',
          disclaimer: '⚠️ Service note: Unable to reach online assistant.',
          data: {
            title: 'First-Aid Fallback Protocol',
            urgency: 'CRITICAL',
            summary: 'Ensure airway is open, check breathing, and dial 112 immediately.',
            action_steps: [
              'Call 112 without delay.',
              'Keep the patient seated or resting in recovery position.',
              'Open First Aid Library tab for offline-cached step-by-step instructions.'
            ],
            dos: ['Call 112 immediately'],
            donts: ['Do not delay calling paramedics'],
            emergency_hotline: 'Call 112'
          }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
          <div style={{ background: 'linear-gradient(135deg, var(--primary-red), #991b1b)', color: '#ffffff', padding: '0.4rem', borderRadius: '8px', display: 'flex' }}>
            <Bot size={26} />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{t('assistant_title')}</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)' }}>
          {t('assistant_subtitle')}
        </p>
      </div>

      {/* Strict Disclaimer Banner */}
      <div className="disclaimer-banner">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
          <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>{t('assistant_disclaimer')}</span>
        </div>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <Sparkles size={14} color="var(--primary-red)" />
          <span>{t('suggested_prompts')}</span>
        </div>
        <div className="suggested-pills">
          {quickPrompts.map((p, idx) => (
            <button key={idx} onClick={() => handleSend(p)} className="prompt-pill">
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.5rem' }}>
        {chatHistory.map((msg, index) => {
          if (msg.sender === 'user') {
            return (
              <div key={index} style={{ alignSelf: 'flex-end', maxWidth: '80%', background: '#111827', color: '#ffffff', padding: '0.85rem 1.25rem', borderRadius: '16px 16px 2px 16px', fontWeight: 600, fontSize: '0.95rem' }}>
                {msg.text}
              </div>
            );
          }

          const resp = msg.data;
          const urgencyColor = resp.urgency?.includes('CRITICAL') ? '#b91c1c' : '#0369a1';

          return (
            <div key={index} className="ai-chat-card" style={{ borderLeft: `5px solid ${urgencyColor}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', background: resp.urgency?.includes('CRITICAL') ? '#fee2e2' : '#e0f2fe', color: urgencyColor, padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                    {resp.urgency || 'TRIAGE GUIDANCE'}
                  </span>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: '0.4rem', color: '#111827' }}>
                    {resp.title}
                  </h3>
                </div>

                <a href="tel:112" className="btn-call-112" style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }}>
                  <PhoneCall size={14} /> 112
                </a>
              </div>

              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
                {resp.summary}
              </p>

              {/* Action Steps */}
              {resp.action_steps && resp.action_steps.length > 0 && (
                <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--primary-red)', marginBottom: '0.5rem' }}>
                    {t('recommended_actions')}
                  </div>
                  <ol style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.92rem' }}>
                    {resp.action_steps.map((step, sIdx) => (
                      <li key={sIdx} style={{ lineHeight: 1.45 }}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Dos & Don'ts */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem', marginTop: '0.75rem' }}>
                {resp.dos && resp.dos.length > 0 && (
                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem' }}>
                    <strong style={{ color: '#166534', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.3rem' }}>
                      <CheckCircle2 size={16} /> DO:
                    </strong>
                    <ul style={{ paddingLeft: '1rem' }}>
                      {resp.dos.map((d, dIdx) => <li key={dIdx}>{d}</li>)}
                    </ul>
                  </div>
                )}

                {resp.donts && resp.donts.length > 0 && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem' }}>
                    <strong style={{ color: '#991b1b', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.3rem' }}>
                      <XCircle size={16} /> DO NOT:
                    </strong>
                    <ul style={{ paddingLeft: '1rem' }}>
                      {resp.donts.map((d, dIdx) => <li key={dIdx}>{d}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div style={{ alignSelf: 'flex-start', background: '#ffffff', border: '1px solid var(--border-light)', padding: '1rem 1.5rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Bot size={20} color="var(--primary-red)" className="animate-pulse-emergency" />
            <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Generating clinical triage guidance...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div style={{ position: 'sticky', bottom: '1rem', background: '#ffffff', border: '2px solid var(--border-medium)', borderRadius: 'var(--radius-lg)', padding: '0.4rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: 'var(--shadow-lg)' }}>
        <input 
          type="text"
          className="form-input"
          style={{ border: 'none', boxShadow: 'none', height: '44px', fontSize: '1rem' }}
          placeholder={t('ask_placeholder')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          id="assistant-query-input"
        />

        <button 
          onClick={() => handleSend()}
          disabled={!query.trim() || loading}
          className="btn-primary"
          style={{ height: '42px', padding: '0 1.25rem', borderRadius: 'var(--radius-md)' }}
          id="assistant-send-btn"
        >
          <Send size={18} />
          <span>{t('ask_button')}</span>
        </button>
      </div>
    </div>
  );
}
