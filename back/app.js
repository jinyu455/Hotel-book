const express = require('express');
const mongoose=require('mongoose');
const app = express();
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/smart-travel-hotel')
.then(()=>console.log('MongoDB连接成功'))
.catch(e=>console.log(e));
const authRouter = require('./routes/auth');
const hotelsRouter = require('./routes/hotels');
const ordersRouter = require('./routes/orders');
const reviewsRouter = require('./routes/reviews');
const uploadRouter = require('./routes/upload');

app.use('/api/auth', authRouter);
app.use('/api/hotels', hotelsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/upload', uploadRouter);

app.use((err, req, res, next) => {
  console.error('❌ 全局错误:', err.stack);
  res.status(500).json({ msg: '服务器内部错误', error: err.message });
});

const PORT=5000;
app.listen(PORT,()=>console.log(`服务器运行在端口${PORT}`));