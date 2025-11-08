const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const Officer = require('../models/officer.model');

exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, token missing');
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const officer = await Officer.findById(decoded.id).select('-password');
    if (!officer) {
      res.status(401);
      throw new Error('Not authorized');
    }
    req.officer = officer;
    next();
  } catch (err) {
    res.status(401);
    throw new Error('Token invalid or expired');
  }
});
