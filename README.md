# todAI

A task management application built with Express.js, MongoDB, React, Redux (RTK Query), and Material UI.

## Tech Stack

### Backend
- **Express.js 5.x** - Web framework
- **MongoDB** - Database
- **Mongoose 8.x** - MongoDB ODM

### Frontend
- **React 19** - UI library
- **Redux Toolkit** - State management
- **RTK Query** - Data fetching
- **Material UI 6.x** - Component library
- **Vite 6.x** - Build tool

## Prerequisites

- Node.js >= 20.19.0
- MongoDB installed and running locally on port 27017

## Installation

```bash
# Install all dependencies (root, backend, and frontend)
npm run install:all
```

## Development

```bash
# Run both backend and frontend in development mode
npm run dev

# Run backend only
npm run dev:backend

# Run frontend only
npm run dev:frontend
```

## Ports

- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:5173

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/tasks | Get all tasks |
| GET | /api/tasks/:id | Get a task by ID |
| POST | /api/tasks | Create a new task |
| PUT | /api/tasks/:id | Update a task |
| DELETE | /api/tasks/:id | Delete a task |

## Task Schema

```json
{
  "id": "string (auto-generated)",
  "title": "string (required)",
  "description": "string (optional)",
  "status": "todo | in-progress | done (default: todo)",
  "createdAt": "date (auto-generated)",
  "updatedAt": "date (auto-generated)"
}
```

## Project Structure

```
todAI/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── app.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── store/
│   │   ├── theme/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js
│   └── package.json
└── package.json
```
