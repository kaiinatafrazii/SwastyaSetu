/**
 * Auth Controller — register, login, getMe, updateProfile
 */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'swasthyasetu_secret_2024';
const JWT_EXPIRES = '7d';

function signToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

function safeUser(user) {
  const { password, ...rest } = user.toJSON ? user.toJSON() : user;
  return rest;
}

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, role, blood_group, emergency_contact, allergies, medical_conditions } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, email, password: hashed,
      phone: phone || '',
      role: role || 'patient',
      blood_group: blood_group || 'O+',
      emergency_contact: emergency_contact || '',
      allergies: allergies || '',
      medical_conditions: medical_conditions || ''
    });
    const token = signToken(user.id);
    // Store token in localStorage via response
    res.status(201).json({ success: true, token, user: safeUser(user) });
  } catch (err) {
    console.error('[Auth] Register error:', err);
    res.status(500).json({ success: false, message: 'Registration failed.' });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }
    const token = signToken(user.id);
    res.json({ success: true, token, user: safeUser(user) });
  } catch (err) {
    console.error('[Auth] Login error:', err);
    res.status(500).json({ success: false, message: 'Login failed.' });
  }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, user: safeUser(user) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch user.' });
  }
};

// PUT /api/auth/profile
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    const { name, phone, blood_group, emergency_contact, allergies, medical_conditions } = req.body;
    await user.update({ name, phone, blood_group, emergency_contact, allergies, medical_conditions });
    res.json({ success: true, user: safeUser(user) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Profile update failed.' });
  }
};
