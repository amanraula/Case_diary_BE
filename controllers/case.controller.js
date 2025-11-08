const asyncHandler = require('express-async-handler');
const Case = require('../models/case.model');
const Officer = require('../models/officer.model');

// Create new case
exports.createCase = asyncHandler(async (req, res) => {
  const { caseNum, description, stationReported, status } = req.body;
  const officer = req.officer;

  // 🧠 1️⃣ Basic validation
  if (!caseNum || !description) {
    res.status(400);
    throw new Error("caseNum and description are required");
  }

  // 🧠 2️⃣ Check for duplicates
  const exists = await Case.findOne({ caseNum });
  if (exists) {
    res.status(400);
    throw new Error("caseNum already exists");
  }

  // 🧠 3️⃣ Auto-fill from officer if missing
  const caseData = {
    caseNum,
    description,
    stationReported: stationReported || officer.station || "Unknown Station",
    status: status || "pending",
    reportedByBadge: officer.badgeNumber || "N/A",
    reportedByRank: officer.rank || "N/A",
    reportedById: officer._id || null,
  };

  // 🧠 4️⃣ Create & save
  const newCase = await Case.create(caseData);

  res.status(201).json({
    message: "Case created successfully",
    case: newCase,
  });
});
// PATCH /api/cases/:caseNum
exports.updateCaseStatus = async (req, res) => {
  try {
    const caseNum = decodeURIComponent(req.params.caseNum); // important if slashes encoded
    const { status } = req.body;

    if (!['pending', 'completed', 'aborted'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const c = await Case.findOne({ caseNum }); // ✅ instead of findById
    if (!c) {
      return res.status(404).json({ message: 'Case not found' });
    }

    c.status = status;
    c.updates.push({
      dateTime: new Date(),
      description: `Status changed to ${status}`,
      updatedBy: req.officer?.badgeNumber || 'system',
    });

    await c.save();

    return res.status(200).json({
      message: `Status updated to ${status}`,
      case: c,
    });
  } catch (err) {
    console.error('Error updating case status:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// List cases (rank-based visibility)
exports.listCases = asyncHandler(async (req, res) => {
  const officer = req.officer;
  const myRankLevel = officer.rankLevel;
  const myStation = officer.station;

  // ✅ Officers of lower or equal rank
  const allowedOfficers = await Officer.find({
    rankLevel: { $gte: myRankLevel },
    station: myStation
  }).select("_id");

  const officerIds = allowedOfficers.map(o => o._id);

  // ✅ Only cases from same station and filed by allowed officers
  const cases = await Case.find({
    stationReported: myStation,
    reportedById: { $in: officerIds },
  })
    .sort({ lastUpdateDate: -1 })
    .lean();

  res.json({
    success: true,
    total: cases.length,
    data: cases,
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
  const officer = req.officer;

  // 1️⃣ Find the reference case
  const refCase = await Case.findOne({ caseNum });
  if (!refCase) {
    res.status(404);
    throw new Error('Case not found');
  }

  // 2️⃣ Extract basic keywords
  const keywords = refCase.description
    .toLowerCase()
    .split(/\W+/)
    .filter(word => word.length > 3);

  // 3️⃣ Fetch potentially similar cases
  const similarCases = await Case.find({
    _id: { $ne: refCase._id },
    $or: [
      { stationReported: refCase.stationReported },
      { description: { $regex: keywords.join('|'), $options: 'i' } }
    ]
  });

  // 4️⃣ Apply visibility rules
  const publicCases = similarCases.filter(c => c.status === 'completed');
  const privateCases = similarCases.filter(
    c => c.status === 'pending' && c.stationReported === officer.station
  );

  // 5️⃣ Combine & return neatly
  res.json({
    reference: {
      caseNum: refCase.caseNum,
      description: refCase.description,
      stationReported: refCase.stationReported,
      status: refCase.status,
    },
    recommendations: {
      public: publicCases.slice(0, 10),
      private: privateCases.slice(0, 10),
    },
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
