const express = require('express');

const { registerUser, loginUser ,resetPassword, logoutUser, verifyOtpAndResetPassword, forgotPassword, checkUser, getUser} = require('../Controller/authController');
const { protect } = require('../Middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/checkUser', checkUser);
router.post('/reset', resetPassword);
router.post('/verify-otp', verifyOtpAndResetPassword);
router.post('/forgot-password', forgotPassword);
router.get('/getuser',protect, getUser);

module.exports = router;
