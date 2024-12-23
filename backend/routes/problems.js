const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Load JSON file
const loadProblems = () => {
  try {
    const problemsPath = path.join(__dirname, '../problems.json');
    const problemsData = JSON.parse(fs.readFileSync(problemsPath, 'utf8'));
    return problemsData;
  } catch (error) {
    console.error('Error loading problems:', error);
    return [];
  }
};

const PROBLEMS = loadProblems();

router.get('/', (req, res) => {
  try {
    res.json(PROBLEMS);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  try {
    const problem = PROBLEMS.find((p) => p.id === id);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }
    res.json(problem);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;