const mongoose = require('mongoose');
const Hotel = require('../models/Hotel.js'); // 确保路径正确
console.log('1. 脚本开始执行...');
console.log('2. 正在连接数据库: mongodb://127.0.0.1:27017/smart-travel-hotel');
// 1. 连接数据库（替换成你的数据库地址）
mongoose.connect('mongodb://localhost:27017/smart-travel-hotel') 
  .then(async () => {
    console.log('3. ✅ 数据库连接成功');

    console.log('4. 开始清空原有数据...');
    await Hotel.deleteMany({});
    console.log('5. 🗑️  原有酒店数据已清空');
    const mockHotels = [
      {
        name: '北京豪华酒店',
        address: '北京市朝阳区建国路88号',
        city: '北京',
        star: 5,
        intro: '位于CBD核心区，尽享都市繁华',
        facilities: ['免费WiFi', '游泳池', '健身房', '24小时前台'],
        images: [
          'https://picsum.photos/800/450?random=1',
          'https://picsum.photos/800/450?random=11'
        ],
        rooms: [
          { type: '豪华大床房', price: 688, stock: 10 },
          { type: '行政套房', price: 1288, stock: 3 }
        ],
        merchantId: new mongoose.Types.ObjectId(), // 模拟一个商户ID
        status: 'approved'
      },
      {
        name: '上海外滩酒店',
        address: '上海市黄浦区中山东一路18号',
        city: '上海',
        star: 4,
        intro: '坐拥黄浦江美景，毗邻外滩万国建筑',
        facilities: ['江景房', '免费早餐', '商务中心', '行李寄存'],
        images: [
          'https://picsum.photos/800/450?random=2',
          'https://picsum.photos/800/450?random=22'
        ],
        rooms: [
          { type: '江景双床房', price: 728, stock: 8 },
          { type: '全景套房', price: 1588, stock: 2 }
        ],
        merchantId: new mongoose.Types.ObjectId(),
        status: 'approved'
      },
      {
        name: '广州天河精品酒店',
        address: '广州市天河区天河路385号',
        city: '广州',
        star: 5,
        intro: '地处天河商圈，交通便利，设施一流',
        facilities: ['免费停车', 'SPA', '中餐厅', '会议室'],
        images: [
          'https://picsum.photos/800/450?random=3',
          'https://picsum.photos/800/450?random=33'
        ],
        rooms: [
          { type: '商务大床房', price: 568, stock: 15 },
          { type: '豪华套房', price: 1088, stock: 5 }
        ],
        merchantId: new mongoose.Types.ObjectId(),
        status: 'approved'
      }
    ];

    // 4. 执行插入
    const docs = await Hotel.insertMany(mockHotels);
    console.log(`✅ 成功插入 ${docs.length} 条酒店 mock 数据！`);
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ 数据库操作失败:', err);
    process.exit(1);
  });
