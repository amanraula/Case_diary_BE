const mongoose = require('mongoose');

const CaseSchema = new mongoose.Schema({
  caseNum: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  stationReported: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'aborted', 'completed'],
    default: 'pending'
  },
  lastUpdateDate: { type: Date, default: Date.now },
  reportedByBadge: { type: String },
  reportedByRank: { type: String },
  reportedById: { type: mongoose.Schema.Types.ObjectId, ref: 'Officer' }
}, { timestamps: true });

CaseSchema.pre('save', function(next) {
  if (this.isModified('status') || this.isModified('description')) {
    this.lastUpdateDate = Date.now();
  }
  next();
});

module.exports = mongoose.model('Case', CaseSchema);
