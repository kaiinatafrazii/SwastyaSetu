const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const pc = require('../controllers/patientController');

// All patient routes require authentication
router.use(authMiddleware);

// Appointments
router.get('/appointments', pc.getAppointments);
router.post('/appointments', pc.createAppointment);
router.put('/appointments/:id/cancel', pc.cancelAppointment);
router.delete('/appointments/:id', pc.deleteAppointment);

// Health Records
router.get('/records', pc.getHealthRecords);
router.post('/records', pc.createHealthRecord);
router.delete('/records/:id', pc.deleteHealthRecord);

// Emergency Contacts
router.get('/contacts', pc.getEmergencyContacts);
router.post('/contacts', pc.createEmergencyContact);
router.delete('/contacts/:id', pc.deleteEmergencyContact);

module.exports = router;
