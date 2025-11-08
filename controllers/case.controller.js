const asyncHandler = require('express-async-handler');
const Case = require('../models/case.model');
const Officer = require('../models/officer.model');

// Create new case
exports.createCase = asyncHandler(async (req, res) => {
  const { caseNum, description, stationReported, status } = req.body;
  if (!caseNum || !description || !stationReported) {
    res.status(400);
    throw new Error('caseNum, description, and stationReported are required');
  }

  const exists = await Case.findOne({ caseNum:id });
  if (exists) {
    res.status(400);
    throw new Error('caseNum already exists');
  }

  const officer = req.officer;
  const c = await Case.create({
    caseNum,
    description,
    stationReported,
    status,
    reportedByBadge: officer.badgeNumber,
    reportedByRank: officer.rank,
    reportedById: officer._id
  });

  res.status(201).json(c);
});

// List cases (rank-based visibility)
exports.listCases = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const officer = req.officer;
  const myRankLevel = officer.rankLevel;

  // officers with lower or equal rankLevel
  const lowerRankOfficers = await Officer.find({
    rankLevel: { $gte: myRankLevel }
  }).select('_id');

  const ids = lowerRankOfficers.map(o => o._id);
  const query = { reportedById: { $in: ids } };

  const skip = (Math.max(1, parseInt(page)) - 1) * Math.max(1, parseInt(limit));
  const [cases, total] = await Promise.all([
    Case.find(query).sort({ lastUpdateDate: -1 }).skip(skip).limit(parseInt(limit)),
    Case.countDocuments(query)
  ]);

  res.json({
    meta: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) },
    data: cases
  });
});

// Get single case
exports.getCase = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // find case by caseNum (case-insensitive)
  const c = await Case.findOne({ caseNum: new RegExp(`^${id}$`, 'i') });
  if (!c) {
    res.status(404);
    throw new Error('Case not found');
  }

  res.status(200).json(c);
});


// Update case
exports.updateCase = asyncHandler(async (req, res) => {
  const c = await Case.findById(req.params.id);
  if (!c) {
    res.status(404);
    throw new Error('Case not found');
  }

  const allowed = ['description', 'status', 'stationReported'];
  allowed.forEach(key => {
    if (req.body[key] !== undefined) c[key] = req.body[key];
  });

  await c.save();
  res.json(c);
});

// Delete case
exports.deleteCase = asyncHandler(async (req, res) => {
  const c = await Case.findById(req.params.id);
  if (!c) {
    res.status(404);
    throw new Error('Case not found');
  }

  await c.deleteOne();
  res.json({ message: 'Case deleted' });
});



// 🔍 Recommendation System: find similar cases
exports.listRecommendations = asyncHandler(async (req, res) => {
  const { caseNum } = req.params;

  // 1️⃣ find the reference case
  const refCase = await Case.findOne({ caseNum });
  if (!refCase) {
    res.status(404);
    throw new Error('Case not found');
  }

  // 2️⃣ basic keyword extraction from description
  const keywords = refCase.description
    .toLowerCase()
    .split(/\W+/)
    .filter(word => word.length > 3);

  // 3️⃣ search for cases that have similar words or same station
  const similarCases = await Case.find({
    _id: { $ne: refCase._id },
    $or: [
      { stationReported: refCase.stationReported },
      { description: { $regex: keywords.join('|'), $options: 'i' } }
    ]
  });

  // 4️⃣ separate solved vs pending
  const solved = similarCases.filter(c => c.status === 'completed');
  const pending = similarCases.filter(c => c.status === 'pending');

  // 5️⃣ prepare output
  res.json({
    case: {
      caseNum: refCase.caseNum,
      description: refCase.description,
      stationReported: refCase.stationReported,
      status: refCase.status
    },
    recommendations: {
      solved: solved.slice(0, 5),   // limit to top 5
      pending: pending.slice(0, 5)
    }
  });
});
// 🧾 Add update entry to a case
exports.addCaseUpdate = asyncHandler(async (req, res) => {
  const { id } = req.params; // case ID
  const { description } = req.body;

  if (!description) {
    res.status(400);
    throw new Error('Update description is required');
  }

  const officer = req.officer;
  const c = await Case.findOne({ caseNum: id });
if (!c) {
  res.status(404);
  throw new Error('Case not found');
}


  // Add new update entry
  const newUpdate = {
    dateTime: new Date(),
    description,
    updatedBy: officer.badgeNumber
  };

  c.updates.push(newUpdate);
  c.lastUpdateDate = new Date();
  await c.save();

  res.status(201).json({
    message: 'Update added successfully',
    updates: c.updates
  });
});
