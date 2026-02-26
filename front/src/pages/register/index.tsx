import { useState } from "react";
import Taro from "@tarojs/taro";
import {View,Input,Button,Text} from '@tarojs/components'
import './register.scss'

const Register=()=>{
    const[username,setUsername]=useState('');
    const [password,setPassword]=useState('');
    const handleRegister=async()=>{
        if(!username||!password){
            Taro.showToast({title:'账号密码不能为空',icon:'none'});
            return;
        }
        try{
            const res=await Taro.request({
                url:"http://localhost:5000/api/auth/register",
                method:'POST',
                data:{
                    username,
                    password,
                    role:'merchant'
                }
            });
            if(res.statusCode>=400){
                const errMsg=res.data?.msg||'登录失败';
                Taro.showToast({
                    title:errMsg,
                    icon:'none',
                    duration:2000
                });
                return;
            }
            Taro.showToast({title:'注册成功'});
            setTimeout(()=>{
                Taro.navigateBack();
            },1500);
        }catch(e){
            Taro.showToast({title:"注册失败",icon:'none'});
        }
    };

    return(
        <View className="register-page">
            <View className="form-box">
                <Input className='input' placeholder="用户名" value={username} onInput={e=>setUsername(e.detail.value)}/>
                <Input className='input' placeholder="密码" password value={password} onInput={e=>setPassword(e.detail.value)}/>
                <Button className='register-btn' onClick={handleRegister}>注册</Button>
            </View>
        </View>
    )
}

export default Register;