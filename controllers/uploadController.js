const AWS = require('aws-sdk');
const pool = require('../utils/db');
const { verifyToken } = require('../utils/cognito');
const s3 = new AWS.S3();

const BUCKETS = {
  avatar: "wabo-user-uploads",
  cover: "wabo-public-assets",
  recording: "wabo-live-recordings",
  temp: "wabo-temp",
};

exports.uploadFile = async (req, res, next) => {
  try {
    const uploadType = req.query.uploadType || "temp";
    const file = req.file;
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = await verifyToken(token);

    const bucket = BUCKETS[uploadType] || BUCKETS.temp;

    const params = {
      Bucket: bucket,
      Key: `${uploadType}/${Date.now()}_${file.originalname}`,
      Body: file.buffer,
      ACL: 'public-read',
    };

    const result = await s3.upload(params).promise();

    if (uploadType === 'avatar') {
      await pool.query('UPDATE users SET avatar = ? WHERE email = ?', [result.Location, decoded.email]);
    }

    res.json({ success: true, url: result.Location });
  } catch (err) {
    next(err);
  }
};