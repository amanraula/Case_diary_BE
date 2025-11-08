const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const speakeasy = require("speakeasy");
const Officer = require("../models/officer.model");

// ✅ helper: generate JWT
const generateToken = (officer) => {
  return jwt.sign(
    { id: officer._id, badgeNumber: officer.badgeNumber, role: officer.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRY || "7d" }
  );
};

// ✅ Register officer
exports.register = asyncHandler(async (req, res) => {
  const { name, badgeNumber, station, rank, password } = req.body;

  if (!name || !badgeNumber || !station || !rank || !password) {
    res.status(400);
    throw new Error("Missing required fields");
  }

  const exists = await Officer.findOne({ badgeNumber });
  if (exists) {
    res.status(400);
    throw new Error("Badge number already registered");
  }

  const officer = await Officer.create({
    name,
    badgeNumber,
    station,
    rank,
    password,
  });

  res.status(201).json({
    success: true,
    message: "Officer registered successfully",
    officer: {
      id: officer._id,
      name: officer.name,
      badgeNumber: officer.badgeNumber,
      station: officer.station,
      rank: officer.rank,
      is2FAEnabled: officer.is2FAEnabled,
    },
    token: generateToken(officer),
  });
});

// ✅ Login officer (with 2FA check)
exports.login = asyncHandler(async (req, res) => {
  const { badgeNumber, password, token } = req.body;

  if (!badgeNumber || !password) {
    res.status(400);
    throw new Error("Missing credentials");
  }

  // 1️⃣ Find officer
  const officer = await Officer.findOne({ badgeNumber });
  if (!officer) {
    res.status(401);
    throw new Error("Invalid badge number or password");
  }

  // 2️⃣ Compare password
  const matched = await officer.comparePassword(password);
  if (!matched) {
    res.status(401);
    throw new Error("Invalid badge number or password");
  }

  // 3️⃣ If 2FA enabled, verify TOTP token
  if (officer.is2FAEnabled) {
    if (!token) {
      return res.status(403).json({
        success: false,
        message: "Enter your 2FA OTP code from Google Authenticator",
      });
    }

    const verified = speakeasy.totp.verify({
      secret: officer.twoFactorSecret,
      encoding: "base32",
      token,
      window: 1, // small clock drift allowance
    });

    if (!verified) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired 2FA code",
      });
    }
  }

  // 4️⃣ Generate JWT after 2FA success
  const jwtToken = generateToken(officer);

  res.json({
    success: true,
    token: jwtToken,
    officer: {
      id: officer._id,
      name: officer.name,
      badgeNumber: officer.badgeNumber,
      rank: officer.rank,
      station: officer.station,
      is2FAEnabled: officer.is2FAEnabled,
    },
  });
});
