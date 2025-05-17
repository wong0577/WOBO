const db = require('./db');

const findByUsername = async (username) => {
  const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
  return rows[0];
};

const findByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

const insertUser = async ({ username, password, email, nickname }) => {
  const [result] = await db.query(
    `INSERT INTO users (username, password, email, nickname) VALUES (?, ?, ?, ?)`,
    [username, password, email, nickname]
  );
  return result.insertId;
};

module.exports = { findByUsername, findByEmail, insertUser };