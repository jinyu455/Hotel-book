import {useState,useEffect} from 'react'
import {View,Text,Image,Button,Navigator,Picker,ScrollView,Checkbox,CheckboxGroup} from '@tarojs/components'
import Taro,{useReachBottom} from '@tarojs/taro'
import './list.scss'
import { isReadable } from 'stream'
interface Hotel{
    _id:string
    name:string
    images:string[]
    city:string
    star:number
    address:string
    price:number 
    facilities:string[]
}
const List=()=>{
    const [city,setCity]=useState('北京');
    const [checkIn,setCheckIn]=useState(new Date());
    const [checkOut,setCheckOut]=useState(new Date(Date.now()+86400000));
    const [keyword,setKeyword]=useState('');

    const [minPrice,setMinPrice]=useState(0);
    const [maxPrice,setMaxPrice]=useState(10000);
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
        const checkInParam=params.get('checkIn');
        const checkOutParam=params.get('checkOut');
        const keywordParam=params.get('keyword')||'';
        setCity(cityParam);
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
}