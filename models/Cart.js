// models/Cart.js
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    count: { type: Number, required: true },
    price: { type: Number, required: true },
  }],
  totalCost: { type: Number, default: 0 },
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
