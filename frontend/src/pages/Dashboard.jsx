import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  PhoneCall, 
  Plus, 
  Trash2, 
  X, 
  CheckCircle, 
  AlertCircle, 
  User, 
  Heart, 
  Activity, 
  Clock, 
  Hospital 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useTheme();

  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showApptModal, setShowApptModal] = useState(false);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  // Form states
  const [apptForm, setApptForm] = useState({
    doctor_name: '',
    department: 'Cardiology',
    appointment_date: '',
    appointment_time: '10:00 AM',
    reason: ''
  });

  const [recordForm, setRecordForm] = useState({
    record_type: 'Lab Report',
    title: '',
    description: '',
    doctor_or_lab: '',
    record_date: new Date().toISOString().split('T')[0]
  });

  const [contactForm, setContactForm] = useState({
    name: '',
    relationship: 'Spouse',
    phone: '',
    is_primary: false
  });

  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [apptRes, recRes, conRes] = await Promise.all([
        api.getAppointments(),
        api.getHealthRecords(),
        api.getEmergencyContacts()
      ]);
      if (apptRes.data) setAppointments(apptRes.data);
      if (recRes.data) setRecords(recRes.data);
      if (conRes.data) setContacts(conRes.data);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createAppointment(apptForm);
      if (res.success) {
        setShowApptModal(false);
        setApptForm({ doctor_name: '', department: 'Cardiology', appointment_date: '', appointment_time: '10:00 AM', reason: '' });
        setStatusMsg('Appointment booked successfully!');
        setTimeout(() => setStatusMsg(''), 3000);
        loadDashboardData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to book appointment.');
    }
  };

  const handleCancelAppointment = async (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await api.cancelAppointment(id);
        loadDashboardData();
      } catch (err) {
        alert('Failed to cancel appointment.');
      }
    }
  };

  const handleDeleteAppointment = async (id) => {
    try {
      await api.deleteAppointment(id);
      loadDashboardData();
    } catch (err) {
      alert('Failed to delete appointment.');
    }
  };

  const handleCreateRecord = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createHealthRecord(recordForm);
      if (res.success) {
        setShowRecordModal(false);
        setRecordForm({ record_type: 'Lab Report', title: '', description: '', doctor_or_lab: '', record_date: new Date().toISOString().split('T')[0] });
        setStatusMsg('Health record added successfully!');
        setTimeout(() => setStatusMsg(''), 3000);
        loadDashboardData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save record.');
    }
  };

  const handleDeleteRecord = async (id) => {
    if (window.confirm('Are you sure you want to delete this health record?')) {
      try {
        await api.deleteHealthRecord(id);
        loadDashboardData();
      } catch (err) {
        alert('Failed to delete record.');
      }
    }
  };

  const handleCreateContact = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createEmergencyContact(contactForm);
      if (res.success) {
        setShowContactModal(false);
        setContactForm({ name: '', relationship: 'Spouse', phone: '', is_primary: false });
        setStatusMsg('Emergency contact saved!');
        setTimeout(() => setStatusMsg(''), 3000);
        loadDashboardData();
      }
    } catch (err) {
      alert('Failed to add contact.');
    }
  };

  const handleDeleteContact = async (id) => {
    try {
      await api.deleteEmergencyContact(id);
      loadDashboardData();
    } catch (err) {
      alert('Failed to delete contact.');
    }
  };

  return (
    <div>
      {/* Dashboard Top Header */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
            <LayoutDashboard size={26} color="var(--primary-red)" />
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{t('dashboard_title')}</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>
            {t('dashboard_welcome')}, <strong style={{ color: '#111827' }}>{user?.name || 'Patient'}</strong> ({user?.email})
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <a href="tel:112" className="btn-call-112" style={{ fontSize: '0.95rem', padding: '0.5rem 1rem' }}>
            <PhoneCall size={16} />
            <span>Emergency 112</span>
          </a>
        </div>
      </div>

      {statusMsg && (
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontWeight: 600 }}>
          {statusMsg}
        </div>
      )}

      {/* Main Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Left Column: Appointments & Health Records */}
        <div>
          {/* Section: Doctor Appointments */}
          <div className="dash-card">
            <div className="dash-card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={22} color="var(--primary-red)" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{t('my_appointments')}</h3>
              </div>
              <button 
                onClick={() => setShowApptModal(true)} 
                className="btn-primary" 
                style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}
                id="book-appointment-btn"
              >
                <Plus size={16} />
                <span>{t('book_appointment')}</span>
              </button>
            </div>

            {loading ? (
              <p style={{ color: 'var(--text-muted)' }}>Loading appointments...</p>
            ) : appointments.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t('no_appointments')}</p>
            ) : (
              <div>
                {appointments.map((appt) => (
                  <div key={appt.id} className="dash-list-item">
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <h4 style={{ fontWeight: 800, fontSize: '1.05rem' }}>{appt.doctor_name}</h4>
                        <span style={{ 
                          fontSize: '0.75rem', 
                          fontWeight: 700, 
                          padding: '0.15rem 0.5rem', 
                          borderRadius: '4px',
                          background: appt.status === 'Upcoming' ? '#e0f2fe' : appt.status === 'Cancelled' ? '#fee2e2' : '#dcfce7',
                          color: appt.status === 'Upcoming' ? '#0369a1' : appt.status === 'Cancelled' ? '#b91c1c' : '#15803d'
                        }}>
                          {appt.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                        <strong>{appt.department}</strong> • {appt.appointment_date} at {appt.appointment_time}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        Reason: {appt.reason}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      {appt.status === 'Upcoming' && (
                        <button 
                          onClick={() => handleCancelAppointment(appt.id)} 
                          className="btn-secondary"
                          style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem', color: '#b91c1c' }}
                        >
                          Cancel
                        </button>
                      )}
                      <button 
                        onClick={() => handleDeleteAppointment(appt.id)}
                        className="btn-secondary"
                        style={{ padding: '0.3rem 0.5rem', color: 'var(--text-muted)' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Medical & Health Records */}
          <div className="dash-card">
            <div className="dash-card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={22} color="var(--primary-red)" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{t('my_records')}</h3>
              </div>
              <button 
                onClick={() => setShowRecordModal(true)} 
                className="btn-primary" 
                style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}
                id="add-record-btn"
              >
                <Plus size={16} />
                <span>{t('add_record')}</span>
              </button>
            </div>

            {loading ? (
              <p style={{ color: 'var(--text-muted)' }}>Loading health records...</p>
            ) : records.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t('no_records')}</p>
            ) : (
              <div>
                {records.map((rec) => (
                  <div key={rec.id} className="dash-list-item">
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, background: '#f1f5f9', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                          {rec.record_type}
                        </span>
                        <h4 style={{ fontWeight: 800, fontSize: '1.05rem' }}>{rec.title}</h4>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                        {rec.doctor_or_lab && <span>By {rec.doctor_or_lab} • </span>} Date: {rec.record_date}
                      </div>
                      {rec.description && (
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                          {rec.description}
                        </p>
                      )}
                    </div>

                    <button 
                      onClick={() => handleDeleteRecord(rec.id)}
                      className="btn-secondary"
                      style={{ padding: '0.3rem 0.5rem', color: '#b91c1c' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Emergency Contacts & Medical Profile */}
        <div>
          {/* Medical Details Summary */}
          <div className="dash-card">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Heart size={20} color="var(--primary-red)" />
              <span>{t('user_medical_profile')}</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>{t('blood_group')}:</span>
                <strong style={{ color: 'var(--primary-red)', fontSize: '1rem' }}>{user?.blood_group || 'O+'}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>{t('known_allergies')}:</span>
                <strong>{user?.allergies || 'None recorded'}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>{t('chronic_conditions')}:</span>
                <strong>{user?.medical_conditions || 'None recorded'}</strong>
              </div>
            </div>
          </div>

          {/* Emergency Contacts Card */}
          <div className="dash-card">
            <div className="dash-card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <PhoneCall size={20} color="var(--primary-red)" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{t('emergency_contacts_title')}</h3>
              </div>
              <button 
                onClick={() => setShowContactModal(true)} 
                className="btn-secondary" 
                style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}
              >
                <Plus size={14} /> Add
              </button>
            </div>

            {contacts.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>No emergency contacts added yet.</p>
            ) : (
              <div>
                {contacts.map((c) => (
                  <div key={c.id} style={{ background: 'var(--bg-main)', border: '1px solid var(--border-light)', borderRadius: '6px', padding: '0.75rem', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>
                        {c.name} {c.is_primary && <span style={{ fontSize: '0.7rem', background: '#ecfdf5', color: '#047857', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>Primary</span>}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{c.relationship} • {c.phone}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.3rem' }}>
                      <a href={`tel:${c.phone}`} style={{ color: 'var(--primary-red)', padding: '0.3rem' }}>
                        <PhoneCall size={16} />
                      </a>
                      <button onClick={() => handleDeleteContact(c.id)} style={{ color: 'var(--text-muted)', padding: '0.3rem' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Book Appointment Modal */}
      {showApptModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{t('modal_book_title')}</h3>
              <button onClick={() => setShowApptModal(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleCreateAppointment}>
              <div className="form-group">
                <label className="form-label">{t('doctor_name')}</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Dr. Rajiv Gupta"
                  required
                  value={apptForm.doctor_name}
                  onChange={(e) => setApptForm({ ...apptForm, doctor_name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('department')}</label>
                <select 
                  className="form-select"
                  value={apptForm.department}
                  onChange={(e) => setApptForm({ ...apptForm, department: e.target.value })}
                >
                  <option value="Cardiology">Cardiology</option>
                  <option value="Pulmonology">Pulmonology</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="General Medicine">General Medicine</option>
                  <option value="Emergency & Trauma">Emergency & Trauma</option>
                  <option value="Pediatrics">Pediatrics</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">{t('appointment_date')}</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    required
                    value={apptForm.appointment_date}
                    onChange={(e) => setApptForm({ ...apptForm, appointment_date: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{t('appointment_time')}</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. 10:30 AM"
                    required
                    value={apptForm.appointment_time}
                    onChange={(e) => setApptForm({ ...apptForm, appointment_time: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">{t('reason_for_visit')}</label>
                <textarea 
                  className="form-textarea"
                  rows="3"
                  placeholder="Describe your health symptoms or routine checkup reason..."
                  required
                  value={apptForm.reason}
                  onChange={(e) => setApptForm({ ...apptForm, reason: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.25rem' }}>
                <button type="button" onClick={() => setShowApptModal(false)} className="btn-secondary">{t('close_btn')}</button>
                <button type="submit" className="btn-primary">{t('submit_btn')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Record Modal */}
      {showRecordModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{t('modal_record_title')}</h3>
              <button onClick={() => setShowRecordModal(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleCreateRecord}>
              <div className="form-group">
                <label className="form-label">{t('record_type')}</label>
                <select 
                  className="form-select"
                  value={recordForm.record_type}
                  onChange={(e) => setRecordForm({ ...recordForm, record_type: e.target.value })}
                >
                  <option value="Lab Report">Lab Report</option>
                  <option value="Prescription">Prescription</option>
                  <option value="Vaccination">Vaccination</option>
                  <option value="Discharge Summary">Discharge Summary</option>
                  <option value="Diagnostic Scan (X-Ray/ECG)">Diagnostic Scan (X-Ray/ECG)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">{t('record_title')}</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Lipid Profile & Blood Sugar"
                  required
                  value={recordForm.title}
                  onChange={(e) => setRecordForm({ ...recordForm, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('doctor_or_lab')}</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Max Path Labs / Dr. Sunita"
                  value={recordForm.doctor_or_lab}
                  onChange={(e) => setRecordForm({ ...recordForm, doctor_or_lab: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('record_date')}</label>
                <input 
                  type="date" 
                  className="form-input" 
                  required
                  value={recordForm.record_date}
                  onChange={(e) => setRecordForm({ ...recordForm, record_date: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('description')}</label>
                <textarea 
                  className="form-textarea" 
                  rows="3"
                  placeholder="Enter medical findings, lab numbers, or instructions..."
                  value={recordForm.description}
                  onChange={(e) => setRecordForm({ ...recordForm, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.25rem' }}>
                <button type="button" onClick={() => setShowRecordModal(false)} className="btn-secondary">{t('close_btn')}</button>
                <button type="submit" className="btn-primary">{t('save_btn')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Contact Modal */}
      {showContactModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{t('modal_contact_title')}</h3>
              <button onClick={() => setShowContactModal(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleCreateContact}>
              <div className="form-group">
                <label className="form-label">{t('full_name_label')}</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Contact person's full name"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('relationship')}</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Spouse, Father, Sister"
                  required
                  value={contactForm.relationship}
                  onChange={(e) => setContactForm({ ...contactForm, relationship: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('phone_label')}</label>
                <input 
                  type="tel" 
                  className="form-input" 
                  placeholder="+91 9876543210"
                  required
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                />
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer', margin: '0.75rem 0' }}>
                <input 
                  type="checkbox" 
                  checked={contactForm.is_primary}
                  onChange={(e) => setContactForm({ ...contactForm, is_primary: e.target.checked })}
                />
                <span>{t('is_primary_checkbox')}</span>
              </label>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.25rem' }}>
                <button type="button" onClick={() => setShowContactModal(false)} className="btn-secondary">{t('close_btn')}</button>
                <button type="submit" className="btn-primary">{t('save_btn')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
