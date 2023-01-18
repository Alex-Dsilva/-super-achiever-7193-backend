const express=require("express")
const {ProductModel}=require("../model/product.model")
const ProductRouter=express.Router()


ProductRouter.post("/add",async(req,res)=>{
    const data=req.body
    try{
        const user=new ProductModel(data)
        await user.save()
        res.send("successfully added")
    }
    catch(err){
        console.log(err)
        res.send("something wrong while posting")
    }
})


module.exports={ProductRouter}