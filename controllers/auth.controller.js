const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const Officer = require('../models/officer.model');

// helper: generate token
const generateToken = (officer) => {
  return jwt.sign(
    { id: officer._id, badgeNumber: officer.badgeNumber, role: officer.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRY || '7d' }
  );
};

// ✅ Register officer
exports.register = asyncHandler(async (req, res) => {
  const { name, badgeNumber, station, rank, password } = req.body;

  if (!name || !badgeNumber || !station || !rank || !password) {
    res.status(400);
    throw new Error('Missing fields');
  }

  const exists = await Officer.findOne({ badgeNumber });
  if (exists) {
    res.status(400);
    throw new Error('Badge number already registered');
  }

  const officer = await Officer.create({ name, badgeNumber, station, rank, password });

  res.status(201).json({
    id: officer._id,
    name: officer.name,
    badgeNumber: officer.badgeNumber,
    station: officer.station,
    rank: officer.rank,
    token: generateToken(officer)
  });
});

// ✅ Login officer
exports.login = asyncHandler(async (req, res) => {
  const { badgeNumber, password } = req.body;
  if (!badgeNumber || !password) {
    res.status(400);
    throw new Error('Missing credentials');
  }

  const officer = await Officer.findOne({ badgeNumber });
  if (!officer) {
    res.status(401);
    throw new Error('Invalid badge number or password');
  }

  const matched = await officer.comparePassword(password);
  if (!matched) {
    res.status(401);
    throw new Error('Invalid badge number or password');
  }

  res.json({
    id: officer._id,
    name: officer.name,
    badgeNumber: officer.badgeNumber,
    station: officer.station,
    rank: officer.rank,
    token: generateToken(officer)
  });
});
