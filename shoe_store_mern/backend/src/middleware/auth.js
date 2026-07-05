const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
const AdminUser = require('../models/AdminUser');

function getTokenFromRequest(req) {
  const authHeader = req.headers.authorization || '';
  if (authHeader.startsWith('Bearer ')) return authHeader.split(' ')[1];
  return null;
}

// Requires a logged-in, OTP-verified customer
async function protectCustomer(req, res, next) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return res.status(401).json({ success: false, message: 'Not logged in.' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const customer = await Customer.findById(decoded.id).select('-password -otp');
    if (!customer) return res.status(401).json({ success: false, message: 'Account not found.' });

    req.customer = customer;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired session.' });
  }
}

// Optional auth: attaches req.customer if a valid token is present, but doesn't block the request
async function optionalCustomer(req, res, next) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return next();
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const customer = await Customer.findById(decoded.id).select('-password -otp');
    if (customer) req.customer = customer;
    next();
  } catch (err) {
    next();
  }
}

async function protectAdmin(req, res, next) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return res.status(401).json({ success: false, message: 'Admin login required.' });

    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
    const admin = await AdminUser.findById(decoded.id).select('-password');
    if (!admin) return res.status(401).json({ success: false, message: 'Admin not found.' });

    req.admin = admin;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired admin session.' });
  }
}

module.exports = { protectCustomer, optionalCustomer, protectAdmin };
