const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const auth = (req, res, next) => {
  try {
    // Get token from Authorization header
    const token = req.header('Authorization');

    // Log the token for debugging
    // console.log(token);

    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    // Extract the actual token (after "Bearer ")
    const tokenPart = token.split(' ')[1];

    // Verify the token
    const verified = jwt.verify(tokenPart, process.env.JWT_SECRET);
    
    // Attach user info (like user id) to the request object
    req.user = verified.id;

    // Continue to the next middleware
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;
