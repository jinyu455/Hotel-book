import {useState,useEffect} from 'react'
import {View,Text,Swiper,SwiperItem,Image,Input,Button,Navigator, Picker} from '@tarojs/components'
import Taro from '@tarojs/taro'
import './home.scss'
interface Hotel{
    _id: string,
    name: string,
    images: string[],
    city: string,
    star: number,
    address: string
}
const Home=()=>{
    const [banners,setBanners]=useState<Hotel[]>([]);
    const [city,setCity]=useState('北京');
    const[keyword,setKeyword]=useState('');
    const[checkIn,setCheckIn]=useState(new Date());
    const [checkOut,setCheckOut]=useState(new Date(Date.now()+86400000));
    useEffect(()=>{
        const fetchBanners=async()=>{
            try{
                const res=await Taro.request({url:'http://localhost:5000/api/hotels?star=4,5',method:'GET'});
                const data=await res.data;
                setBanners(data.slice(0,5))
            }catch(e){
                console.error('获取Banner失败',e);
            }
        }
        fetchBanners();
    },[])


    const handleSearch = () => {
        const url = `/pages/list/index?city=${encodeURIComponent(city)}&checkIn=${checkIn.toISOString()}&checkOut=${checkOut.toISOString()}&keyword=${encodeURIComponent(keyword)}`;
        Taro.navigateTo({ url });
    }
    
    return(
        <View className ='home-page'>
            <Swiper className='banner-swiper' autoplay circular indicatorDots indicatorColor='#999' indicatorActiveColor='#fff'>
                {banners.map((hotel)=>(
                    <SwiperItem key={hotel._id}>
                        <Navigator url={`/pages/detail/index?id=${hotel._id}`}>
                            <Image className='banner-img' src={hotel.images[0]} mode='aspectFill'/>
                            <View className='banner-title'>{hotel.name}</View>
                        </Navigator>
                    </SwiperItem>
                ))}
            </Swiper>       
            <View className='search-container'>
                <View className='search-item'>
                    <Text className='label'>城市</Text>
                    <Input className='input' value={city} onInput={(e)=>setCity(e.detail.value)} placeholder='请输入城市'/>
                </View>
                <View className='search-item'>
                    <Text className='label'>关键字</Text>
                    <Input className='input' value={keyword} onInput={(e)=>setKeyword(e.detail.value)} placeholder='酒店名称/地址'/>
                </View>
                <View className='search-item date-item'>
                    <Text className='label'>入住</Text>
                    <Picker mode='date' value={checkIn.toISOString().split('T')[0]} onChange={(e)=>{
                        const selected=new Date(e.detail.value);
                        const selDate=new Date(selected.getFullYear(),selected.getMonth(),selected.getDate());
                        const outDate=new Date(checkOut.getFullYear(),checkOut.getMonth(),checkOut.getDate());
                        setCheckIn(selected);
                        if(selDate>=outDate){
                            setCheckOut(new Date(selected.getTime()+86400000));
                        }
                    }}>
                        <Text className='date-text' onClick={()=>{}}>{checkIn.toLocaleDateString()}</Text>
                    </Picker>
                    <Text className='label'>退房</Text>
                    <Picker mode='date' value={checkOut.toISOString().split('T')[0]} onChange={(e)=>{
                        const selected=new Date(e.detail.value);
                        setCheckOut(selected);
                        if(selected<=checkIn){
                            setCheckOut(new Date(selected.getTime()+86400000));
                            Taro.showToast({title:'退房不能早于入住',icon:'none'});
                            return;
                        }
                    }}>
                        <Text className='date-text' onClick={()=>{}}>{checkOut.toLocaleDateString()}</Text>
                    </Picker>
                </View>
                <Button className='search-btn' onClick={handleSearch}>查询酒店</Button>
            </View>
        </View>
    )
}
export default Home;