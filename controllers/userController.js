const pool = require('../utils/db');
const { verifyToken } = require('../utils/cognito');

exports.getProfile = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = await verifyToken(token);
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [decoded.email]);
    res.json({ success: true, user: rows[0] });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = await verifyToken(token);
    await pool.query('UPDATE users SET name = ? WHERE email = ?', [name, decoded.email]);
    res.json({ success: true, message: "Profile updated" });
  } catch (err) {
    next(err);
  }
};