const express = require('express');
const path = require('path');
const fs = require('fs');
const CodeValidator = require('../validation/codeValidator');

const router = express.Router();

router.post('/api/run', async (req, res) => {
  const { userId, problemId, code, language } = req.body;

  try {
    if (!code || !problemId) {
      return res.status(400).json({
        success: false,
        message: 'Code and problemId are required'
      });
    }

    // Load JSON
    const problemsPath = path.join(__dirname, '../problems.json');
    const PROBLEMS = JSON.parse(fs.readFileSync(problemsPath, 'utf8'));

    const problem = PROBLEMS.find((p) => p.id === problemId);
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    const validationResult = CodeValidator.validate(problem, code, language);

    const response = {
      allPassed: validationResult.allPassed,
      results: validationResult.results.map(result => ({
        input: result.input,
        expectedOutput: result.expectedOutput,
        actualOutput: result.actualOutput,
        passed: result.passed,
        error: result.error,
        explanation: result.explanation
      })),
      passedCount: validationResult.passedCount,
      totalCount: validationResult.totalCount,
      message: validationResult.allPassed
        ? 'All test cases passed! You can submit your solution.'
        : `${validationResult.passedCount}/${validationResult.totalCount} test cases passed. Keep trying!`
    };

    res.json(response);

  } catch (error) {
    console.error('Run code error:', error);
    res.status(500).json({
      success: false,
      message: 'Error executing code: ' + error.message
    });
  }
});

// Error handling
router.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

module.exports = router;