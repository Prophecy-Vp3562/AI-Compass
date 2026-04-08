# AI Compass

Welcome to **AI Compass**, the premier curated directory of the world's most powerful AI tools. 
Designed with a striking neon aesthetic and built with a modern monolithic API architecture, AI Compass ensures high performance and scalability.

## 🚀 Project Overview & Architecture

We recently refactored AI Compass into a modern, production-ready structure:
- **`frontend/`**: Contains the decoupled single-page application (SPA).
  - `index.html`: The main unified interface.
  - `css/style.css`: All modular styles, glassmorphism, and fluid wave animations.
  - `js/main.js`: Core robust logic fetching data dynamically, removing the need for duplicate pages.
- **`backend/`**: Contains the data endpoints via an Express server.
  - `src/app.js`: Isolated robust express initialization.
  - `src/server.js`: Standard local testing port binding.
  - `data/tools.json`: The database of categorized AI tools.
- **`netlify/functions/api.js`**: A serverless wrapper natively running `app.js` making deployments via Netlify one-click without duplicating API logic.

## 🛠️ Quick Start

Starting development is now easier than ever thanks to the unified batch script.

### 1️⃣ Run Locally (Windows)

Simply double click:
```
Run-AI-Compass.bat
```
This will automatically launch the backend server and open `http://localhost:3000` in your default browser.

### 2️⃣ Manual Run via NPM

1. Install dependencies (First run only):
   ```bash
   npm install
   ```
2. Start the integrated frontend & backend mode:
   ```bash
   npm start
   ```

## 🔌 API Endpoints
Local API available at `http://localhost:3000/api` natively, or `/.netlify/functions/api/...` during remote Netlify deployments.

- **`GET /api/tools`**: Return all AI tool objects.
- **`GET /api/search?q={query}`**: Live autocomplete, searching deeply through description, category, and name.
- **`GET /api/tools/:id`**: Return a specific metadata context.

## 🌟 Contributing & Expanding Tools
Adding new tools is simple!
1. Navigate to `backend/data/tools.json`
2. Apply the JSON object template securely inside the root array:
```json
{
  "id": "unique-slug",
  "name": "Tool Name",
  "category": "Productivity",
  "description": "Short succinct description.",
  "pricing": "Free | Freemium | Premium",
  "color": "primary",
  "icon": "star",
  "link": "https://...",
  "img": "https://source.unsplash.com/example"
}
```
3. Refresh the web page. No restarting servers needed.
