const mongoose = require('mongoose');
const User = require('../models/User.js');
const Hotel = require('../models/Hotel.js');

const DB_URI = 'mongodb://localhost:27017/smart-travel-hotel';

mongoose.connect(DB_URI)
  .then(async () => {
    console.log('✅ 数据库连接成功');

    await User.deleteMany({ role: 'merchant' });
    await Hotel.deleteMany({});
    console.log('🗑️ 已清空原有商户及酒店数据');

    const merchant = await User.create({
      username: 'hotel_owner1',
      password: '123456',          
      role: 'merchant',            
      phone: '13912345678'         
    });
    console.log(`✅ 商户创建成功：${merchant.username}，ID: ${merchant._id}`);

    const hotels = await Hotel.create([

      {
        name: '北京国贸精品酒店',
        address: '北京市朝阳区建国门外大街1号',
        city: '北京',
        star: 5,
        intro: '地处国贸商圈核心，交通便利，视野开阔。',
        facilities: ['免费WiFi', '健身房', '会议室', '送餐服务'],
        images: [
          'https://picsum.photos/800/450?random=10',
          'https://picsum.photos/800/450?random=11'
        ],
        rooms: [
          { type: '商务大床房', price: 899, stock: 20 },
          { type: '豪华套房', price: 1599, stock: 5 }
        ],
        merchantId: merchant._id,
        status: 'approved'
      },

      {
        name: '上海静安假日酒店',
        address: '上海市静安区南京西路1788号',
        city: '上海',
        star: 4,
        intro: '紧邻静安寺，闹中取静，融合老上海风情与现代舒适。',
        facilities: ['免费早餐', '洗衣服务', '停车场', '24小时前台'],
        images: [
          'https://picsum.photos/800/450?random=20',
          'https://picsum.photos/800/450?random=21'
        ],
        rooms: [
          { type: '标准双床房', price: 699, stock: 30 },
          { type: '江景大床房', price: 999, stock: 15 }
        ],
        merchantId: merchant._id,
        status: 'approved'
      }
    ]);

    console.log(`\n✅ 共创建 ${hotels.length} 个酒店，均属于商户【${merchant.username}】：`);
    hotels.forEach(hotel => {
      console.log(`- ${hotel.name} (城市：${hotel.city})`);
    });

    await mongoose.connection.close();
    console.log('\n🔌 数据库连接已关闭，Mock 数据生成完成！');
  })
  .catch(err => {
    console.error('❌ Mock 数据生成失败：', err);
    process.exit(1); // 异常退出
  });
