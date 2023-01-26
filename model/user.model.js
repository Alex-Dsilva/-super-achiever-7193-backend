const mongoose=require("mongoose");
const valiator=require("validator");

const UserSchema= mongoose.Schema({
    name:{type:String, required:[true,"Please enter your name"]},
    email:{type:String, required:[true,"Please enter your Email"], unique:true, validator:[valiator.isEmail,"Please Enter a valid Email"] },
    password:{type:String, required:[true,"Please enter your password"],minLength:[8,"Password should be greater then 8 characters"], select:false,},
    avatar:{
        public_id:{
            type:String,
            // required:true
        },
        url:{
            type:String,
            default:"https://cdn-icons-png.flaticon.com/512/149/149071.png"
            // required:true
        }
    },
    role:{
        type:String,
        default:"user"
    },
    resetpasswordtoken:String,
    resetpasswordExpire:Date
})


const UserModel=mongoose.model("User",UserSchema)


module.exports={UserModel}