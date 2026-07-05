const bcrypt = require('bcryptjs');
const Customer = require('../models/Customer');
const { sendOTPEmail } = require('../utils/sendEmail');
const { generateCustomerToken } = require('../utils/generateToken');

function generateOTP() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// POST /api/auth/register
async function register(req, res) {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please fill all required fields.' });
    }

    const existing = await Customer.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    const hash = await bcrypt.hash(password, 10);
    const customer = await Customer.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone?.trim() || null,
      password: hash,
    });

    const otp = generateOTP();
    customer.otp = otp;
    customer.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await customer.save();

    const mailSent = await sendOTPEmail(customer.email, otp);
    if (!mailSent) {
      return res.status(502).json({ success: false, message: 'Account created but failed to send OTP email. Please try resending.' });
    }

    return res.status(201).json({
      success: true,
      message: 'Registered. Please check your email for the OTP.',
      pendingCustomerId: customer._id,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
}

// POST /api/auth/login
async function login(req, res) {
  try {
    const { email, password } = req.body;
    const customer = await Customer.findOne({ email: (email || '').toLowerCase().trim() });

    if (!customer || !(await bcrypt.compare(password || '', customer.password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const otp = generateOTP();
    customer.otp = otp;
    customer.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await customer.save();

    await sendOTPEmail(customer.email, otp);

    return res.json({
      success: true,
      message: 'OTP sent to your email.',
      pendingCustomerId: customer._id,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error during login.' });
  }
}

// POST /api/auth/verify-otp   { pendingCustomerId, otp }
async function verifyOtp(req, res) {
  try {
    const { pendingCustomerId, otp } = req.body;
    if (!pendingCustomerId || !otp) {
      return res.status(400).json({ success: false, message: 'Missing OTP or customer reference.' });
    }

    const customer = await Customer.findOne({
      _id: pendingCustomerId,
      otp: String(otp).trim(),
      otpExpires: { $gt: new Date() },
    });

    if (!customer) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP.' });
    }

    customer.isVerified = true;
    customer.otp = null;
    customer.otpExpires = null;
    await customer.save();

    const token = generateCustomerToken(customer._id);

    return res.json({
      success: true,
      token,
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error verifying OTP.' });
  }
}

// POST /api/auth/resend-otp   { pendingCustomerId }
async function resendOtp(req, res) {
  try {
    const { pendingCustomerId } = req.body;
    const customer = await Customer.findById(pendingCustomerId);
    if (!customer) return res.status(404).json({ success: false, message: 'Account not found.' });

    const otp = generateOTP();
    customer.otp = otp;
    customer.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await customer.save();

    const mailSent = await sendOTPEmail(customer.email, otp);
    if (!mailSent) return res.status(502).json({ success: false, message: 'Failed to resend OTP email.' });

    return res.json({ success: true, message: 'OTP resent.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error resending OTP.' });
  }
}

// GET /api/auth/me  (protected)
async function me(req, res) {
  return res.json({ success: true, customer: req.customer });
}

// PATCH /api/auth/me (protected) - update profile/address, used to prefill checkout
async function updateMe(req, res) {
  try {
    const { name, phone, address } = req.body;
    const customer = await Customer.findById(req.customer._id);
    if (name !== undefined) customer.name = name;
    if (phone !== undefined) customer.phone = phone;
    if (address !== undefined) customer.address = address;
    await customer.save();
    return res.json({ success: true, customer });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error updating profile.' });
  }
}

module.exports = { register, login, verifyOtp, resendOtp, me, updateMe };
