const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  officerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Officer', required: true },
  title: { type: String, required: true },
  date: { type: Date, required: true },
  privacy: { type: String, enum: ['private', 'public'], default: 'private' },
}, { timestamps: true });

module.exports = mongoose.model('Schedule', scheduleSchema);
