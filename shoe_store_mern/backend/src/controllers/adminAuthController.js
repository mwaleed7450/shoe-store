const bcrypt = require('bcryptjs');
const AdminUser = require('../models/AdminUser');
const { generateAdminToken } = require('../utils/generateToken');

// POST /api/admin/auth/login
async function adminLogin(req, res) {
  try {
    const { username, password } = req.body;
    const admin = await AdminUser.findOne({ username: (username || '').trim() });

    if (!admin || !(await bcrypt.compare(password || '', admin.password))) {
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }

    const token = generateAdminToken(admin._id);
    return res.json({
      success: true,
      token,
      admin: { id: admin._id, username: admin.username, fullName: admin.fullName },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error during admin login.' });
  }
}

// GET /api/admin/auth/me (protected)
async function adminMe(req, res) {
  return res.json({ success: true, admin: req.admin });
}

// POST /api/admin/auth/change-password (protected)
async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const admin = await AdminUser.findById(req.admin._id);

    if (!(await bcrypt.compare(currentPassword || '', admin.password))) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'New passwords do not match.' });
    }
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
    }

    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();

    return res.json({ success: true, message: 'Password updated successfully.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error changing password.' });
  }
}

module.exports = { adminLogin, adminMe, changePassword };
