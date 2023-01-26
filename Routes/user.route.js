const express=require("express")
const {UserModel}=require("../model/user.model")
const UserRouter=express.Router()
const {checkRole}=require("../middleware/checkrole")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")
const crypto = require('crypto');
const cookie = require('cookie');
require("dotenv").config()

UserRouter.post("/register",async(req,res)=>{
    const {name, email, password,role}=req.body
    try{
        const user=await UserModel.find({email})
        if(!user.length){
        bcrypt.hash(password, 5,async (err, decode)=> {
            if(err){
                res.send("something wrong while registering new user please try again")
            }else{
                const user=await UserModel.create({name, email, password:decode,avatar:{public_id:"temp",}})
                const token = jwt.sign({"name":name}, process.env.key,{expiresIn: '24h'});
                res.setHeader('Set-Cookie', cookie.serialize('token', token, {
                    httpOnly: true,
                    maxAge: 60 * 60 * 24 // 1 day in seconds
                  }));
                res.send({message:"User registeration successfull", user:user})
            }
            
        })}else{
            res.send("user already exists")
        }
    }
    catch(err){
        console.log(err.message)
        if(err.code===11000){
            res.send("User already exists")
        }else{
            res.send("something wrong while registering new user")
        }
        
    }
})

UserRouter.post("/login",async (req,res)=>{
    const{email,password}=req.body
    try{
        const user=await UserModel.find({email}).select("+password");
            if(user.length>0){
            bcrypt.compare(password, user[0].password, function(err, result) {
            if(result){
            const token = jwt.sign({ "user":user[0].user }, process.env.key,{expiresIn: '24h'});
            // console.log(user)
            res.setHeader('Set-Cookie', [
                cookie.serialize('token', token, {
                             httpOnly: true,
                             maxAge: 60 * 60 * 24 // 1 day in seconds
                           }),
                cookie.serialize('role', user[0].role, {
                             httpOnly: true,
                             maxAge: 60 * 60 * 24 // 1 day in seconds
                           }),
                cookie.serialize('role', user[0].role, {
                            httpOnly: true,
                            maxAge: 60 * 60 * 24 // 1 day in seconds
                          })
             ]);
            //   res.setHeader();
            res.send({message:"Login successfull"})
            } else {res.send("Wrong Credntials")}
            });
            } else {
            res.send("User Dose not exists")
            }
    }
    catch(err){
        console.log(err)
        res.send("Login Failed please try again")
    }
})

UserRouter.post("/logout",async (req,res)=>{

    req.headers.cookie=""
    console.log(req.headers)
    res.send({message:"Logged Out"})
})


UserRouter.post('/reset', async (req, res) => {
    try {
        // Find the user by email
        const user = await UserModel.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        // Generate a password reset code
        const resetCode = crypto.randomBytes(4).toString('hex');

        // Save the password reset code and its expiration date to the user's document
        user.resetCode = resetCode;
        user.resetCodeExpiration = Date.now() + 600000; // 10 minutes
        await user.save();

        // Send the password reset code to the user's email address
        // You can use your own method to send the code to the user's email address
        sendResetCodeToEmail(req.body.email, resetCode);

        return res.status(200).send({ message: 'Code sent' });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: 'Server error' });
    }
});

UserRouter.post('/reset/verify', async (req, res) => {
    try {
        // Find the user by email
        const user = await UserModel.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        // Check if the code is valid and has not expired
        if (user.resetCode !== req.body.code || user.resetCodeExpiration < Date.now()) {
            return res.status(401).send({ message: 'Invalid code' });
        }

        // Update the user's password
        UserModel.password = req.body.password;
        await UserModel.save();

        return res.status(200).send({ message: 'Password reset' });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: 'Server error' });
    }
});

UserRouter.get("/admin/users",checkRole, async(req,res)=>{
    try {
        const users=await UserModel.find()
        res.send({message:"get all users details", users})
        
    } catch (err) {
        res.send({message:"failed to get all users details ", err})
    }
})

UserRouter.get("/admin/users/:id",checkRole, async(req,res)=>{
    const { id } = req.params;
    try {
        const user=await UserModel.find({_id:id})
        if(!user.length){
            res.send({message:"user not found"})
        }else{
            res.send({message:"get user details", user})
        }
       
        
    } catch (err) {
        res.send({message:"failed to get user details ", err})
    }
})

UserRouter.delete("/admin/users/:id",checkRole, async(req,res)=>{
    const { id } = req.params;
    try {
        const user=await UserModel.find({_id:id})
        if(!user.length){
            res.send({message:"user not found"})
        }else{
            await user.remove()
            res.send({message:"user profile Deleted"})
        }
        
    } catch (err) {
        res.send({message:"failed to Delete user details ", err})
    }
})

// UserRouter.patch("/admin/users", async(req,res)=>{

//     try {
//         console.log("hi")
//         await UserModel.findByIdAndUpdate({ _id: "63cdd2cca9f6b519a7aa6225" }, {role:"admin"}, {
//             new: true,
//             runValidators: true,
//             useFindAndModify: false,
//        });

//         res.send({message:"get all users details"})
        
//     } catch (err) {
//         res.send({message:"failed to get all users details ", err})
//     }
// })





module.exports={UserRouter}