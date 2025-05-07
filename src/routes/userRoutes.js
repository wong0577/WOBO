const { protect } = require('../middleware/authMiddleware');

// 添加一个受保护的路由（需登录）
router.get('/me', protect, (req, res) => {
  res.json({ user: req.user });
});
