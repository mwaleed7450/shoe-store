const express = require('express');
const router = express.Router();
const { adminLogin, adminMe, changePassword } = require('../controllers/adminAuthController');
const { protectAdmin } = require('../middleware/auth');

router.post('/login', adminLogin);
router.get('/me', protectAdmin, adminMe);
router.post('/change-password', protectAdmin, changePassword);

module.exports = router;
