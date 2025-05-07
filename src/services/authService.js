
const crypto = require('crypto');

exports.generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.sendOTPToConsole = (email, otp) => {
  console.log(`🔐 OTP for ${email}: ${otp}`);
};
