const express = require('express');
const taskStore = require('../models/taskStore');
const { ApiError } = require('../middleware/errorHandler');
const { validateCreateTask, validateUpdateTask } = require('../middleware/validateTask');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

const ID_PATTERN = /^\d{6}$/;

router.param('id', (req, res, next, id) => {
  if (!ID_PATTERN.test(id)) {
    return next(new ApiError(400, `Invalid task id: ${id}`));
  }
  next();
});

// GET /api/tasks - list all tasks, with optional sorting and pagination
router.get('/', (req, res) => {
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
});

// GET /api/tasks/:id - get single task
router.get('/:id', (req, res, next) => {
  const task = taskStore.getTaskById(req.params.id);
  if (!task) return next(new ApiError(404, `Task with id ${req.params.id} not found`));
  res.json(task);
});

// POST /api/tasks - create task
router.post('/', validateCreateTask, (req, res) => {
  const { title, description, completed } = req.body;
  const task = taskStore.createTask({ title, description, completed });
  res.status(201).json(task);
});

// PUT /api/tasks/:id - update task
router.put('/:id', validateUpdateTask, (req, res, next) => {
  const updated = taskStore.updateTask(req.params.id, req.body);
  if (!updated) return next(new ApiError(404, `Task with id ${req.params.id} not found`));
  res.json(updated);
});

// DELETE /api/tasks/:id - delete task
router.delete('/:id', (req, res, next) => {
  const deleted = taskStore.deleteTask(req.params.id);
  if (!deleted) return next(new ApiError(404, `Task with id ${req.params.id} not found`));
  res.status(204).send();
});

router.all('/', (req, res, next) => next(new ApiError(405, `Method ${req.method} not allowed on /api/tasks`)));
router.all('/:id', (req, res, next) => next(new ApiError(405, `Method ${req.method} not allowed on /api/tasks/:id`)));

module.exports = router;
