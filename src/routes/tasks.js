const express = require('express');
const { validateCreateTask, validateUpdateTask } = require('../middleware/validateTask');
const { authenticate } = require('../middleware/auth');
const {
  validateTaskId,
  listTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  handleTaskMethodNotAllowed,
} = require('../controllers/taskController');

const router = express.Router();

router.use(authenticate);

router.param('id', validateTaskId);

// GET /api/tasks - list all tasks, with optional sorting and pagination
router.get('/', listTasks);

// GET /api/tasks/:id - get single task
router.get('/:id', getTask);

// POST /api/tasks - create task
router.post('/', validateCreateTask, createTask);

// PUT /api/tasks/:id - update task
router.put('/:id', validateUpdateTask, updateTask);

// DELETE /api/tasks/:id - delete task
router.delete('/:id', deleteTask);

router.all('/', handleTaskMethodNotAllowed);
router.all('/:id', handleTaskMethodNotAllowed);

module.exports = router;
