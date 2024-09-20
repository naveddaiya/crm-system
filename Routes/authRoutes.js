const express = require('express');

const { registerUser, loginUser ,resetPassword, logoutUser, verifyOtpAndResetPassword, forgotPassword, checkUser} = require('../Controller/authController');
const { protect } = require('../Middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/checkUser', checkUser);
router.post('/reset', resetPassword);
router.post('/verify-otp', verifyOtpAndResetPassword);
router.post('/forgot-password', forgotPassword);

module.exports = router;
