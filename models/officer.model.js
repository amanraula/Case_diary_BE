const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Rank hierarchy (lower number = higher rank)
const rankHierarchy = {
  DGP: 1,
  ADGP: 2,
  IGP: 3,
  DIGP: 4,
  SSP: 5,
  SP: 6,
  ADDLSP: 7,
  INSPECTOR: 8,
  SUBINSPECTOR: 9,
  CONSTABLE: 10
};

const OfficerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  badgeNumber: { type: String, required: true, unique: true },
  station: { type: String, required: true },
  rank: {
    type: String,
    required: true,
    enum: Object.keys(rankHierarchy)
  },
  rankLevel: { type: Number, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'officer' },

  // ✅ 2FA fields for Google Authenticator
  twoFactorSecret: { type: String },
  is2FAEnabled: { type: Boolean, default: false }

}, { timestamps: true });

// 🔐 Hash password before save
OfficerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🧠 Automatically assign rank level
OfficerSchema.pre('validate', function(next) {
  if (this.rank) {
    this.rankLevel = rankHierarchy[this.rank];
  }
  next();
});

// 🔍 Compare password during login
OfficerSchema.methods.comparePassword = function(plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model('Officer', OfficerSchema);
