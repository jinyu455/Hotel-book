import { useState, useEffect } from "react";
import Taro, { useDidShow } from "@tarojs/taro";
import { View, Text, Button } from '@tarojs/components'
import './list.scss'

interface Room {
  type: string,
  price: number,
  stock: number
}

interface Hotel {
  _id: string,
  name: string,
  address: string,
  city: string,
  star: number, 
  intro?: string,
  facilities: string[],
  images: string[],
  rooms: Room[],
  merchantId: string,
  status: 'pending' | 'approved' | 'rejected' | 'offline', 
  rejectReason?: string,
  createdAt?: Date,
  updatedAt?: Date, 
}


const HotelList = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);

  useEffect(() => {
    fetchMyHotels();
  }, []);

  useDidShow(() => {
    fetchMyHotels();
  });

  const fetchMyHotels = async () => {
    try {
      const token = Taro.getStorageSync('token');
      const res = await Taro.request({
        url: 'http://localhost:5000/api/hotels/merchant',
        header: { 'x-auth-token':token }
      });
      setHotels(res.data);
    } catch (e) {
      Taro.showToast({ title: '获取酒店列表失败', icon: 'none' });
    }
  };

  const handleEdit = (hotelId) => {
    Taro.navigateTo({
      url: `/pages/admin/hotel/edit/index?id=${hotelId}`
    });
  };

  const handleCreate = () => {
    Taro.navigateTo({
      url: '/pages/admin/hotel/edit/index'
    });
  };

  return (
    <View className="hotel-list-page">
      <Button className="create-btn" onClick={handleCreate}>新建酒店</Button>

      {!Array.isArray(hotels)||hotels.length === 0 ? (
        <View className="empty-tip">
          <Text>暂无酒店，点击上方按钮创建</Text>
        </View>
      ) : (
        <View className="hotel-list">
          {hotels.map(hotel => (
            <View 
              key={hotel._id} 
              className="hotel-item"
              onClick={() => handleEdit(hotel._id)}
            >
              <View className="hotel-info">
                <Text className="hotel-name">{hotel.name}</Text>
                {hotel.status==='rejected'&&hotel.rejectReason&&(
                  <Text className="reject-reason">拒绝原因：{hotel.rejectReason}</Text>
                )}
              </View>
              <Text className={`hotel-status ${hotel.status}`}>
                {hotel.status === 'pending' ? '待审核' : 
                 hotel.status === 'approved' ? '已通过' : 
                 hotel.status === 'rejected'? '已拒绝':'已下线'}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default HotelList;

