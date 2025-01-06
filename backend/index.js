const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
require('dotenv').config();

// Initialize Firebase Admin SDK
const serviceAccount = require('./leetcode-1bdec-firebase-adminsdk-orb1s-be580fc140.js');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
//console.log(serviceAccount);
const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://ninja-code-frontend.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

const problemsRoutes = require('./routes/problems');
const submissionsRoutes = require('./routes/submissions');
const runCodeRouter = require('./routes/run-code');

app.use('/api/problems', problemsRoutes);
app.use('/api/submit', submissionsRoutes);
app.use(runCodeRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

const PORT = process.env.PORT || 8000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;