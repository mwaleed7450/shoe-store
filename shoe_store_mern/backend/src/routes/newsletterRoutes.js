const express = require('express');
const router = express.Router();
const Subscriber = require('../models/Subscriber');

// POST /api/newsletter
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email?.trim()) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email.' });
    }
    const normalized = email.toLowerCase().trim();
    const existing = await Subscriber.findOne({ email: normalized });
    if (existing) {
      return res.json({ success: true, message: "You're already subscribed!" });
    }
    await Subscriber.create({ email: normalized });
    return res.status(201).json({ success: true, message: 'Subscribed successfully.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
  }
});

module.exports = router;
