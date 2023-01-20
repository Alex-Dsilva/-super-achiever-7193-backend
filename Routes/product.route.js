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
        res.send("something wrong while creating product")
    }
})

ProductRouter.get("/",async(req,res)=>{
    try{
        const data=await ProductModel.find()
        res.send(data)
    }
    catch(err){
        console.log(err)
        res.send("something wrong while getting products")
    }
})

ProductRouter.patch("/update/:id",async(req,res)=>{
    const {id}=req.params
    const payload=req.body
    try{
        await PostModel.findByIdAndUpdate({_id:id},payload,{new:true, runValidators:true, useFindAndModify:false})
        res.send(`post upadted with the id ${id}`)
    }
    catch(err){
        console.log(err);

        res.send("something wrong while updating your posts")
    }

})


module.exports={ProductRouter}