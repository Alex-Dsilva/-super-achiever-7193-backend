const express = require("express")
const {connection} = require("./config/db")
require("dotenv").config()
const app=express();
app.use(express.json())



app.get("/",(req,res)=>{
    res.send("welcome")
}) 



app.listen(process.env.port,async()=>{
try{
    await connection
    console.log("connected to db")
}
catch(err){
    console.log(err)
}
console.log(`working on ${process.env.port}`)
})