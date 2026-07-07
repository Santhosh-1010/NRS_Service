const { ApiError } = require('./errorHandler');

/**
 * Validate completed field as boolean
 * @param {boolean|undefined} value - The completed value
 * @returns {boolean|undefined} - Validated boolean or undefined
 */
function normalizeCompleted(value) {
  if (value === undefined) return undefined;
  if (typeof value === 'boolean') return value;
  return null; // Invalid value
}

function validateCreateTask(req, res, next) {
  const { title, description, completed } = req.body;

  if (typeof title !== 'string' || title.trim().length === 0) {
    return next(new ApiError(400, 'Title is required and cannot be empty'));
  }

  if (description !== undefined && typeof description !== 'string') {
    return next(new ApiError(400, 'Description must be a string'));
  }

  // Validate completed field
  if (completed !== undefined) {
    const normalized = normalizeCompleted(completed);
    if (normalized === null) {
      return next(new ApiError(400, 'Completed must be a boolean (true or false)'));
    }
    req.body.completed = normalized;
  }

  req.body.title = title.trim();
  next();
}

function validateUpdateTask(req, res, next) {
  const { title, description, completed } = req.body;

  if (title === undefined && description === undefined && completed === undefined) {
    return next(new ApiError(400, 'At least one field (title, description, completed) must be provided'));
  }

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim().length === 0) {
      return next(new ApiError(400, 'Title cannot be empty'));
    }
    req.body.title = title.trim();
  }

  if (description !== undefined && typeof description !== 'string') {
    return next(new ApiError(400, 'Description must be a string'));
  }

  // Validate completed field
  if (completed !== undefined) {
    const normalized = normalizeCompleted(completed);
    if (normalized === null) {
      return next(new ApiError(400, 'Completed must be a boolean (true or false)'));
    }
    req.body.completed = normalized;
  }

  next();
}

module.exports = { validateCreateTask, validateUpdateTask };
