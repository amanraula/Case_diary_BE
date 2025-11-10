const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware'); // ✅ this exports multer
const {
  createCase,
  getCase,
  updateCase,
  deleteCase,
  listCases,
  getCaseFiles,
  listRecommendations,
  addCaseUpdate,
  uploadFilesHandler,   // ✅ import it properly
  deleteCaseFile,
  updateCaseStatus
} = require('../controllers/case.controller');

// all routes below require auth
router.use(protect);

// Create case
router.post('/', createCase);

// List cases
router.get('/', listCases);

// Upload files to existing case
router.post('/:caseNum/upload', upload.array('files'), uploadFilesHandler);

// Delete file from case
// router.delete('/:caseNum/files/:filename', deleteCaseFile);
router.delete('/:caseNum/files/:fileId', deleteCaseFile);


// Add update
router.post('/:id/updates', addCaseUpdate);

// Recommend
router.get('/recommend/:caseNum', listRecommendations);

// Update status
router.patch('/:caseNum', updateCaseStatus);
router.get('/:caseNum/files', getCaseFiles);

// Get, edit, delete case
router.route('/:id')
  .get(getCase)
  .patch(updateCase)
  .delete(deleteCase);

module.exports = router;
