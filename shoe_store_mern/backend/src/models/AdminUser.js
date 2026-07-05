const mongoose = require('mongoose');

const adminUserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true }, // bcrypt hash
    fullName: { type: String, default: null },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: false } }
);

module.exports = mongoose.model('AdminUser', adminUserSchema);
