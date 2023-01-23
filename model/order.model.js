const  mongoose=require("mongoose");

const orderSchema = mongoose.Schema({
    shippingInfo:{
        address:{type:String , required:true},
        city:{type:String , required:true},
        state:{type:String , required:true},
        pinCode:{type:Number, required:true, maxlength: [6, "Please provide your 6 digit pincode"]}
    },
    orderitems:[
        {
            name:{type:String , required:true},
            price:{type:Number, required:true},
            quantity:{type:Number, required:true},
            image:{type:String, required:true},
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Product",
                required:true
            }

        }
    ],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    paymentInfo:{
        id:{
            type:String,
            required:true
        },
        status:{
            type:String,
            required:true
        },
    },
    paidAt:{
        type:Date,
        required:true
    },
    itemsPrice:{
        type:Number,
        required:true,
        default:0
    },
    taxPrice:{
        type:Number,
        required:true,
        default:0
    },
    shippingPrice:{
        type:Number,
        required:true,
        default:0
    },
    totalPrice:{
        type:Number,
        required:true,
        default:0
    },
    orderStatus:{
        type:String,
        required:true,
        default:"Processing"
    },
    deliveredAt:Date,
    createdAt:{type:Date, default:Date.now}
})


const OrderModel = mongoose.model("order", orderSchema);

module.exports = { OrderModel };