const express = require("express");
const {checkRole}=require("../middleware/checkrole")
const { products } = require("../constants/data");
const { ProductModel } = require("../model/product.model");
const ProductRouter = express.Router();

ProductRouter.post("/add", checkRole,  async (req, res) => {
     const data = req.body;
     try {
          const user = new ProductModel(data);
          await user.save();
          res.status(201).send({ msg: "Created SUCCESSFULLY" });
     } catch (err) {
          console.log(err);
          res.status(404).send({
               msg: "something wrong while creating product",
          });
     }
});

ProductRouter.get("/", async (req, res) => {
     try {
          console.log("query", req.query);
          console.log("params", req.params);
          let {
               productname,
               productBrand,
               productCategory,
               sortBy,
               limit = 50,
               page = 1,
          } = req.query;
          if (productBrand !== undefined) {
               productBrand = productBrand.toString();
          }
          console.log("productBrand", productBrand);
          let queries = {};

          if (
               productname === undefined &&
               productBrand === undefined &&
               productCategory === undefined
          ) {
               queries = {};
          } else if (productname === undefined) {
               queries.productBrand = { $regex: productBrand, $options: "i" };
          } else if (productBrand === undefined) {
               queries.productname = { $regex: productname, $options: "i" };
          } else if (productname === undefined && productBrand === undefined) {
               queries.productBrand = { $regex: productBrand, $options: "i" };
          } else if (productBrand === undefined) {
               queries.productname = { $regex: productname, $options: "i" };
          } else {
               queries.productBrand = { $regex: productBrand, $options: "i" };
               queries.productname = { $regex: productname, $options: "i" };
          }

          let sorting = {};
          if (sortBy != undefined) {
               sorting[sortBy] = 1;
          }

          let products = await ProductModel.find(queries)
               .sort(sorting)
               .skip((page - 1) * limit)
               .limit(limit);
          const totalCount = products?.length;
          res.status(200).json({ data: products, totalCount });
     } catch (err) {
          console.log(err);
          res.status(404).send({
               msg: "something wrong while getting products",
          });
     }
});

ProductRouter.get("/singleProduct/:id", async (req, res) => {
     const { id } = req.params;
     try {
          const data = await ProductModel.findById({ _id: id });
          res.status(200).json({ data });
     } catch (err) {
          console.log(err);
          res.status(404).send({
               msg: "something wrong while getting products",
          });
     }
});

ProductRouter.patch("/update/:id", checkRole, async (req, res) => {
     const { id } = req.params;
     const payload = req.body;
     try {
          await ProductModel.findByIdAndUpdate({ _id: id }, payload, {
               new: true,
               runValidators: true,
               useFindAndModify: false,
          });
          //  res.send(`post upadted with the id ${id}`);
          res.status(200).send({ msg: "Updated SUCCESSFULLY" });
     } catch (err) {
          console.log(err);
          res.status(404).send({ msg: "FAILED TO UPDATE THE DATA" });
     }
});

ProductRouter.delete("/delete/:id",checkRole, async(req,res)=>{
    const {id}=req.params
    const payload=req.body
    try{
        await ProductModel.findByIdAndDelete({_id:id})
        res.send(`product deleted with the id ${id}`)
    }
    catch(err){
        console.log(err);

        res.send("something wrong while updating your product")
    }

})

ProductRouter.put("/createProductReviwe/:id", async(req,res)=>{
    const {id}=req.params
    const {rating, comment, productId, user_id, username}=req.body
    const review ={
        user:user_id,
        name:username,
        rating:Number(rating),
        comment,
    }
    
    try{
        const product =await ProductModel.findById(productId)

        const isReviewed=product.reviews.find(el=>el.user.toString()===user_id.toString())
        if(isReviewed){
           product.reviews.forEach(el => {
            if(el.user.toString()===user_id.toString()){
                (el.rating=rating),
                (el.comment=comment)
            }
           });
        }else{
            product.reviews.push(review)
            product.ratingCount=product.reviews.length
        }

        let avg=0;
        product.reviews.forEach(rev=>{
            avg+=rev.rating
        })
        product.rating=avg/product.reviews.length

        await product.save({validateBeforeSave:false})
        res.send(`Thank you for your Valuble Feedback`)
    }
    catch(err){
        console.log(err);

        res.send("something wrong while adding your reviwe")
    }

})


ProductRouter.get("productReviews/:id", async (req, res) => {
    const { id } = req.params;
    try {
         const product = await ProductModel.findById({ _id: id });

         if(!product){
            res.send({"msg":"Error while getting the reviews"})
         }
         res.send({reviews:product.reviews})
    } catch (err) {
         console.log(err);
         res.send({
              msg: "something wrong while getting products",
         });
    }
});



const addBulkDataManually = async () => {
     try {
          await ProductModel.insertMany(products);
          console.log("Bulk Data Uploaded SUCCESSFULLY");
     } catch (error) {
          console.log(error, "FAILED TO Upload Bulk Data");
     }
};

module.exports = { ProductRouter, addBulkDataManually};


