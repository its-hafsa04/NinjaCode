const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');

// Initialize Firebase Admin SDK
const serviceAccount = require('../leetcode-1bdec-firebase-adminsdk-orb1s-be580fc140.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
app.use(cors(
  {
    origin: [process.env.FRONTEND_URL ||'https://ninja-code-frontend.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}
));
app.use(express.json());

const problemsRoutes = require('./routes/problems');
const submissionsRoutes = require('./routes/submissions');
const runCodeRouter = require('./routes/run-code');
app.use(runCodeRouter);

app.use('/api/problems', problemsRoutes);
app.use('/api/submit', submissionsRoutes);

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: ".env",
  });
}

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});