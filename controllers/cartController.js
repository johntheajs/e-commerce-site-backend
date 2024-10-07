const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Add a product to the cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, count } = req.body;
    const userId = req.user;

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
  const userId = req.user;

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

// Update the cart product count based on conditions
exports.updateCart = async (req, res) => {
  try {
    const { productId, count } = req.body;
    const userId = req.user;

    // Find the cart for the user
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    // Find the product in the user's cart
    const productInCart = cart.products.find(p => p.productId.equals(productId));

    if (!productInCart) {
      return res.status(404).json({ error: 'Product not found in the cart' });
    }

    // If the product count in the cart is greater than the new count, reduce it
    if (productInCart.count > count) {
      productInCart.count = count;
      cart.totalCost = cart.products.reduce((total, item) => total + (item.count * item.price), 0);
      await cart.save();
      return res.json(cart);
    }

    // If the product count in the cart is less than the new count, return an error
    if (productInCart.count < count) {
      return res.status(400).json({ error: 'Cannot update. Count exceeds existing product count in cart.' });
    }

    // If the product count equals the new count, remove the product by calling the delete function
    if (productInCart.count === count) {
      await this.deleteProductFromCart(req, res);
    }

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a product from the cart
exports.deleteProductFromCart = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user;

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
