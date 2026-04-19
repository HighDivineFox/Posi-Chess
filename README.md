# Posi-Chess

Posi-Chess is a full-stack chess application built with a Vue 2 frontend and an Express/MongoDB backend. The project focuses on playable games with custom starting positions, saved positions, and persistent user/game data.

## Stack

- **Frontend:** Vue 2
- **Backend:** Node.js + Express
- **Database:** MongoDB + Mongoose
- **Chess libraries:** `chess.js`, `@chrisoakman/chessboardjs`

## What the app does

Based on the current codebase, the app supports:

- user account creation and login
- creating and joining games
- storing game state in the database
- working with FEN positions
- saving custom board positions by side
- tracking user game history

## Project structure

```text
.
├── api/            # Express server and Mongoose models
├── src/            # Vue application
├── public/         # Static frontend assets
└── package.json    # Project scripts and dependencies
```

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file for local development and provide your own MongoDB connection string.

```bash
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

The current backend code should be updated to read from environment variables before deploying or sharing the project publicly.

### 3. Start the backend API

```bash
npm run start-watch
```

This runs the Express server with `nodemon`.

### 4. Start the frontend

In a second terminal:

```bash
npm run serve
```

### 5. Build for production

```bash
npm run build
```

### 6. Lint the codebase

```bash
npm run lint
```

## Available scripts

```json
{
  "serve": "vue-cli-service serve",
  "build": "vue-cli-service build",
  "lint": "vue-cli-service lint",
  "start-watch": "nodemon api/server.js"
}
```

## Notes

- This repository currently uses an older Vue CLI / Vue 2 stack.
- The backend contains database configuration that should be moved to environment variables.
- If you plan to continue development, a good next step would be separating configuration, secrets, and deployment settings from source code.

## License

No license has been added to this repository yet.
