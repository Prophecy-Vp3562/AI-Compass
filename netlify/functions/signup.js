require('dotenv').config();

const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
const authRoutes = require('../../backend/src/routes/authRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    if (req.method === 'POST' && (req.url === '/' || req.url.endsWith('/signup'))) {
        req.url = '/signup';
    }
    next();
});

app.use('/', authRoutes);

module.exports.handler = serverless(app);
