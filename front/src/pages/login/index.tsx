import { useState } from "react";
import Taro from "@tarojs/taro";
import { View, Input, Button ,Text} from "@tarojs/components";
import './login.scss'
const Login=()=>{
    const [username,setUsername]=useState('');
    const [password,setPassword]=useState('');
    const handleLogin=async()=>{
        if(!username||!password){
            Taro.showToast({title:'账号密码不能为空',icon:'none'});
            return;
        }
        try{
            const res=await Taro.request({
                url:'http://localhost:5000/api/auth/login',
                method:'POST',
                data:{username,password}
            });
            Taro.setStorageSync('token',res.data.token);
            Taro.setStorageSync('user',res.data.user);
            if(res.data.user.role==='merchant'||res.data.user.role==='admin'){
                Taro.navigateTo({url:'/pages/admin/hotel/list/index'});
            }else{
                Taro.navigateTo({url:'/pages/home/index'});
            }
        }catch(e){
            Taro.showToast({title:'登录失败',icon:'none'});
        }
    };

    const goRegister=()=>{
        Taro.navigateTo({url:'/pages/register/index'});
    }

    return(
        <View className="login-page">
            <View className="form-box">
                <Input className='input' placeholder="用户名" value={username} onInput={e=>setUsername(e.detail.value)}/>
                <Input className='input' placeholder="密码" password value={password} onInput={e=>setPassword(e.detail.value)}/>
                <Button className='login-btn' onClick={handleLogin}>登录</Button>
                <Text className='to-register' onClick={goRegister}>没有账号？去注册</Text>
            </View>
        </View>
    )
}

export default Login;