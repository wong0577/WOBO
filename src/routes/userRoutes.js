
const express = require('express');
const router = express.Router();
const {
  register,
  login,
  sendOTP,
  resetPassword,
  getProfile
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/forget-password', sendOTP);
router.post('/reset-password', resetPassword);
router.get('/me', protect, getProfile);

module.exports = router;
