/**
 * User Model — Sequelize
 * Stores patient/admin accounts with medical profile data.
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'patient'
  },
  blood_group: {
    type: DataTypes.STRING,
    defaultValue: 'O+'
  },
  emergency_contact: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  allergies: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  medical_conditions: {
    type: DataTypes.STRING,
    defaultValue: ''
  }
}, {
  tableName: 'users',
  timestamps: true
});

module.exports = User;
