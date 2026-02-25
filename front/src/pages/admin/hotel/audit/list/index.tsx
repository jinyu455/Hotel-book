 import { useState, useEffect } from 'react';
 import { View, Text, Button, ScrollView, Picker } from '@tarojs/components';
 import Taro, { useDidShow } from '@tarojs/taro';
 import './list.scss';
 import AuditModal from '../components/AuditModal';

 interface Hotel{
  _id:string,
  name:string,
  address:string,
  status:'pending'|'approved'|'rejected'|'offline'
 }

 const statusMap = {
   pending: '待审核',
   approved: '已通过',
   rejected: '已拒绝',
   offline: '已下线'
 };

 const statusOptions = [
   { label: '待审核', value: 'pending' },
   { label: '已通过', value: 'approved' },
   { label: '已拒绝', value: 'rejected' },
   { label: '已下线', value: 'offline' },
 ];

 const AuditList=()=> {
   const [status, setStatus] = useState('pending');
   const [list, setList] = useState<Hotel[]>([]);
   const [loading, setLoading] = useState(true);
   const [modalVisible,setModalVisible]=useState(false);
   const [currentItemId,setCurrentItemId]=useState<string>('');
   const [page, setPage] = useState(1);
   const pageSize = 10;

   useEffect(() => {
     const token = Taro.getStorageSync('token');
     if (!token) {
       Taro.reLaunch({ url: '/pages/login/index' });
       return;
     }
     fetchList();
   }, [status, page]);

   useDidShow(() => {
     const token = Taro.getStorageSync('token');
     if (!token) {
       Taro.reLaunch({ url: '/pages/login/index' });
       return;
     }
     fetchList();
   });

   const fetchList = async () => {
     try {
       setLoading(true);
       const token = Taro.getStorageSync('token');
       const res = await Taro.request({
         url: 'http://localhost:5000/api/hotels/admin/audit',
         method: 'GET',
         data: { status, page, pageSize },
         header: { 'x-auth-token': token }
       });

       setList(res.data?.data || []);
     } catch (err) {
       Taro.showToast({ title: '列表加载失败', icon: 'none' });
       setList([]);
     } finally {
       setLoading(false);
     }
   };

   const goDetail = (hotelId) => {
     Taro.navigateTo({ url: `/pages/admin/hotel/audit/detail/index?id=${hotelId}` });
   };

   const handleAudit = async (hotelId, newStatus, reason?) => {
     try {
       const token = Taro.getStorageSync('token');
       await Taro.request({
         url: `http://localhost:5000/api/hotels/${hotelId}/audit`,
         method: 'PUT',
         data: {
           status: newStatus,
           rejectReason: reason || ''
         },
         header: { 'x-auth-token': token }
       });
       Taro.showToast({ title: '操作成功', icon: 'success' });
       fetchList();
     } catch (err) {
       Taro.showToast({ title: '操作失败', icon: 'none' });
     }
   };
   if (loading) return <View className="loading-wrapper"><Text>加载中...</Text></View>;

   return(
      <View className="audit-list-page">
       <View className="filter-bar">
         <Picker
           mode="selector"
           range={statusOptions.map(item => item.label)}
           value={statusOptions.findIndex(o => o.value === status)}
           onChange={(e) => {
             const idx = e.detail.value;
             setStatus(statusOptions[idx].value);
             setPage(1);
           }}
         >
           <View className="filter-picker">
             当前筛选：{statusMap[status]}
           </View>
         </Picker>
       </View>
       {list.length === 0 ? (
         <View className='empty-container'>
            <Text className='empty_text'>暂无酒店数据</Text>
            <Button className='empty-refresh' size='mini' onClick={fetchList}>点击刷新</Button>
         </View>
       ) : (
         <ScrollView className="list-container" scrollY>
           {list.map((item) => (
             <View
               key={item._id}
               className="list-item"
               onClick={() => goDetail(item._id)}
             >
               <View className="item-header">
                 <Text className="hotel-name">{item.name}</Text>
                 <Text className={`status-tag status-${item.status}`}>
                   {statusMap[item.status]}
                 </Text>
               </View>
               <Text className="hotel-address">{item.address}</Text>
               <View className="item-actions">
                 {item.status === 'pending' && (
                   <>
                     <Button
                       size="mini"
                       type="primary"
                       onClick={(e) => {
                         e.stopPropagation();
                         handleAudit(item._id, 'approved');
                       }}
                     >
                       通过
                     </Button>
                     <Button
                       size="mini"
                       type="warn"
                       onClick={async(e) => {
                         e.stopPropagation();
                         setCurrentItemId(item._id);
                         setModalVisible(true);
                       }}
                     >
                       拒绝
                     </Button>
                   </>
                 )}
                 {item.status === 'approved' && (
                   <Button
                     size="mini"
                     type="warn"
                     onClick={(e) => {
                       e.stopPropagation();
                       handleAudit(item._id, 'offline');
                     }}
                   >
                     下线
                   </Button>
                 )}
                 {item.status === 'offline' && (
                   <Button
                     size="mini"
                     type="primary"
                     onClick={(e) => {
                       e.stopPropagation();
                       handleAudit(item._id, 'approved');
                     }}
                   >
                     恢复上线
                   </Button>
                 )}
               </View>
             </View>
           ))}
         </ScrollView>
       )}
       <AuditModal visible={modalVisible}
                   onClose={()=>{setModalVisible(false)}}
                   onConfirm={(reason)=>{handleAudit(currentItemId,'rejected',reason)}}/>
     </View>
   )}


   export default AuditList;
