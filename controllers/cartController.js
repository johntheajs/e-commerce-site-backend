const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Add a product to the cart
exports.addToCart = async (req, res) => {
  try {
    const { userId, productId, count } = req.body;

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Find the user's cart
    const cart = await Cart.findOne({ userId });

    // If cart doesn't exist, create a new one
    if (!cart) {
      const newCart = new Cart({
        userId,
        products: [{ productId, count, price: product.newPrice }],
        totalCost: count * product.newPrice,
      });
      await newCart.save();
      return res.json(newCart);
    }

    // Check if the product is already in the cart
    const existingProduct = cart.products.find(p => p.productId.equals(productId));
    if (existingProduct) {
      // Update count and total cost if the product already exists in the cart
      existingProduct.count += count;
    } else {
      // Add the new product to the cart
      cart.products.push({ productId, count, price: product.newPrice });
    }

    // Update the total cost
    cart.totalCost += count * product.newPrice;
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get the cart for a user
exports.getCart = async (req, res) => {
  const { userId } = req.params;

  try {
    // Populate the product details in the cart response
    const cart = await Cart.findOne({ userId }).populate('products.productId');
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    res.json(cart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update the cart (not implemented)
exports.updateCart = async (req, res) => {
  // Logic to update product count, remove product, etc.
  // Implement according to your requirements
};

// Delete a product from the cart
exports.deleteProductFromCart = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    // Filter out the product to delete
    cart.products = cart.products.filter(p => !p.productId.equals(productId));

    // Recalculate total cost after deletion
    cart.totalCost = cart.products.reduce((total, item) => total + (item.price * item.count), 0);
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
