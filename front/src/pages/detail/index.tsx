import{useState,useEffect}from 'react'
import{View,Text,Swiper,SwiperItem,Image,ScrollView ,Navigator}from '@tarojs/components'
import Taro from '@tarojs/taro'
import './detail.scss'
import { type } from 'os'
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
    }]
}

const HotelDetail=()=>{
    const [hotel,setHotel]=useState<Hotel|null>(null);
    const [loading,setLoading]=useState(true);
    const hotelId=Taro.getCurrentInstance().router?.params?.id;

    const fetchHotelDetail=async()=>{
        try{
            setLoading(true);
            const res=await Taro.request<Hotel>({url:`http://localhost:5000/api/hotels/${hotelId}`});
            setHotel(res.data);
        }catch(e){
            console.error('获取详情失败',e);
            Taro.showToast({title:'获取详情失败',icon:'none'});
        }finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
        if(!hotelId)return;
        fetchHotelDetail();
    },[hotelId]);

    if(loading){
        return<View className='loading'>加载中</View>;
    }

    if(!hotel){
        return<View className='empty'>酒店不存在</View>;
    }

    return(
        <ScrollView className='detail-page' scrollY>
            <Swiper className='banner' indicatorDots autoplay interval={3000} duration={500}>
                {hotel.images?.map((img,index)=>(
                    <SwiperItem key={index}>
                        <Image src={img} className='banner-img' mode='aspectFill'/>
                    </SwiperItem>
                ))}
            </Swiper>
            <View className='info-section'>
                <Text className='name'>{hotel.name}</Text>
                <View className='star'>
                    {Array.from({length:hotel.star}).map((_,i)=>(
                        <Text key={i} className='star-icon'>★</Text>
                    ))}
                </View>
                <Text className='address'>{hotel.address}</Text>
                <View className='facilities'>
                    {hotel.facilities?.map((facility,i)=>(
                        <Text key={i} className='facility-tag'>{facility}</Text>
                    ))}
                </View>
            </View>
            <View className='rooms-section'>
                <Text className='section-title'>房型与价格</Text>
                {hotel.rooms?.map((room,index)=>(
                    <View key={index} className='room-item'>
                        <View className='room-type'>{room.type}</View>
                        <View className='room-price'>{room.price}元</View>
                        <View className='room-stock'>剩余：{room.stock}间</View>
                    </View>
                ))}
            </View>
            <View className='intro-section'>
                <Text className='section-title'>酒店介绍：</Text>
                <Text className='intro'>{hotel.intro||'暂无介绍'}</Text>
            </View>
        </ScrollView>
    )
}

HotelDetail.config={
    navigationBarTitleText:'酒店详情',
    navigationBarBackBUttonHidden:false
}

export default HotelDetail;