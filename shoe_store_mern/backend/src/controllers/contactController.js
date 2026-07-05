const ContactMessage = require('../models/ContactMessage');

// POST /api/contact  (public)
async function submitContact(req, res) {
  try {
    const { name, email, message } = req.body;
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({ success: false, message: 'Please fill in all fields.' });
    }

    await ContactMessage.create({ name: name.trim(), email: email.trim(), message: message.trim() });
    return res.status(201).json({ success: true, message: 'Message sent. We will get back to you soon.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error sending message.' });
  }
}

// GET /api/admin/messages (admin)
async function adminListMessages(req, res) {
  try {
    const messages = await ContactMessage.find({}).sort({ createdAt: -1 });
    return res.json({ success: true, messages });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error fetching messages.' });
  }
}

module.exports = { submitContact, adminListMessages };
