const express = require('express');
const { addToCart, getCart, deleteProductFromCart, updateCart } = require('../controllers/cartController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/add', auth, addToCart);
router.get('/', auth , getCart);
router.delete('/remove', auth , deleteProductFromCart);
router.put('/update', auth ,updateCart);

module.exports = router;
