const express = require('express');
const router = express.Router();
const { login, register, cognitoLogin } = require('../controllers/authController');

router.post('/login', login);
router.post('/register', register);
router.post('/cognito-login', cognitoLogin);

module.exports = router;