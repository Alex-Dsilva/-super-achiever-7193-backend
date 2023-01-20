const express=require("express")
const {UserModel}=require("../model/user.model")
const UserRouter=express.Router()
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")
const cookie = require('cookie');
require("dotenv").config()

UserRouter.post("/register",async(req,res)=>{
    const {name, email, password,role}=req.body
    console.log(password)
    try{
        bcrypt.hash(password, 5,async (err, decode)=> {
            console.log(decode)
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
            
        })
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
        const user=await UserModel.find({email})
            if(user.length>0){
            bcrypt.compare(password, user[0].password, function(err, result) {
            if(result){
            const token = jwt.sign({ "user":user[0].user }, process.env.key,{expiresIn: '24h'});
            res.setHeader('Set-Cookie', cookie.serialize('token', token, {
                httpOnly: true,
                maxAge: 60 * 60 * 24 // 1 day in seconds
              }));
            res.send({message:"Login successfull",user:user})
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

module.exports={UserRouter}