const express = require('express');
const { registerUser, loginUser ,resetPassword} = require('../Controller/authController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/reset', resetPassword);

module.exports = router;
