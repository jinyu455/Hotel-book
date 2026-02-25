const mongoose = require('mongoose');
const User = require('../models/User.js');
const Hotel = require('../models/Hotel.js');

const DB_URI = 'mongodb://localhost:27017/smart-travel-hotel';

// 可选的设施列表
const ALLOWED_FACILITIES = ['健身房', '免费WiFi', '免费停车', '含早餐'];

// 从可选设施中随机选 2-3 个
function getRandomFacilities() {
  const shuffled = [...ALLOWED_FACILITIES].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.floor(Math.random() * 2) + 2); // 随机 2 或 3 个
}

mongoose.connect(DB_URI)
  .then(async () => {
    console.log('✅ 数据库连接成功');
    // 在创建新酒店前，先删除这五个特定的酒店
await Hotel.deleteMany({
  name: {
    $in: [
      '广州天河商务酒店',
      '深圳南山海景酒店',
      '杭州西湖度假酒店',
      '成都锦里古街酒店',
      '西安城墙观景酒店'
    ]
  }
});
console.log('🗑️ 已清空指定的5个测试酒店数据');


    // 找到一个现有的 merchant（如果没有，你也可以在这里创建一个）
    let merchant = await User.findOne({ role: 'merchant' });
    if (!merchant) {
      console.log('⚠️ 未找到现有商户，将创建一个新商户...');
      merchant = await User.create({
        username: 'hotel_owner_temp',
        password: '123456',
        role: 'merchant',
        phone: '13800001111'
      });
      console.log(`✅ 新商户创建成功：${merchant.username}，ID: ${merchant._id}`);
    }

    const pendingHotels = [
      {
        name: '广州天河商务酒店',
        address: '广州市天河区体育东路123号',
        city: '广州',
        star: 4,
        intro: '位于天河CBD核心，商务出行首选。',
        facilities: getRandomFacilities(),
        images: [
          'https://picsum.photos/800/450?random=100',
          'https://picsum.photos/800/450?random=101'
        ],
        rooms: [
          { type: '标准大床房', price: 599, stock: 25 },
          { type: '商务双床房', price: 699, stock: 18 }
        ],
        merchantId: merchant._id,
        status: 'pending' // 待审核
      },
      {
        name: '深圳南山海景酒店',
        address: '深圳市南山区滨海大道2000号',
        city: '深圳',
        star: 5,
        intro: '一线海景，尽享都市繁华与碧海蓝天。',
        facilities: getRandomFacilities(),
        images: [
          'https://picsum.photos/800/450?random=102',
          'https://picsum.photos/800/450?random=103'
        ],
        rooms: [
          { type: '海景大床房', price: 1299, stock: 12 },
          { type: '行政套房', price: 2199, stock: 6 }
        ],
        merchantId: merchant._id,
        status: 'pending'
      },
      {
        name: '杭州西湖度假酒店',
        address: '杭州市西湖区龙井路88号',
        city: '杭州',
        star: 4,
        intro: '依山傍水，尽享西湖美景与江南韵味。',
        facilities: getRandomFacilities(),
        images: [
          'https://picsum.photos/800/450?random=104',
          'https://picsum.photos/800/450?random=105'
        ],
        rooms: [
          { type: '园景双床房', price: 799, stock: 22 },
          { type: '湖景套房', price: 1599, stock: 8 }
        ],
        merchantId: merchant._id,
        status: 'pending'
      },
      {
        name: '成都锦里古街酒店',
        address: '成都市武侯区武侯祠大街234号',
        city: '成都',
        star: 3,
        intro: '紧邻锦里古街，感受巴蜀文化与市井生活。',
        facilities: getRandomFacilities(),
        images: [
          'https://picsum.photos/800/450?random=106',
          'https://picsum.photos/800/450?random=107'
        ],
        rooms: [
          { type: '舒适大床房', price: 399, stock: 35 },
          { type: '家庭房', price: 559, stock: 15 }
        ],
        merchantId: merchant._id,
        status: 'pending'
      },
      {
        name: '西安城墙观景酒店',
        address: '西安市碑林区南大街100号',
        city: '西安',
        star: 4,
        intro: '明城墙下，梦回大唐，感受十三朝古都魅力。',
        facilities: getRandomFacilities(),
        images: [
          'https://picsum.photos/800/450?random=108',
          'https://picsum.photos/800/450?random=109'
        ],
        rooms: [
          { type: '城景大床房', price: 699, stock: 20 },
          { type: '亲子房', price: 899, stock: 12 }
        ],
        merchantId: merchant._id,
        status: 'pending'
      }
    ];

    const createdHotels = await Hotel.create(pendingHotels);

    console.log(`\n✅ 共创建 ${createdHotels.length} 个待审核酒店，均属于商户【${merchant.username}】：`);
    createdHotels.forEach(hotel => {
      console.log(`- ${hotel.name} (城市：${hotel.city}，状态：${hotel.status})`);
    });

    await mongoose.connection.close();
    console.log('\n🔌 数据库连接已关闭，待审核酒店数据生成完成！');
  })
  .catch(err => {
    console.error('❌ 待审核酒店数据生成失败：', err);
    process.exit(1);
  });
