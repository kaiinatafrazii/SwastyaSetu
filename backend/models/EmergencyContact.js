/**
 * EmergencyContact Model — Sequelize
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const EmergencyContact = sequelize.define('EmergencyContact', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  relationship: { type: DataTypes.STRING, defaultValue: 'Spouse' },
  phone: { type: DataTypes.STRING, allowNull: false },
  is_primary: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { tableName: 'emergency_contacts', timestamps: true });

module.exports = EmergencyContact;
