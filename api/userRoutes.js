const express = require('express');
const { createUser, loginUser, updatePassword, getUserById } = require('../controllers/userController');
const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUser);
router.put('/update-password', updatePassword);
router.get('/:userId', getUserById);

module.exports = router;
