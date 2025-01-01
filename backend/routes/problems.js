const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Load JSON file
const loadProblems = () => {
  try {
    const problemsPath = path.join(__dirname, '..', 'problems.json');
    const problemsData = fs.readFileSync(problemsPath, 'utf8');
    return JSON.parse(problemsData);
  } catch (error) {
    console.error('Error loading problems:', error);
    return [];
  }
};

const problems = loadProblems();

router.get('/', (req, res) => {
  try {
    res.json(problems);
  } catch (error) {
    console.error('Error serving problems:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  try {
    const problem = problems.find((p) => p.id === id);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }
    res.json(problem);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;