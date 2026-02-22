const mongoose = require('mongoose');
const User = require('../models/User.js');

// 连接数据库
mongoose.connect('mongodb://localhost:27017/smart-travel-hotel')
  .then(async () => {
    console.log('✅ 数据库连接成功');
    
    // 清空原有用户数据
    await User.deleteMany({});
    console.log('🗑️ 原有用户数据已清空');

    // 要插入的用户数据
    const mockUsers = [
      {
        username: 'admin',
        password: '123456', // 会被 User 模型自动加密
        role: 'admin',
        phone: '13800000000'
      },
      {
        username: 'merchant1',
        password: '123456',
        role: 'merchant',
        phone: '13800000001'
      },
      {
        username: 'merchant2',
        password: '123456',
        role: 'merchant',
        phone: '13800000002'
      },
      {
        username: 'user1',
        password: '123456',
        role: 'user',
        phone: '13800000003'
      },
      {
        username: 'user2',
        password: '123456',
        role: 'user',
        phone: '13800000004'
      }
    ];

    // 批量插入用户
    const users = await User.create(mockUsers);
    console.log(`✅ 成功创建 ${users.length} 个用户`);
    console.log('用户列表：', users.map(u => ({
      id: u._id,
      username: u.username,
      role: u.role
    })));

    process.exit(0);
  })
  .catch(err => {
    console.error('❌ 数据库操作失败:', err);
    process.exit(1);
  });
