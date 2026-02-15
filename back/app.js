const express = require('express');
const mongoose=require('mongoose');
const app = express();
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/smart-travel-hotel')
.then(()=>console.log('MongoDB连接成功'))
.catch(e=>console(e));
app.use('/api/auth',require('./routes/auth'));
app.use('/api/hotels',require('./routes/hotels'));
app.use('/api/orders',require('./routes/orders'));
app.use('/api/reviews',require('./routes/reviews'));
const PORT=5000;
app.listen(PORT,()=>console.log(`服务器运行在端口${PORT}`));