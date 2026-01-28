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
- Docker and Docker Compose (for MongoDB container)

## Database Setup

### Option 1: Docker MongoDB (Recommended)

```bash
# Start MongoDB container with persistent data
npm run docker:db:up

# View MongoDB logs
npm run docker:db:logs

# Stop MongoDB container
npm run docker:db:down

# Restart MongoDB container
npm run docker:db:restart
```

### Option 2: Local MongoDB

If you prefer to use a local MongoDB installation, update the `.env` file:

```env
# Comment out the Docker MongoDB URI
# MONGODB_URI=mongodb://admin:password123@localhost:27017/todai?authSource=admin

# Uncomment the local MongoDB URI
MONGODB_URI=mongodb://127.0.0.1:27017/todai
```

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
├── docker-compose.yml     # MongoDB container setup
└── package.json
```
