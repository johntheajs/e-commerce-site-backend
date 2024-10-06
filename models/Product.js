// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  img: { type: String, required: true },
  title: { type: String, required: true },
  reviews: { type: String, required: true },
  prevPrice: { type: String, required: true },
  newPrice: { type: Number, required: true },
  company: { type: String, required: true },
  color: { type: String, required: true },
  category: { type: String, required: true },
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
