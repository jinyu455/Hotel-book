const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  console.log('=== 进入 auth 中间件 ===');
  const token = req.header('x-auth-token');
  console.log('收到的 token:', token);

  if (!token) {
    console.log('❌ 没有 token，返回 401');
    return res.status(401).json({ msg: '请先登录' });
  }

  try {
    const decoded = jwt.verify(token, 'your-secret-key');
    console.log('✅ JWT 验证成功，decoded:', decoded);
    req.user = decoded;
    next(); // 放行
  } catch (e) {
    console.log('❌ JWT 验证失败:', e.message);
    res.status(401).json({ msg: '无效token' });
  }
};
