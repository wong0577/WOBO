const express = require('express');
const userRoutes = require('./routes/userRoutes');

const { notFound } = require('./middleware/notFound');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// 中间件
app.use(express.json()); // 解析 JSON 请求体

// 路由
app.use('/api/users', userRoutes);

app.use(notFound);   
app.use(errorHandler);


module.exports = app;



