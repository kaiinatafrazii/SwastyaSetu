/**
 * Appointment Model — Sequelize
 * Stores doctor appointment bookings for each user.
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const Appointment = sequelize.define('Appointment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  doctor_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  department: {
    type: DataTypes.STRING,
    defaultValue: 'General Medicine'
  },
  appointment_date: {
    type: DataTypes.STRING,
    allowNull: false
  },
  appointment_time: {
    type: DataTypes.STRING,
    defaultValue: '10:00 AM'
  },
  reason: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Upcoming'
  }
}, {
  tableName: 'appointments',
  timestamps: true
});

module.exports = Appointment;
