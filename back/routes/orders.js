const express=require('express');
const router=express.Router();
const Order=require('../models/Order');
const Hotel=require('../models/Hotel');
const auth=require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  try {
    const { hotelId, roomType, checkIn, checkOut, totalPrice } = req.body;
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ msg: '酒店不存在' });
    }
    const room = hotel.rooms.find(r => r.type === roomType);
    if (!room || room.stock <= 0) {
      return res.status(400).json({ msg: '该房型已满或不存在' });
    }
    room.stock -= 1;
    await hotel.save();
    const order = new Order({
      userId: req.user.id,
      hotelId,
      roomType,
      checkIn,
      checkOut,
      totalPrice,
      status: 'pending'
    });
    await order.save();
    res.status(201).json(order);
  } catch (e) {
    res.status(400).json({ msg: '创建订单失败', e });
  }
});//创订单

router.get('/',auth,async(req,res)=>{
    try{
        const orders=await Order.find({userId:req.user.id}).populate('hotelId');
        res.json(orders);
    }catch(e){
        res.status(400).json({msg:'查订单失败',e});
    }
});//查订单

router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ msg: '订单不存在' });
    }
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: '无权取消此订单' });
    }
    if (order.status !== 'pending' && order.status !== 'paid') {
      return res.status(400).json({ msg: '此订单无法取消' });
    }
    const hotel = await Hotel.findById(order.hotelId);
    if (hotel) {
      const room = hotel.rooms.find(r => r.type === order.roomType);
      if (room) {
        room.stock += 1;
        await hotel.save();
      }
    }
    order.status = 'canceled';
    await order.save();
    res.json({ msg: '订单已取消', order });
  } catch (e) {
    res.status(400).json({ msg: '取消订单失败', e });
  }
});//取笑订单

module.exports=router;