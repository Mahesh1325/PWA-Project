# Product Management PWA

This repository contains a small Product Management PWA with a React frontend and Express + MongoDB backend.

## What I changed (summary)
- Expanded the Product model with common fields: name, description, brand, category, price, image, stock, tags.
- Hardened backend routes with validation, consistent error handling and logging: `/server/routes/productRoutes.js`.
- Improved frontend UI: responsive layout, card grid for product listing, improved Add/Edit forms (more fields), loading and message states, and CSS animations in `client/src/styles/global.css`.
- Wire-up: frontend `client/src/api.js` interacts with backend endpoints and updates persist to MongoDB.

## Run locally
Prerequisites: Node.js (16+), npm, MongoDB running locally on default port.

Start backend (from repo root):

```bash
cd 'server'
npm install   # if dependencies not installed
npm run start   # starts server.js which connects to MongoDB
```

Start frontend (in another terminal):

```bash
cd 'client'
npm install   # if dependencies not installed
npm start       # starts React dev server (default: 3001)
```

