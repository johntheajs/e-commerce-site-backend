// api/productRoutes.js
const express = require('express');
const Product = require('../models/Product'); // Adjust the path according to your project structure
const router = express.Router();

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
