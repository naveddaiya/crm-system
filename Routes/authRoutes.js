const express = require('express');

const { registerUser, loginUser ,resetPassword} = require('../Controller/authController');
const { protect } = require('../Middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/reset', resetPassword);

module.exports = router;
