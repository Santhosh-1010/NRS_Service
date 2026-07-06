const jwt = require('jsonwebtoken');
const { ApiError } = require('./errorHandler');

const JWT_SECRET = process.env.JWT_SECRET ||'nrs-jwt-auth-secret-';

function authenticate(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Missing or invalid Authorization header'));
  }

  const token = header.split(' ')[1];

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    next(new ApiError(401, 'Invalid or expired token'));
  }
}

module.exports = { authenticate, JWT_SECRET };
