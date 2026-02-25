# Task Manager

A simple Task Manager web app — built as an **example project** to demonstrate how Cursor Cloud Agents set up and verify a development environment.

## Tech Stack

- **Backend:** Node.js + Express (REST API with in-memory storage)
- **Frontend:** Vanilla HTML / CSS / JS (served as static files)
- **Testing:** Vitest + Supertest
- **Linting:** ESLint (flat config)

## Getting Started

```bash
# Install dependencies
npm install

# Run the dev server (auto-restarts on file changes)
npm run dev

# Open http://localhost:3000 in your browser
```

## Scripts

| Command          | Description                       |
| ---------------- | --------------------------------- |
| `npm run dev`    | Start dev server with file watch  |
| `npm start`      | Start production server           |
| `npm test`       | Run all tests                     |
| `npm run lint`   | Lint source and test files        |

## API Endpoints

| Method   | Path              | Description         |
| -------- | ----------------- | ------------------- |
| `GET`    | `/api/tasks`      | List all tasks      |
| `GET`    | `/api/tasks/:id`  | Get a task by ID    |
| `POST`   | `/api/tasks`      | Create a new task   |
| `PATCH`  | `/api/tasks/:id`  | Update a task       |
| `DELETE` | `/api/tasks/:id`  | Delete a task       |

## Project Structure

```
├── public/          # Static frontend files
│   ├── index.html
│   ├── style.css
│   └── app.js
├── src/             # Backend source
│   ├── app.js       # Express app setup
│   ├── routes.js    # API route handlers
│   ├── server.js    # Entry point (starts listening)
│   └── store.js     # In-memory task storage
├── tests/           # Test files
│   ├── api.test.js  # API integration tests
│   └── store.test.js# Store unit tests
├── eslint.config.js # ESLint flat config
└── package.json
```
