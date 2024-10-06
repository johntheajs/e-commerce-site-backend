const express = require('express');
const { addToCart, getCart, deleteProductFromCart } = require('../controllers/cartController');
const router = express.Router();

router.post('/add', addToCart);
router.get('/:userId', getCart);
router.delete('/remove', deleteProductFromCart);

module.exports = router;
