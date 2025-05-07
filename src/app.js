const express = require('express');
const userRoutes = require('./routes/userRoutes');

const app = express();

// 中间件
app.use(express.json()); // 解析 JSON 请求体

// 路由
app.use('/api/users', userRoutes);

module.exports = app;
