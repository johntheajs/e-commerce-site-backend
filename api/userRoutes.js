const express = require('express');
const { createUser, loginUser, updatePassword, getUserById } = require('../controllers/userController');
const router = express.Router();
const auth = require('../middleware/auth'); // Import the middleware


router.post('/register', createUser);
router.post('/login', loginUser);
router.put('/update-password', auth , updatePassword);
router.get('/', auth , getUserById);

module.exports = router;
