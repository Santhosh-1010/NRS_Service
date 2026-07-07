# NRS Task Manager Service

An Express REST API for managing tasks, with JWT-based login and an in-memory task store.

## Structure

```
src/
  server.js               Express app setup and entry point
  middleware/
    auth.js               JWT authentication middleware
    errorHandler.js        Centralized error handling (ApiError, 404/500 handlers)
    validateTask.js        Request validation for task create/update
  models/
    taskStore.js           In-memory task storage
  routes/
    auth.js                POST /api/auth/login
    tasks.js                /api/tasks CRUD routes
```

## Getting started

```bash
npm install
cp .env.example .env   # optional, defaults work out of the box
npm run dev            # http://localhost:4000
```

Demo login: `admin` / `password123`

## API

All `/api/tasks` routes require `Authorization: Bearer <token>`, obtained from `POST /api/auth/login`.

| Method | Path              | Description                                  |
|--------|-------------------|-----------------------------------------------|
| POST   | /api/auth/login   | Returns a JWT for demo credentials            |
| GET    | /api/tasks        | List tasks. Supports `sortBy`, `order`, `page`, `limit` query params |
| GET    | /api/tasks/:id    | Get a single task                             |
| POST   | /api/tasks        | Create a task (`title` required, `description`/`completed` optional) |
| PUT    | /api/tasks/:id    | Update a task (any subset of `title`/`description`/`completed`) |
| DELETE | /api/tasks/:id    | Delete a task                                 |

## Notes

- Task storage is in-memory and resets whenever the server restarts.
- The JWT secret and demo credentials are for local/demo use only — not production-ready as-is.
