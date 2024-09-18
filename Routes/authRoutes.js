const express = require('express');

const { registerUser, loginUser ,resetPassword, logoutUser} = require('../Controller/authController');
const { protect } = require('../Middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.put('/reset', resetPassword);

module.exports = router;
