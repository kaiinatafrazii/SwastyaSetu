import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  RotateCcw, 
  Play, 
  Pause, 
  Timer as TimerIcon, 
  Volume2, 
  VolumeX, 
  AlertTriangle, 
  CheckCircle2, 
  PhoneCall, 
  ShieldAlert,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function StepWizard({ emergency, steps = [] }) {
  const { lang, t } = useTheme();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Timer state
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const timerIntervalRef = useRef(null);

  // Audio CPR Metronome state (110 BPM rhythm)
  const [metronomeActive, setMetronomeActive] = useState(false);
  const audioContextRef = useRef(null);
  const metronomeIntervalRef = useRef(null);

  const totalSteps = steps.length;
  const currentStep = steps[currentStepIndex] || null;

  // Initialize step timer whenever currentStep changes
  useEffect(() => {
    if (currentStep && currentStep.timer_seconds > 0) {
      setTimerSeconds(currentStep.timer_seconds);
      setTimerActive(false);
    } else {
      setTimerSeconds(0);
      setTimerActive(false);
    }
  }, [currentStepIndex, currentStep]);

  // Handle countdown timer
  useEffect(() => {
    if (timerActive && timerSeconds > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current);
            setTimerActive(false);
            // Beep sound on timer end
            playBeep(880, 0.4);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerIntervalRef.current);
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [timerActive, timerSeconds]);

  // Audio Beep helper using Web Audio API
  const playBeep = (freq = 600, duration = 0.1) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio not permitted or blocked
    }
  };

  // Handle CPR Metronome (110 BPM = 545ms per beat)
  useEffect(() => {
    if (metronomeActive) {
      const intervalMs = Math.round(60000 / 110);
      metronomeIntervalRef.current = setInterval(() => {
        playBeep(750, 0.08);
      }, intervalMs);
    } else {
      clearInterval(metronomeIntervalRef.current);
    }
    return () => clearInterval(metronomeIntervalRef.current);
  }, [metronomeActive]);

  const handleNext = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(prev => prev + 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handleRestart = () => {
    setCurrentStepIndex(0);
    setTimerActive(false);
    setMetronomeActive(false);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentStep) {
    return (
      <div className="step-card" style={{ textAlign: 'center', padding: '3rem' }}>
        <p>No step information available for this emergency.</p>
      </div>
    );
  }

  const progressPercent = Math.round(((currentStepIndex + 1) / totalSteps) * 100);
  const isLastStep = currentStepIndex === totalSteps - 1;

  const stepTitle = lang === 'hi' && currentStep.title_hi ? currentStep.title_hi : currentStep.title;
  const stepInstruction = lang === 'hi' && currentStep.instruction_hi ? currentStep.instruction_hi : currentStep.instruction;
  const stepWarning = lang === 'hi' && currentStep.warning_hi ? currentStep.warning_hi : currentStep.warning;

  return (
    <div className="guide-container">
      {/* Progress Card */}
      <div className="guide-header-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary-red)' }}>
              {lang === 'hi' && emergency?.title_hi ? emergency.title_hi : emergency?.title}
            </span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '0.2rem' }}>
              {t('step_label')} {currentStep.step_number || currentStepIndex + 1} {t('of_label')} {totalSteps}
            </h2>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-red)' }}>
              {progressPercent}%
            </span>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('completed')}</div>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="progress-track" role="progressbar" aria-valuenow={progressPercent} aria-valuemin="0" aria-valuemax="100">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      {/* Main Step Guidance Card */}
      <div className="step-card">
        <div className="step-badge-large">
          <ShieldAlert size={18} />
          <span>{t('step_label')} {currentStep.step_number || currentStepIndex + 1}</span>
        </div>

        <h3 className="step-main-title">{stepTitle}</h3>
        <p className="step-instruction">{stepInstruction}</p>

        {/* Warning / Caution Box */}
        {stepWarning && (
          <div className="step-warning-box">
            <AlertTriangle size={22} style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.04em' }}>
                {t('warning_box_title')}
              </div>
              <div>{stepWarning}</div>
            </div>
          </div>
        )}

        {/* Interactive Step Timer if applicable */}
        {currentStep.timer_seconds > 0 && (
          <div className="timer-widget">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <TimerIcon size={28} color="var(--primary-red)" />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                  RECOMMENDED DURATION TIMER
                </div>
                <div className="timer-digits">{formatTimer(timerSeconds)}</div>
              </div>
            </div>

            <div className="timer-controls">
              <button 
                onClick={() => setTimerActive(prev => !prev)} 
                className={`btn-timer ${timerActive ? '' : 'primary'}`}
              >
                {timerActive ? <Pause size={16} /> : <Play size={16} />}
                <span>{timerActive ? t('pause_timer') : t('start_timer')}</span>
              </button>
              <button 
                onClick={() => { setTimerActive(false); setTimerSeconds(currentStep.timer_seconds); }} 
                className="btn-timer"
              >
                <RotateCcw size={16} />
                <span>{t('reset_timer')}</span>
              </button>
            </div>
          </div>
        )}

        {/* CPR Metronome option for cardiac / chest pain / unconsciousness emergencies */}
        {(emergency?.slug === 'chest-pain' || emergency?.slug === 'unconsciousness' || emergency?.id === 1 || emergency?.id === 6) && (
          <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0.9rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Volume2 size={20} color="var(--primary-red)" />
              <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                {t('cpr_metronome')}
              </span>
            </div>
            <button 
              onClick={() => setMetronomeActive(prev => !prev)} 
              className={`btn-timer ${metronomeActive ? 'primary' : ''}`}
              style={{ fontSize: '0.85rem' }}
            >
              {metronomeActive ? <VolumeX size={15} /> : <Volume2 size={15} />}
              <span>{metronomeActive ? t('stop_metronome') : 'Start 110 BPM Audio'}</span>
            </button>
          </div>
        )}

        {/* Step Navigation Controls */}
        <div className="step-nav-footer">
          <button 
            onClick={handlePrev} 
            disabled={currentStepIndex === 0} 
            className="btn-nav-step"
            style={{ opacity: currentStepIndex === 0 ? 0.4 : 1, cursor: currentStepIndex === 0 ? 'not-allowed' : 'pointer' }}
          >
            <ArrowLeft size={18} />
            <span>{t('prev_step')}</span>
          </button>

          <button onClick={handleRestart} className="btn-timer" title={t('restart_guide')}>
            <RotateCcw size={16} />
            <span>{t('restart_guide')}</span>
          </button>

          {isLastStep ? (
            <a 
              href="tel:112" 
              className="btn-nav-step next"
              style={{ background: 'linear-gradient(135deg, #b71c1c, #d32f2f)' }}
            >
              <PhoneCall size={18} />
              <span>{t('call_112')}</span>
            </a>
          ) : (
            <button 
              onClick={handleNext} 
              className="btn-nav-step next"
              id="next-step-btn"
            >
              <span>{t('next_step')}</span>
              <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Persistent Dos & Don'ts Panel */}
      {emergency && (
        <div className="dos-donts-panel">
          {emergency.dos && emergency.dos.length > 0 && (
            <div className="dos-box">
              <h4 className="panel-heading">
                <ThumbsUp size={20} />
                <span>{t('dos_label')}</span>
              </h4>
              <ul className="symptoms-list" style={{ color: '#14532d' }}>
                {emergency.dos.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {emergency.donts && emergency.donts.length > 0 && (
            <div className="donts-box">
              <h4 className="panel-heading">
                <ThumbsDown size={20} />
                <span>{t('donts_label')}</span>
              </h4>
              <ul className="symptoms-list" style={{ color: '#7f1d1d' }}>
                {emergency.donts.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
