const taskStore = require('../models/taskStore');
const { ApiError } = require('../middleware/errorHandler');

const ID_PATTERN = /^\d{6}$/;

function validateTaskId(req, res, next, id) {
  if (!ID_PATTERN.test(id)) {
    return next(new ApiError(400, `Invalid task id: ${id}`));
  }
  next();
}

async function listTasks(req, res, next) {
  try {
    let tasks = [...taskStore.getAllTasks()];

    const { sortBy = 'createdAt', order = 'asc', page, limit } = req.query;
    const validSortFields = ['title', 'completed', 'createdAt'];

    if (validSortFields.includes(sortBy)) {
      tasks.sort((a, b) => {
        if (a[sortBy] < b[sortBy]) return order === 'desc' ? 1 : -1;
        if (a[sortBy] > b[sortBy]) return order === 'desc' ? -1 : 1;
        return 0;
      });
    }

    const total = tasks.length;

    if (page || limit) {
      const pageNum = Math.max(parseInt(page, 10) || 1, 1);
      const limitNum = Math.max(parseInt(limit, 10) || 10, 1);
      const start = (pageNum - 1) * limitNum;
      tasks = tasks.slice(start, start + limitNum);

      return res.json({
        data: tasks,
        pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) },
      });
    }

    res.json({ data: tasks, pagination: { total, page: 1, limit: total, totalPages: 1 } });
  } catch (error) {
    next(error);
  }
}

async function getTask(req, res, next) {
  try {
    const task = taskStore.getTaskById(req.params.id);
    if (!task) return next(new ApiError(404, `Task with id ${req.params.id} not found`));
    res.json(task);
  } catch (error) {
    next(error);
  }
}

async function createTask(req, res, next) {
  try {
    const { title, description, completed } = req.body;
    const task = taskStore.createTask({ title, description, completed });
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
}

async function updateTask(req, res, next) {
  try {
    const updated = taskStore.updateTask(req.params.id, req.body);
    if (!updated) return next(new ApiError(404, `Task with id ${req.params.id} not found`));
    res.json(updated);
  } catch (error) {
    next(error);
  }
}

async function deleteTask(req, res, next) {
  try {
    const deleted = taskStore.deleteTask(req.params.id);
    if (!deleted) return next(new ApiError(404, `Task with id ${req.params.id} not found`));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

function handleTaskMethodNotAllowed(req, res, next) {
  next(new ApiError(405, `Method ${req.method} not allowed on ${req.originalUrl}`));
}

module.exports = {
  validateTaskId,
  listTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  handleTaskMethodNotAllowed,
};
