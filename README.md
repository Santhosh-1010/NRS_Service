# Task Manager

A full-stack task management app: Express REST API backend + React (Vite) frontend, with JWT-based login.

## Structure

```
backend/   Express API, in-memory task store, JWT auth
frontend/  React app (Vite + Tailwind CSS)
```

## Backend

```bash
cd backend
npm install
cp .env.example .env   # optional, defaults work out of the box
npm run dev            # http://localhost:4000
```

Demo login: `admin` / `password123`

### API

All `/api/tasks` routes require `Authorization: Bearer <token>`, obtained from `POST /api/auth/login`.

| Method | Path              | Description                                  |
|--------|-------------------|-----------------------------------------------|
| POST   | /api/auth/login   | Returns a JWT for demo credentials            |
| GET    | /api/tasks        | List tasks. Supports `sortBy`, `order`, `page`, `limit` query params |
| GET    | /api/tasks/:id    | Get a single task                             |
| POST   | /api/tasks        | Create a task (`title` required, `description`/`completed` optional) |
| PUT    | /api/tasks/:id    | Update a task (any subset of `title`/`description`/`completed`) |
| DELETE | /api/tasks/:id    | Delete a task                                 |

Run tests: `npm test` (Jest + Supertest).

## Frontend

```bash
cd frontend
npm install
cp .env.example .env   # optional, defaults point at localhost:4000
npm run dev            # http://localhost:5173
```

Log in with the demo credentials above. Tasks are fetched from the backend on load; create, edit, complete, and delete all hit the live API. Sorting and pagination are handled server-side.

## Notes

- Task storage is in-memory and resets whenever the backend restarts.
- The JWT secret and demo credentials are for local/demo use only — not production-ready as-is.
