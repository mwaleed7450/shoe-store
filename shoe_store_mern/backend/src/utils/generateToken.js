const jwt = require('jsonwebtoken');

function generateCustomerToken(customerId) {
  return jwt.sign({ id: customerId, role: 'customer' }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

function generateAdminToken(adminId) {
  return jwt.sign({ id: adminId, role: 'admin' }, process.env.ADMIN_JWT_SECRET, {
    expiresIn: process.env.ADMIN_JWT_EXPIRES_IN || '1d',
  });
}

module.exports = { generateCustomerToken, generateAdminToken };
