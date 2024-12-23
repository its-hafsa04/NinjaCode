const express = require('express');
const admin = require('firebase-admin');
const CodeValidator = require('../validation/codeValidator');
const path = require('path');
const fs = require('fs'); 

const router = express.Router();
const db = admin.firestore();

router.post('/', async (req, res) => {
  const { userId, problemId, code, language } = req.body;

  try {
    // Load problems from JSON
    const problemsPath = path.join(__dirname, '../problems.json');
    const PROBLEMS = JSON.parse(fs.readFileSync(problemsPath, 'utf8'));

    const problem = PROBLEMS.find((p) => p.id === problemId);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    const validationResult = CodeValidator.validate(problem, code, language);

    const submissionData = {
      code,
      language,
      validationResult,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    };

    // Store in Firestore
    if (validationResult.allPassed) {
      await db
        .collection('users')
        .doc(userId)
        .collection('submissions')
        .doc(problemId)
        .set(submissionData);
    }

    res.json({
      correct: validationResult.allPassed,
      results: validationResult.results,
      passedCount: validationResult.passedCount,
      totalCount: validationResult.totalCount,
      message: validationResult.allPassed
        ? 'Congratulations! All test cases passed.'
        : 'Some test cases failed. Keep trying!',
    });
  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({
      error: 'Server error',
      message: error.message,
    });
  }
});

module.exports = router;