const express = require('express');
const router = express.Router();
const { register, login, verifyOtp, resendOtp, me, updateMe } = require('../controllers/authController');
const { protectCustomer } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.get('/me', protectCustomer, me);
router.patch('/me', protectCustomer, updateMe);

module.exports = router;
