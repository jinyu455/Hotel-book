import { useState, useEffect } from 'react';
 import { View, Text, Button, Image, ScrollView, Textarea} from '@tarojs/components';
 import Taro, { useRouter } from '@tarojs/taro';
 import './detail.scss';

 interface Hotel{
    _id:string,
    name:string,
    city:string,
    star:number,
    address:string,
    intro?:string,
    images?:string[],
    facilities?:string[],
    rooms:[{
        type:string,
        price:number,
        stock:number
    }],
    status:'pending'|'approved'|'rejected'|'offline',
    rejectReason:string
}

 const statusMap = {
   pending: '待审核',
   approved: '已通过',
   rejected: '已拒绝',
   offline: '已下线'
 };

 const AuditDetail=() =>{
   const { params } = useRouter();
   const hotelId = params.id;
   const [hotel, setHotel] = useState<Hotel>();
   const [loading, setLoading] = useState(true);
   const [rejectReason, setRejectReason] = useState('');

   useEffect(() => {
     const token = Taro.getStorageSync('token');
     if (!token) {
       Taro.reLaunch({ url: '/pages/login/index' });
       return;
     }
     if (!hotelId) {
       Taro.navigateBack();
       return;
     }
     fetchDetail();
   }, [hotelId]);

   const fetchDetail = async () => {
     try {
       setLoading(true);
       const token = Taro.getStorageSync('token');
       const res = await Taro.request({
         url: `http://localhost:5000/api/hotels/admin/audit/${hotelId}`,
         method: 'GET',
         header: { 'x-auth-token': token }
       });
       setHotel(res.data || undefined);
       setRejectReason(res.data?.rejectReason || '');
     } catch (err) {
       Taro.showToast({ title: '详情加载失败', icon: 'none' });
       setHotel(undefined);
     } finally {
       setLoading(false);
     }
   };
  
   const handleAudit = async (newStatus) => {
     if (newStatus === 'rejected' && !rejectReason.trim()) {
       Taro.showToast({ title: '请输入拒绝原因', icon: 'none' });
       return;
     }
     try {
       const token = Taro.getStorageSync('token');
       await Taro.request({
         url: `http://localhost:5000/api/hotels/${hotelId}/audit`,
         method: 'PUT',
         data: {
           status: newStatus,
           rejectReason: newStatus === 'rejected' ? rejectReason : ''
         },
         header: { 'x-auth-token': token }
       });
       Taro.showToast({ title: '操作成功', icon: 'success' });
       Taro.navigateBack();
     } catch (err) {
       Taro.showToast({ title: '操作失败', icon: 'none' });
     }
   }; 

   if (loading) return <View className="loading-wrapper"><Text>加载中...</Text></View>;

   if (!hotel) return <View className="empty-wrapper"><Text>酒店数据不存在</Text></View>;

   return (
     <ScrollView className="audit-detail-page">
       <View className="detail-header">
         <Text className="hotel-title">{hotel.name}</Text>
         <Text className={`status-tag status-${hotel.status}`}>
           状态：{statusMap[hotel.status]}
         </Text>
       </View>

       <View className="info-section">
         <View className="info-row">
           <Text className="section-label">地址：</Text>
           <Text className="section-value">{hotel.address}</Text>
         </View>
         <View className="info-row">
           <Text className="section-label">城市：</Text>
           <Text className="section-value">{hotel.city}</Text>
         </View>
         <View className="info-row">
           <Text className="section-label">星级：</Text>
           <Text className="section-value">{hotel.star || '无'}星</Text>
         </View>
         <View className="info-row">
           <Text className="section-label">简介：</Text>
           <Text className="section-value">{hotel.intro || '无'}</Text>
         </View>
       </View>

       {hotel.images && hotel.images.length > 0 && (
         <View className="images-section">
           <Text className="section-title">酒店图片</Text>
           <View className="images-wrapper">
             {hotel.images.map((img, idx) => (
               <Image
                 key={idx}
                 src={img}
                 mode="aspectFill"
                 className="hotel-image"
               />
             ))}
           </View>
         </View>
       )} 

       {hotel.rooms && hotel.rooms.length > 0 && (
         <View className="rooms-section">
           <Text className="section-title">房型信息</Text>
           {hotel.rooms.map((room, idx) => (
             <View key={idx} className="room-item">
               <View className="room-header">
                 <Text className="room-type">{room.type}</Text>
                 <Text className="room-price">￥{room.price}/晚</Text>
               </View>
               <Text className="room-stock">库存：{room.stock || 0}间</Text>
             </View>
           ))}
         </View>
       )} 

       {hotel.status === 'rejected' && (
         <View className="reject-section">
           <Text className="section-title">拒绝原因</Text>
           <Text className="reject-text">{hotel.rejectReason || '无'}</Text>
         </View>
       )}

       <View className="action-section">
         {hotel.status === 'pending' && (
           <View className="action-group">
             <Button
               type="primary"
               size="default"
               onClick={() => handleAudit('approved')}
             >
               审核通过
             </Button>
             <Textarea
               placeholder="请输入拒绝原因（必填）"
               value={rejectReason}
               onInput={(e) => setRejectReason(e.detail.value)}
               className="reject-input"
             />
             <Button
               type="warn"
               size="default"
               onClick={() => handleAudit('rejected')}
             >
               审核拒绝
             </Button>
           </View>
         )}
         {hotel.status === 'approved' && (
           <Button
             type="warn"
             size="default"
             onClick={() => handleAudit('offline')}
           >
             下线该酒店
           </Button>
         )}
         {hotel.status === 'offline' && (
           <Button
             type="primary"
             size="default"
             onClick={() => handleAudit('approved')}
           >
             恢复酒店上线
           </Button>
         )}
       </View>
     </ScrollView>
   );}

   export default AuditDetail;