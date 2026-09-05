/**
 * Patient Data Controller — Appointments, Health Records, Emergency Contacts
 */
const Appointment = require('../models/Appointment');
const HealthRecord = require('../models/HealthRecord');
const EmergencyContact = require('../models/EmergencyContact');

// ── Appointments ─────────────────────────────────────────────────────────────

exports.getAppointments = async (req, res) => {
  try {
    const data = await Appointment.findAll({
      where: { user_id: req.userId },
      order: [['appointment_date', 'ASC']]
    });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch appointments.' });
  }
};

exports.createAppointment = async (req, res) => {
  try {
    const { doctor_name, department, appointment_date, appointment_time, reason } = req.body;
    if (!doctor_name || !appointment_date) {
      return res.status(400).json({ success: false, message: 'Doctor name and date are required.' });
    }
    const appt = await Appointment.create({
      user_id: req.userId, doctor_name, department, appointment_date, appointment_time, reason, status: 'Upcoming'
    });
    res.status(201).json({ success: true, data: appt });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create appointment.' });
  }
};

exports.cancelAppointment = async (req, res) => {
  try {
    const appt = await Appointment.findOne({ where: { id: req.params.id, user_id: req.userId } });
    if (!appt) return res.status(404).json({ success: false, message: 'Appointment not found.' });
    await appt.update({ status: 'Cancelled' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to cancel appointment.' });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const appt = await Appointment.findOne({ where: { id: req.params.id, user_id: req.userId } });
    if (!appt) return res.status(404).json({ success: false, message: 'Appointment not found.' });
    await appt.destroy();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete appointment.' });
  }
};

// ── Health Records ────────────────────────────────────────────────────────────

exports.getHealthRecords = async (req, res) => {
  try {
    const data = await HealthRecord.findAll({
      where: { user_id: req.userId },
      order: [['record_date', 'DESC']]
    });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch health records.' });
  }
};

exports.createHealthRecord = async (req, res) => {
  try {
    const { record_type, title, description, doctor_or_lab, record_date } = req.body;
    if (!title || !record_date) {
      return res.status(400).json({ success: false, message: 'Title and date are required.' });
    }
    const rec = await HealthRecord.create({
      user_id: req.userId, record_type, title, description, doctor_or_lab, record_date
    });
    res.status(201).json({ success: true, data: rec });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create health record.' });
  }
};

exports.deleteHealthRecord = async (req, res) => {
  try {
    const rec = await HealthRecord.findOne({ where: { id: req.params.id, user_id: req.userId } });
    if (!rec) return res.status(404).json({ success: false, message: 'Record not found.' });
    await rec.destroy();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete health record.' });
  }
};

// ── Emergency Contacts ────────────────────────────────────────────────────────

exports.getEmergencyContacts = async (req, res) => {
  try {
    const data = await EmergencyContact.findAll({
      where: { user_id: req.userId },
      order: [['is_primary', 'DESC'], ['createdAt', 'ASC']]
    });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch emergency contacts.' });
  }
};

exports.createEmergencyContact = async (req, res) => {
  try {
    const { name, relationship, phone, is_primary } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Name and phone are required.' });
    }
    const contact = await EmergencyContact.create({
      user_id: req.userId, name, relationship, phone, is_primary: !!is_primary
    });
    res.status(201).json({ success: true, data: contact });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to add emergency contact.' });
  }
};

exports.deleteEmergencyContact = async (req, res) => {
  try {
    const contact = await EmergencyContact.findOne({ where: { id: req.params.id, user_id: req.userId } });
    if (!contact) return res.status(404).json({ success: false, message: 'Contact not found.' });
    await contact.destroy();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete contact.' });
  }
};
