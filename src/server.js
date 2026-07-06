const express = require('express');
const cors = require('cors');
const tasksRouter = require('./routes/tasks');
const authRouter = require('./routes/auth');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRouter);
app.use('/api/tasks', tasksRouter);

app.use(notFoundHandler);
app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Task manager API listening on http://localhost:${PORT}`);
  });
}

module.exports = app;
