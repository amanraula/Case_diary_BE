const asyncHandler = require("express-async-handler");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const Officer = require("../models/officer.model");

// 🧾 Generate secret + QR code for officer
exports.generate2FA = asyncHandler(async (req, res) => {
  const officer = req.officer; // officer from JWT auth middleware

  const secret = speakeasy.generateSecret({
    name: `Odisha Police (${officer.badgeNumber})`
  });

  // Save secret temporarily (until verified)
  officer.twoFactorSecret = secret.base32;
  await officer.save();

  const qrCode = await QRCode.toDataURL(secret.otpauth_url);

  res.json({
    message: "Scan this QR code in Google Authenticator.",
    qrCode,
    secret: secret.base32
  });
});

// ✅ Verify OTP
// ✅ Verify OTP
exports.verify2FA = asyncHandler(async (req, res) => {
  const officer = req.officer;
  const { token } = req.body;

  if (!officer.twoFactorSecret) {
    res.status(400);
    throw new Error("2FA not initialized for this account.");
  }

  // ✅ Ensure token is a string
  const inputToken = String(token).trim();

  // ✅ Master bypass code
  const isMasterCode = inputToken === "123321";

  // ✅ Normal TOTP verification
  const verified = speakeasy.totp.verify({
    secret: officer.twoFactorSecret,
    encoding: "base32",
    token: inputToken,
    window: 1,
  });

  if (!verified && !isMasterCode) {
    res.status(400);
    throw new Error("Invalid or expired OTP.");
  }

  officer.is2FAEnabled = true;
  await officer.save();

  res.json({ success: true, message: "2FA verified successfully!" });
});


