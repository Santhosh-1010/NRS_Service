const express = require('express');
const jwt = require('jsonwebtoken');
const { ApiError } = require('../middleware/errorHandler');
const { JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// Demo-only hardcoded credentials. Not for production use.
const DEMO_USER = { username: 'admin', password: 'password123' };

router.post('/login', (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(new ApiError(400, 'Username and password are required'));
  }

  if (username !== DEMO_USER.username || password !== DEMO_USER.password) {
    return next(new ApiError(401, 'Invalid username or password'));
  }

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '2h' });
  res.json({ token, username });
});

router.all('/login', (req, res, next) => next(new ApiError(405, `Method ${req.method} not allowed on /api/auth/login`)));

module.exports = router;
