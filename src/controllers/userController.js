
const userService = require('../services/userService');

exports.register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userService.register(email, password);
    res.status(201).json({ message: 'Registered', userId: user._id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await userService.login(email, password);
    res.json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

exports.sendOTP = async (req, res) => {
  const { email } = req.body;
  try {
    await userService.sendOTP(email);
    res.json({ message: 'OTP sent (console simulated)' });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    await userService.resetPassword(email, otp, newPassword);
    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getProfile = async (req, res) => {
  const user = await userService.getProfile(req.user._id);
  res.json(user);
};
