const { ApiError } = require('./errorHandler');

function validateCreateTask(req, res, next) {
  const { title, description, completed } = req.body;

  if (typeof title !== 'string' || title.trim().length === 0) {
    return next(new ApiError(400, 'Title is required and cannot be empty'));
  }

  if (description !== undefined && typeof description !== 'string') {
    return next(new ApiError(400, 'Description must be a string'));
  }

  if (completed !== undefined && typeof completed !== 'boolean') {
    return next(new ApiError(400, 'Completed must be a boolean'));
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

  if (completed !== undefined && typeof completed !== 'boolean') {
    return next(new ApiError(400, 'Completed must be a boolean'));
  }

  next();
}

module.exports = { validateCreateTask, validateUpdateTask };
