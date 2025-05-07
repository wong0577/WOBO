
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (email, password) => {
  return await User.create({ email, password });
};

exports.login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    throw new Error('Invalid credentials');
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return { token };
};

exports.sendOTP = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found');
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpExpires = new Date(Date.now() + 10 * 60000);
  await user.save();
  console.log(`🔐 OTP for ${email}: ${otp}`);
  return true;
};

exports.resetPassword = async (email, otp, newPassword) => {
  const user = await User.findOne({ email, otp });
  if (!user) throw new Error('Invalid OTP or user');
  if (user.otpExpires < new Date()) throw new Error('OTP expired');
  user.password = newPassword;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();
  return true;
};

exports.getProfile = async (userId) => {
  return await User.findById(userId).select('-password');
};
