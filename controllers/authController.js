const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { findByUsername, insertUser, findByEmail } = require('../models/userModel');
const { CognitoJwtVerifier } = require("aws-jwt-verify");

const COGNITO_POOL_ID = process.env.COGNITO_POOL_ID;
const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID;

const verifier = CognitoJwtVerifier.create({
  userPoolId: COGNITO_POOL_ID,
  tokenUse: "id",
  clientId: COGNITO_CLIENT_ID,
});

exports.register = async (req, res) => {
  const { username, password, email, nickname } = req.body;
  const existing = await findByUsername(username);
  if (existing) return res.status(409).json({ message: 'Username already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user_id = await insertUser({ username, password: hashedPassword, email, nickname });
  res.json({ message: 'User registered successfully', user_id });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await findByUsername(username);
  if (!user) return res.status(401).json({ message: 'Invalid username or password' });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(401).json({ message: 'Invalid username or password' });

  const token = jwt.sign(
    { user_id: user.user_id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({ token, user });
};

exports.cognitoLogin = async (req, res) => {
  const { idToken } = req.body;
  try {
    const payload = await verifier.verify(idToken);
    const { email, name, sub } = payload;

    let user = await findByEmail(email);
    if (!user) {
      const user_id = await insertUser({ username: sub, email, nickname: name, password: null });
      user = await findByUsername(sub);
    }

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Invalid Cognito token' });
  }
};