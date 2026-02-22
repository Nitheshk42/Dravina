require('dotenv').config();
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  try {
    // 1. Get token from request header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token! Please login first.' });
    }

    // 2. Extract the token
    const token = authHeader.split(' ')[1];

    // 3. Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach user info to request
    req.user = decoded;

    // 5. Move to next function
    next();

  } catch (error) {
    res.status(401).json({ message: 'Invalid token! Please login again.' });
  }
};

module.exports = { protect };