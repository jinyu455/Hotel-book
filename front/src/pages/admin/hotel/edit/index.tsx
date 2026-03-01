import { useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import {
  View, Text, Button, Input, Textarea,
  Checkbox, Label, Picker,Image
} from '@tarojs/components'
import './edit.scss'

interface Room {
  type: string;
  price: number;
  stock: number;
}

interface Hotel {
  _id?: string;
  name: string;
  address: string;
  city: string;
  star: number;
  intro?: string;
  facilities: string[];
  images: string[];
  rooms: Room[];
  merchantId?: string;
  status?: 'pending' | 'approved' | 'rejected' | 'offline';
  rejectReason?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const allFacilities = [
  { label: '免费wiFi', value: '免费wifi' },
  { label: '免费停车', value: '免费停车' },
  { label: '含早餐', value: '含早餐' },
  { label: '健身房', value: '健身房' },
]

const HotelEdit = () => {
  const [hotelId, setHotelId] = useState<string>('')
  const [form, setForm] = useState<Hotel>({
    name: '',
    address: '',
    city: '',
    star: 3,
    intro: '',
    facilities: [],
    images: [],
    rooms: [{ type: '', price: 0, stock: 0 }],
  })

  const starRange = ['1星', '2星', '3星', '4星', '5星']

  useEffect(() => {
    const { id } = Taro.getCurrentInstance().router?.params || {};
    if (id) {
      setHotelId(id);
      getHotelDetail(id);
    }
  }, [])

  const getHotelDetail = async (id: string) => {
    try {
      const token = Taro.getStorageSync('token');
      const res = await Taro.request({
        url: `http://localhost:5000/api/hotels/${id}`,
        header: { 'x-auth-token': token }
      });
      setForm(res.data);
    } catch (e) {
      Taro.showToast({ title: '获取详情失败', icon: 'none' });
    }
  }

  const handleChange = (key: keyof Hotel, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  const handleRoomChange = (index: number, key: keyof Room, value: any) => {
    const newRooms = [...form.rooms];
    if(key === 'price' || key === 'stock' ){
        newRooms[index][key] = Number(value);
    }else{
        newRooms[index][key] =value;
    }
    setForm(prev => ({ ...prev, rooms: newRooms }));
  }

  const addRoom = () => {
    setForm(prev => ({
      ...prev,
      rooms: [...prev.rooms, { type: '', price: 0, stock: 0 }]
    }))
  }

  const removeRoom = (index: number) => {
    if (form.rooms.length <= 1) return
    const newRooms = form.rooms.filter((_, i) => i !== index)
    setForm(prev => ({ ...prev, rooms: newRooms }))
  }

  const handleSubmit = async () => {
    if (!form.name || !form.address || !form.city) {
      Taro.showToast({ title: '请填写完整信息', icon: 'none' })
      return
    }

    try {
      const token = Taro.getStorageSync('token');
      const url = hotelId
        ? `http://localhost:5000/api/hotels/${hotelId}`
        : 'http://localhost:5000/api/hotels';

      const method = hotelId ? 'PUT' : 'POST';

      const submitData={
        ...form,
        status:hotelId?'pending':form.status
      };

      await Taro.request({
        url,
        method,
        header: { 'x-auth-token': token },
        data: submitData
      })

      Taro.showToast({ title: '保存成功', icon: 'success' })
      setTimeout(() => {
        Taro.navigateBack()
      }, 1500)
    } catch (e) {
      Taro.showToast({ title: '保存失败', icon: 'none' })
    }
  }

  const handleDelete = async () => {
    const { confirm } = await Taro.showModal({
      title: '确认删除',
      content: '确定要删除该酒店吗？此操作不可恢复。',
      confirmColor: '#ff4d4f'
    })

    if (!confirm) return

    try {
      const token = Taro.getStorageSync('token')
      await Taro.request({
        url: `http://localhost:5000/api/hotels/${hotelId}`,
        method: 'DELETE',
        header: { 'x-auth-token': token }
      })

      Taro.showToast({ title: '删除成功', icon: 'success' })
      setTimeout(() => {
        Taro.navigateBack()
      }, 1500)
    } catch (e) {
      Taro.showToast({ title: '删除失败', icon: 'none' })
    }
  }

  const handleImageUpload = async () => {
    try {
      const res = await Taro.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera']
      });

      const tempFilePath = res.tempFiles[0].path;
      const token = Taro.getStorageSync('token');

      const uploadRes = await Taro.uploadFile({
        url: 'http://localhost:5000/api/upload',
        filePath: tempFilePath,
        name: 'image',
        header: { 'x-auth-token': token }
      });

      const data = JSON.parse(uploadRes.data);
      console.log('uploadRes.data:',uploadRes.data);
      const fullUrl = `http://localhost:5000${data.url}`;

      setForm(prev => ({
        ...prev,
        images: [...prev.images, fullUrl]
      }));

      Taro.showToast({ title: '上传成功', icon: 'success' });
    } catch (e) {
      Taro.showToast({ title: '上传失败', icon: 'none' });
    }
  };

  const removeImage =async(index: number) => {
    const imageUrl=form.images[index];
    if(!imageUrl)return;
    try{
      const filename=imageUrl.split('/uploads/')[1];
      if(!filename)throw new Error('文件名解析失败');
      console.log(`http:localhost:5000/api/upload/${filename}`);
      await Taro.request({
        url:`http://localhost:5000/api/upload/${filename}`,
        method:'DELETE'
      })
      setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
      }));
      Taro.showToast({title:'删除成功',icon:'success'});
    }catch(e){
      console.error(e);
      Taro.showToast({title:'删除失败',icon:'none'});
    }
    
  };


  return (
    <View className="hotel-edit-page">
       <View className="form-item">
         <Text className="label">酒店名称</Text>
         <Input
           value={form.name}
           placeholder="请输入酒店名称"
           onInput={e => handleChange('name', e.detail.value)}
         />
       </View>
       <View className="form-item">
         <Text className="label">所在城市</Text>
         <Input
           value={form.city}
           placeholder="请输入城市"
           onInput={e => handleChange('city', e.detail.value)}
         />
       </View>
       <View className="form-item">
         <Text className="label">酒店地址</Text>
         <Input
           value={form.address}
           placeholder="请输入详细地址"
           onInput={e => handleChange('address', e.detail.value)}
         />
       </View>
       <View className="form-item">
         <Text className="label">酒店星级</Text>
         <Picker
           mode="selector"
           range={starRange}
           value={form.star - 1}
           onChange={e => {
             const star = Number(e.detail.value) + 1
             handleChange('star', star)
           }}
         >
           <View className="picker-text">{form.star} 星</View>
         </Picker>
       </View>
       <View className="form-item">
         <Text className="label">酒店介绍</Text>
         <Textarea
           value={form.intro || ''}
           placeholder="请输入酒店介绍"
           onInput={e => handleChange('intro', e.detail.value)}
         />
       </View>
       <View className="form-item">
         <Text className="label">酒店设施</Text>
         <View className="facility-list">
          {allFacilities.map(item => (
           <Label key={item.value} className="facility-item">
            <Checkbox
             value={item.value}
             checked={form.facilities.includes(item.value)}
             onClick={() => {
               const newValue = item.value;
               let newFacilities = [...form.facilities]; 
               if (newFacilities.includes(newValue)) {
                newFacilities = newFacilities.filter(v => v !== newValue);
                } else {
                newFacilities.push(newValue);
                }
               handleChange('facilities', newFacilities);
             }}
            />
            <Text>{item.label}</Text>
           </Label>
          ))}
         </View>
       </View>
       <View className="form-item">
         <Text className="label">酒店图片</Text>
         <View className="image-list">
           {form.images.map((img, idx) => (
             <View key={idx} className="image-item">
               <Image
                 src={img}
                 className="preview-img"
                 mode="aspectFill"
               />
               <Button
                 size="mini"
                 className="del-img-btn"
                 onClick={() => removeImage(idx)}
               >  
               </Button>
             </View>
           ))}
           <Button
             size="mini"
             className="upload-btn"
             onClick={handleImageUpload}
           >上传图片</Button>
         </View>
       </View>
       <View className="form-item rooms-section">
         <View className="room-header">
           <Text className="label">房型设置</Text>
           <Button size="mini" onClick={addRoom}>添加房型</Button>
         </View>
         {form.rooms.map((room, index) => (
           <View key={index} className="room-item">
             <Input
               placeholder="房型名称"
               value={room.type}
               onInput={e => handleRoomChange(index, 'type', e.detail.value)}
             />
             <Input
               type="number"
               placeholder="价格"
               value={String(room.price)}
               onInput={e => handleRoomChange(index, 'price', e.detail.value)}
             />
             <Text className="unit">元</Text>
             <Input
               type="number"
               placeholder="库存"
               value={String(room.stock)}
               onInput={e => handleRoomChange(index, 'stock', e.detail.value)}
             />
             <Text className="unit">间</Text>
             <Button size="mini" onClick={() => removeRoom(index)}>删</Button>
           </View>
         ))}
       </View>
       <View className="submit-box">
         <Button className="submit-btn" onClick={handleSubmit}>
           {hotelId ? '保存修改' : '创建酒店'}
         </Button>
         {hotelId && (
          <Button className="delete-btn" onClick={handleDelete}>删除酒店</Button>)}
       </View>
     </View>
   )
 }
 export default HotelEdit