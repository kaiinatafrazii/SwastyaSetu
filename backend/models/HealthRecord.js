/**
 * HealthRecord Model — Sequelize
 * Stores medical records (lab reports, prescriptions, etc.) for each user.
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const HealthRecord = sequelize.define('HealthRecord', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  record_type: {
    type: DataTypes.STRING,
    defaultValue: 'Lab Report'
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  doctor_or_lab: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  record_date: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'health_records',
  timestamps: true
});

module.exports = HealthRecord;
