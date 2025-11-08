const express = require('express');
const router = express.Router();
const {
  createCase,
  getCase,
  updateCase,
  deleteCase,
  listCases,
  listRecommendations,   // 👈 new
  addCaseUpdate  // ✅ new
} = require('../controllers/case.controller');


const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.route('/')
  .get(listCases)
  .post(createCase);
  
router.get('/recommend/:caseNum', listRecommendations);
router.post('/:id/updates', addCaseUpdate);

router.route('/:id')
  .get(getCase)
  .patch(updateCase)
  .delete(deleteCase);

module.exports = router;
