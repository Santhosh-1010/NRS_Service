let tasks = [];
let nextId = 1;

function generateId() {
  const id = String(nextId).padStart(6, '0');
  nextId += 1;
  return id;
}

function getAllTasks() {
  return tasks;
}

function getTaskById(id) {
  return tasks.find((task) => task.id === id);
}

function createTask({ title, description, completed }) {
  const newTask = {
    id: generateId(),
    title,
    description: description || '',
    completed: Boolean(completed),
    createdAt: new Date().toISOString(),
  };
  tasks.push(newTask);
  return newTask;
}

function updateTask(id, updates) {
  const task = getTaskById(id);
  if (!task) return null;

  if (updates.title !== undefined) task.title = updates.title;
  if (updates.description !== undefined) task.description = updates.description;
  if (updates.completed !== undefined) task.completed = Boolean(updates.completed);
  task.updatedAt = new Date().toISOString();

  return task;
}

function deleteTask(id) {
  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) return false;
  tasks.splice(index, 1);
  return true;
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
