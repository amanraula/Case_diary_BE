const express = require("express");
const router = express.Router();
const { generate2FA, verify2FA } = require("../controllers/2fa.controller");
const { protect } = require("../middleware/auth.middleware");

// Protected — officer must be logged in first
router.post("/generate", protect, generate2FA);
router.post("/verify", protect, verify2FA);

module.exports = router;
