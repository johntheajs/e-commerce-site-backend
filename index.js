const express = require('express');
const cors = require('cors');
const connectDB = require('./db/config');
const userRoutes = require('./api/userRoutes');
const cartRoutes = require('./api/cartRoutes');
const productRoutes = require('./api/productRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// Routes
app.use('/api/user', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/product', productRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
