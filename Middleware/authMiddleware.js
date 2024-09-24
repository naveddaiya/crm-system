const jwt = require('jsonwebtoken');
const User = require('../Models/User');

const protect = async (req, res, next) => {
  let token = req.cookies.jwt
  console.log(token)

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if(!decoded){
        res.status(401).json({ message: 'Not authorized, token failed' });
      }
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (err) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

module.exports = { protect };
