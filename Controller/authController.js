const jwt = require('jsonwebtoken');
const User = require('../Models/User');

const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

// Generate JWT token
const generateToken = (id,res) => {
  console.log("id",id);
  const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.cookie("jwt",token)
  console.log("token " + token)
  // return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });

};

// Register a new user
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password });
    if(!user){
      return res.status(401).json({message:"Error in User Creation"})
    }
    generateToken(user._id,res) 
    res.status(201).json({user});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log("req.body in login ",req.body)
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    generateToken(user._id,res)
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
//check User exist in database
exports.checkUser = async (req, res) => {
  const { email } = req.body;
  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // If user is found, respond with a success message
    res.json({ message: 'User found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Validate old password
    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Old password is incorrect' });
    }

    // Update to the new password
    user.password = newPassword; // This will be hashed before saving due to the pre-save hook
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.logoutUser = (req, res) => {

  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),  // Set the expiry date in the past to delete the cookie
    sameSite: 'strict',
  });

  res.status(200).json({ message: 'Logged out successfully'});
};

//reset password
// Verify OTP and Reset Password
exports.verifyOtpAndResetPassword = async (req, res) => {
  const {email, otp} = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if OTP is valid
    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Update password
    // user.password = newPassword;
    user.otp = undefined;  // Clear OTP after successful reset
    user.otpExpiry = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//forgot password
// Forgot Password Route
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

    // Store OTP and expiry in the database
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send OTP to user's email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: user.email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}. It will expire in 10 minutes.`
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.log("error hun me" + error)
    res.status(500).json({ message: error.message });
  }
};

