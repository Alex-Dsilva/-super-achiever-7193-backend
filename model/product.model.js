const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
     isOffer: {
          type: Boolean,
     },
     newProduct: {
          type: Boolean,
     },
     productname: {
          type: String,
          required: [true, "Please enter product name"],
          trim: true,
     },
     productBrand: {
          type: String,
          required: [true, "Please enter Brand name"],
          trim: true,
     },
     description: {
          type: String,
          required: [true, "please enter product description"],
     },
     price: {
          type: Number,
          required: [true, "Please enter product"],
          maxlength: [7, "Price cannot exceed 7 characters"],
     },
     rating: { type: Number, default: 0 },
     images: [
          {
               url: { type: String, required: true },
          },
     ],
     productCategory: {
          type: String,
          required: [true, "Please enter product Category"],
     },
     stock: {
          type: Number,
          required: [true, "Please enter product Stock"],
          maxlength: [7, "Price cannot exceed 7 characters"],
          default: 1,
     },
     ratingCount: { type: Number, default: 0 },
     discountPercent: { type: Number, default: 20 },
     reviews: [
          {
               name: {
                    type: String,
                    required: true,
               },
               rating: {
                    type: String,
                    required: true,
               },
               comment: {
                    type: String,
                    required: true,
               },
          },
     ],
     createdAt: { type: Date, default: Date.now },
});

const ProductModel = mongoose.model("Product", ProductSchema);

module.exports = { ProductModel };
