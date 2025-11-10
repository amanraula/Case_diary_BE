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
  reportedById: { type: mongoose.Schema.Types.ObjectId, ref: 'Officer' },

  // updates log
  updates: [
    {
      dateTime: { type: Date, default: Date.now },
      description: { type: String, required: true },
      updatedBy: { type: String, required: true }
    }
  ],

  // files metadata
  files: [
    {
      filename: { type: String, required: true },        // stored name on disk
      originalName: { type: String, required: true },    // uploaded original name
      mimetype: String,
      size: Number,
      uploadedBy: String,   // officer badgeOrName
      uploadedAt: { type: Date, default: Date.now }
    }
  ]

}, { timestamps: true });

CaseSchema.pre('save', function(next) {
  if (this.isModified('status') || this.isModified('description')) {
    this.lastUpdateDate = Date.now();
  }
  next();
});

module.exports = mongoose.model('Case', CaseSchema);
