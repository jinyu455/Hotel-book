import {useState,useEffect} from 'react'
import {View,Text,Image,Navigator,ScrollView,Checkbox,CheckboxGroup} from '@tarojs/components'
import Taro,{useReachBottom} from '@tarojs/taro'
import './list.scss'

interface Hotel{
    _id:string,
    name:string,
    images:string[],
    city:string,
    star:number,
    address:string,
    price:number, 
    facilities:string[]
}
const List=()=>{
    const [city,setCity]=useState('北京');
    const [checkIn,setCheckIn]=useState(new Date());
    const [checkOut,setCheckOut]=useState(new Date(Date.now()+86400000));
    const [keyword,setKeyword]=useState('');

    const [minPrice,setMinPrice]=useState(0);
    const [maxPrice,setMaxPrice]=useState(2000);
    const [star,setStar]=useState<number[]>([]);
    const [facilities,setFacilities]=useState<string[]>([])

    const [hotels,setHotels]=useState<Hotel[]>([]);
    const [page,setPage]=useState(1);
    const [pageSize]=useState(10);
    const [loading,setLoading]=useState(false);
    const [hasMore,setHasMore]=useState(true);

    useEffect(()=>{
        const params=new URLSearchParams();
        const routerParams=Taro.getCurrentInstance().router?.params;
        if(routerParams){
            Object.entries(routerParams).forEach(([keyword,value])=>{
                if(value!=undefined){
                    params.append(keyword,value);
                }
            });
        }
        
        const cityParam=params.get('city')||'北京';
        const decodeCity=decodeURIComponent(cityParam);
        const checkInParam=params.get('checkIn');
        const checkOutParam=params.get('checkOut');
        const keywordParam=params.get('keyword')||'';
        setCity(decodeCity);
        if(checkInParam)setCheckIn(new Date(checkInParam));
        if(checkOutParam)setCheckOut(new Date(checkOutParam));
        setKeyword(keywordParam);
    },[]);

    const fetchHotels=async(isRefresh=false)=>{
        if(loading||(!hasMore&&!isRefresh))return;
        setLoading(true);
        try{
            const currentPage=isRefresh?1:page;
            const res=await Taro.request({
                url:'http://localhost:5000/api/hotels',
                method:'GET',
                data:{
                    city,keyword,minPrice,maxPrice,
                    star:star.join(','),
                    facilities:facilities.join(','),
                    page:currentPage,
                    pageSize
                }
            });
            const newHotels:Hotel[]=res.data;
            if(isRefresh){
                setHotels(newHotels);
                setPage(2);
                setHasMore(newHotels.length===pageSize);
            }else{
                setHotels([...hotels,...newHotels]);
                setPage(page+1);
                setHasMore(newHotels.length===pageSize);
            }
        }catch(e){
            console.error('获取酒店列表失败',e);
        }finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
        fetchHotels(true);
    },[city,keyword,minPrice,maxPrice,star,facilities])

    useReachBottom(()=>{
        fetchHotels();
    })

    const handleFacilityChange=(e:any)=>{
        setFacilities(e.detail.value);
    }

    const handleStarChange=(s:number)=>{
        if(star.includes(s)){
            setStar(star.filter(item=>item!==s));
        }else{
            setStar([...star,s]);
        }
    }

    return(
        <View className='list-page'>
            <View className='top-filter'>
                <View className='filter-item'>
                    <Text>城市:{city}</Text>
                </View>
                <View className='filter-item'>
                    <Text>入住:{checkIn.toLocaleDateString()}</Text>
                </View>
                <View className='filter-item'>
                    <Text>退房:{checkOut.toLocaleDateString()}</Text>
                </View>
                <View className='filter-item'>
                    <Text>夜数:{Math.round((checkOut.getTime()-checkIn.getTime())/(86400000))}晚</Text>
                </View>
            </View>
            
            <View className='detail-filter'>
                <View className='filter-section'>
                    <Text className='section-title'>价格区间</Text>
                    <View className='price-range'>
                        <Text>{minPrice}元</Text>
                        <Text>-</Text>
                        <Text>{maxPrice}元</Text>
                    </View>
                    <View className='price-options'>
                        <View 
                            className={`price-btn ${minPrice === 0 && maxPrice === 300 ? 'active' : ''}`}
                            onClick={() => { setMinPrice(0); setMaxPrice(300); }}>300以下</View>
                        <View 
                            className={`price-btn ${minPrice === 300 && maxPrice === 700 ? 'active' : ''}`}
                            onClick={() => { setMinPrice(300); setMaxPrice(700); }}>300-700</View>
                        <View 
                            className={`price-btn ${minPrice === 700 && maxPrice === 2000 ? 'active' : ''}`}
                            onClick={() => { setMinPrice(700); setMaxPrice(2000); }}>700以上</View>
                    </View>

                </View>
                <View className='filter-section'>
                    <Text className='section-title'>酒店星级</Text>
                    <View className='star-options'>
                        {[5,4,3,2,1].map(s=>(
                            <View key={s} className={`star-btn ${star.includes(s)?'active':''}`} onClick={()=>handleStarChange(s)}>{s}星</View>
                        ))}
                    </View>
                </View>
                <View className='filter-section'>
                    <Text className='section-title'>设施服务</Text>
                    <CheckboxGroup onChange={handleFacilityChange}>
                        <View className='facility-item'>
                            <Checkbox value='wifi'>免费WIFI</Checkbox>
                            <Checkbox value='parking'>免费停车</Checkbox>
                            <Checkbox value='breakfast'>含早餐</Checkbox>
                            <Checkbox value='gym'>健身房</Checkbox>
                        </View>
                    </CheckboxGroup>
                </View>
            </View>

            <ScrollView className='hotel-list' scrollY>
                {hotels.map(hotel=>(
                    <Navigator key={hotel._id} url={`/pages/detail/index?id=${hotel._id}&checkIn=${checkIn.toISOString()}&checkOut=${checkOut.toISOString()}`}>
                        <View className='hotel-item'>
                            <Image className='hotel-img' src={hotel.images[0]} mode='aspectFill'/>
                            <View className='hotel-info'>
                                <Text className='hotel-name'>{hotel.name}</Text>
                                <Text className='hotel-star'>{hotel.star}星</Text>
                                <Text className='hotel-address'>{hotel.address}</Text>
                                <Text className='hotel-price'>{hotel.price}</Text>
                            </View>
                        </View>
                    </Navigator>
                ))}
                {loading&&<Text>加载中...</Text>}
                {!hasMore&&<Text>没有更多了</Text>}
            </ScrollView>
        </View>
    )
}
export default List;