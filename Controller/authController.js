const jwt = require('jsonwebtoken');
const User = require('../Models/User');

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
exports.resetPassword = async (req,res) =>{
  const {email,password} = req.body

  try {
    //find user by email
    const user = await User.findOne({ email });

    if(!user){
      return res.status(401).json({ message: 'User not found' });
    }
    user.password = password
    await user.save()

    // res.json({user});

    // Optionally, you can generate a new JWT token or just send a success response
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
