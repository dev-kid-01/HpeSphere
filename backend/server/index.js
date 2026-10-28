const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Load environment variables from both local and root directories
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config();

const Contact = require('../models/Contact');
const authRoutes = require('../routes/authRoutes');
const campaignRoutes = require('../routes/campaignRoutes');
const volunteerRoutes = require('../routes/volunteerRoutes');
const ngoRoutes = require('../routes/ngoRoutes');
const donationRoutes = require('../routes/donationRoutes');

const app = express();

// ✅ Security & Utility Middlewares
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json({ limit: '5mb' }));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// ✅ MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('❌ Warning: MONGO_URI is not defined in environment variables.');
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas [HopeSphere Backend]'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/ngos', ngoRoutes);
app.use('/api/donations', donationRoutes);

// ✅ Contact submission route (Preserved & Enhanced)
app.post('/api/contacts', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Name is required' });
    }
    if (!email || !/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/.test(email.trim())) {
      return res.status(400).json({ error: 'Valid email address is required' });
    }
    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const contact = new Contact({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
    });
    await contact.save();

    return res.status(201).json({ message: 'Thank you for reaching out! Your message has been received by HopeSphere.' });
  } catch (error) {
    console.error('❌ Error saving contact:', error);
    return res.status(500).json({ error: 'Server error, please try again later' });
  }
});

// ✅ Health & System Info
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    platform: 'HopeSphere Community Platform',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// ✅ Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: 'An unexpected server error occurred.' });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 HopeSphere Backend Server running on port ${PORT}`);
});

module.exports = { app, server };
