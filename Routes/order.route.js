const express = require("express");
const {OrderModel}=require("../model/order.model")
const {checkrole}=require("../middleware/checkrole")
const OrderRouter = express.Router();

OrderRouter.post("/new", async(req,res)=>{
    const {
        user_id,
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice  
    }=req.body

    try {
        const order=await OrderModel.create({
            shippingInfo,
            orderItems,
            paymentInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paidAt:Date.now(),
            user:user_id
        })

        res.send({"msg":"Order created", order})

    } catch (err) {
        res.send({"msg":"Failed to create Order", err})
    }

})


OrderRouter.get("/myorder/:id", async(req,res)=>{

    const {id}=req.params

    try {
        const order=await OrderModel.findById(id)

        if(!order){
            res.send({"Err":"order not found"})  
        }
        res.send({"msg":"Order found", order})

    } catch (err) {
        res.send({"msg":"Failed to create Order", err})
    }

})

OrderRouter.get("/Singleorder/:id", async(req,res)=>{

    const {id}=req.params

    try {
        const order=await OrderModel.findById(id).populate("user","name email")

        if(!order){
            res.send({"Err":"order not found"})  
        }
        res.send({"msg":"Order found", order})

    } catch (err) {
        res.send({"msg":"Failed to create Order", err})
    }

})

OrderRouter.put("/updateOrder", async(req,res)=>{

    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return next(new ErrorHander("Order not found with this Id", 404));
          }
        
          if (order.orderStatus === "Delivered") {
            return next(new ErrorHander("You have already delivered this order", 400));
          }
        
          if (req.body.status === "Shipped") {
            order.orderItems.forEach(async (o) => {
              await updateStock(o.product, o.quantity);
            });
          }
          order.orderStatus = req.body.status;
        
          if (req.body.status === "Delivered") {
            order.deliveredAt = Date.now();
          }

          await order.save({ validateBeforeSave: false });
        res.send({"msg":"update successful"})

    } catch (err) {
        res.send({"msg":"Failed to get Orders", err})
    }

})

OrderRouter.get("/allOrder", async(req,res)=>{

    try {
        const order =await order.find();

        let totalAmount=0
        order.forEach((order) => {
            totalAmount += order.totalPrice;
          });
        res.send({"msg":"success", totalAmount,order})

    } catch (err) {
        res.send({"msg":"Failed to get Orders", err})
    }

})

OrderRouter.put("/updateStock", async(req,res)=>{

    try {
        const product = await Product.findById(id);

        product.Stock -= quantity;
      
        await product.save({ validateBeforeSave: false });
        res.send({"msg":"update successful"})

    } catch (err) {
        res.send({"msg":"Failed to update stock", err})
    }

})

OrderRouter.delete("/deleteOrder", async(req,res)=>{

    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            res.send({"msg":"Order not found with this Id"})
        }
      
        await order.remove();
        res.send({"msg":"deleteOrder successful"})

    } catch (err) {
        res.send({"msg":"Failed to delete Order", err})
    }

})


module.exports={OrderRouter}