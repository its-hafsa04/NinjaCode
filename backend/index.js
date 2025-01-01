const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');

// Initialize Firebase Admin SDK
let serviceAccount;
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  serviceAccount = require('../leetcode-1bdec-firebase-adminsdk-orb1s-be580fc140.json');
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

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