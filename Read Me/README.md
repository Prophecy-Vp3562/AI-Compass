# AI Compass

Welcome to **AI Compass**, the premier curated directory of the world's most powerful AI tools. 
Designed with a striking neon aesthetic and built with a modern monolithic API architecture, AI Compass ensures high performance and massive scalability.

## ✨ Live Working Features

We recently completed a massive overhaul of the platform. Here are the features currently live and fully functional on the site:

### 1. 📚 Massive AI Database (200+ Tools)
*   Integrated database dynamically serving over **200 highly curated AI platforms**, automatically sorting them without reloading the page.
*   Includes internet heavy-hitters (Google Gemini, OpenAI Sora, Meta Llama) and elite open-source models.
*   Every single tool features a **100% unique cover photo**, programmatically mapped to its ID via dynamic seed generation to ensure standard quality and no duplicates.

### 2. 🔍 "Spotlight" Real-Time Search
*   Cinematic **Spotlight Search Bar** that dynamically slightly scales up and darkens/dims the rest of the web page when focused.
*   Real-time dropdown predictions typing-ahead across Name, Description, and Category data.
*   Submitting the search auto-scrolls the user smoothly down to the freshly populated Search Results grid.

### 3. 🔖 Personal Bookmarking System (Save Tools)
*   Users can click the heart/bookmark icon on any AI tool card to save it. 
*   Progress is securely saved using **LocalStorage persistence** so bookmarks aren't lost upon exiting the page.
*   Clicking **Profile > Saved Tools** isolated UI to exclusively display their private tool directory for easy reference.

### 4. 🎛️ Blazing Fast SPA Filtering Arrays
*   **Sticky Dynamic Filter Bar** containing zero-latency toggles: *Featured, Newest, Top Rated, Open Source, Free*, and *Premium*.
*   **Bento-style Interactive Category Grids** (Productivity, Writing, Marketing, etc.) that instantly re-render the layout sorting over 200 items in milliseconds.

### 5. 🎨 Modern Interactive Design
*   Fluid web elements including animated liquid-wave effects upon clicking.
*   Floating parallax UI assets and seamless dark-glassmorphism styling utilizing Tailwind CSS.
*   Image-backed gradient fade bento cards for top-tier visual hierarchy.

---

## 🚀 Project Overview & Architecture

AI Compass is refactored into a modern, production-ready structure:
- **`frontend/`**: Contains the decoupled single-page application (SPA).
  - `index.html`: The main unified interface handling DOM manipulation.
  - `css/style.css`: Modular custom effects (mesh gradients, grid scrollbars).
  - `js/main.js`: Robust javascript fetching data dynamically from the standard endpoints.
- **`backend/`**: Contains the data endpoints via an Express server.
  - `src/app.js`: Isolated express initialization.
  - `src/server.js`: Standard local testing port binding.
  - `data/tools.json`: The database of 200+ categorized AI tools.
- **`netlify/functions/api.js`**: A serverless wrapper natively running `app.js` making deployments via Netlify one-click without duplicating API logic.

## 🛠️ Quick Start

Starting development is completely automated thanks to our batch configuration script.

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

- **`GET /api/tools`**: Returns the complete list of AI tool objects.
- **`GET /api/search?q={query}`**: Deep search filtering through description, category, and name properties.
- **`GET /api/tools/:id`**: Return a specific context element.

## 🌟 Contributing & Expanding Tools
Adding new tools is simple!
1. Navigate to `backend/data/tools.json`
2. Add a new JSON object to the global array:
```json
{
  "id": "new-tool-slug",
  "name": "Tool Name",
  "category": "Productivity",
  "description": "Short succinct description.",
  "pricing": "Freemium",
  "color": "primary",
  "icon": "star",
  "link": "https://...",
  "img": "https://picsum.photos/seed/new-tool-slug/600/400"
}
```
3. Save the file and refresh the web page! No server restarts are necessary.
