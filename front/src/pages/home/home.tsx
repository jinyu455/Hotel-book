import {useState,useEffect} from 'react'
import {View,Text,Swiper,SwiperItem,Image,Input,Button,Navigator} from '@tarojs/components'
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
    /*useEffect(()=>{
        const fetchBanners=async()=>{
            try{
                const res=await fetch('http://localhost:5000/api/hotels?star=4,5');
                const data=await res.json();
                setBanners(data.slice(0,5))
            }catch(e){
                console.error('获取Banner失败',e);
            }
        }
        fetchBanners();
    },[])*/

    useEffect(() => {
  // 本地模拟数据，直接能用
  const mockData = [
    {
      _id: '1',
      name: '北京豪华酒店',
      // 👇 这些是小程序支持的图片地址
      images: ['https://picsum.photos/800/450?random=1'],
      city: '北京',
      star: 5,
      address: '北京市中心',
    },
    {
      _id: '2',
      name: '上海外滩酒店',
      images: ['https://picsum.photos/800/450?random=2'],
      city: '上海',
      star: 4,
      address: '上海外滩',
    },
    {
      _id: '3',
      name: '广州精品酒店',
      images: ['https://picsum.photos/800/450?random=3'],
      city: '广州',
      star: 5,
      address: '广州天河区',
    },
  ]

  // 直接设置，不请求后端
  setBanners(mockData)
}, [])

    const handleSearch=()=>{
        const params=new URLSearchParams({
            city,
            checkIn:checkIn.toISOString(),
            checkOut:checkOut.toISOString(),
            keyword,
        })
        Taro.navigateTo({
            url:`/pages/list?${params.toString()}`
        })
    }
    return(
        <View className ='home-page'>
            <Swiper className='banner-swiper' autoplay circular indicatorDots indicatorColor='#999' indicatorActiveColor='#fff'>
                {banners.map((hotel)=>(
                    <SwiperItem key={hotel._id}>
                        <Navigator url={`/pages/detail?id=${hotel._id}`}>
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
                    <Text className='date-text' onClick={()=>{}}>{checkIn.toLocaleDateString()}</Text>
                    <Text className='label'>退房</Text>
                    <Text className='date-text' onClick={()=>{}}>{checkOut.toLocaleDateString()}</Text>
                </View>
                <Button className='search-btn' onClick={handleSearch}>查询酒店</Button>
            </View>
        </View>
    )   
}
export default Home;