const express = require('express');
const multer = require('multer');
const router = express.Router();
const controller = require('../controllers/uploadController');
const upload = multer();

router.post('/', upload.single('file'), controller.uploadFile);

module.exports = router;