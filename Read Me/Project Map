# AI-Compass Project Map

Welcome to the comprehensive guide for the AI-Compass project. This document explains the development process, folder structure, architecture, features, and connectivity of the application.

---

## 🚀 How We Developed the Project

The AI-Compass project was developed as a **Modern Full-Stack Web Application** with a focus on speed, aesthetics, and scalability.

1.  **Frontend First**: We started with a "Premium-First" design philosophy, using Vanilla HTML, CSS, and JavaScript to ensure maximum performance and zero dependency overhead.
2.  **SPA Architecture**: Although it uses multiple HTML files (`index.html`, `login.html`), the main interaction logic in `main.js` acts like a Single Page Application (SPA), dynamically updating the UI without full page reloads.
3.  **Serverless Evolution**: The backend was initially designed as a standard Express server but was evolved into **Netlify Functions** to allow for easy, cost-effective serverless deployment while maintaining a local Express development environment.
4.  **Data-Driven**: We used **MongoDB Atlas** for persistent user data (authentication, bookmarks, search history) and a static JSON file for the core AI tools database to ensure lightning-fast read speeds.

---

## 📁 Folder and File Breakdown

### Root Directory
- 📄 `.env`: Contains sensitive configuration like `MONGODB_URI`. (Not tracked in Git).
- 📄 `package.json`: Manages project dependencies (`express`, `mongoose`, `bcrypt`, etc.).
- 📄 `netlify.toml`: Configuration for Netlify deployment and function routing.
- 📄 `Project Map`: (This file) The architectural blueprint of the project.
- 📄 `README.md`: General introduction and setup instructions.
- 📄 `Run-AI-Compass.bat`: A convenient shortcut script for Windows users to start the project.
- 📄 `seed_user.js` / `test_db.js`: Utility scripts for database testing and initial setup.

### 📂 `frontend/` (The Client Side)
- 📄 `index.html`: The main entry point and dashboard.
- 📄 `login.html` / `signup.html`: Authentication pages.
- 📄 `terms.html`: Legal terms and conditions.
- 📂 `css/`: Contains custom styling including `main.css` (Glassmorphism, animations).
- 📂 `js/`: 
    - 📄 `main.js`: The heart of the frontend. Handles API calls, DOM manipulation, search logic, and state management.
- 📂 `assets/`: Static images and icons.

### 📂 `backend/` (The Server Side)
- 📂 `src/`:
    - 📄 `server.js`: The entry point for local development server.
    - 📄 `app.js`: Configures Express middleware, routes, and static file serving.
    - 📂 `config/`: 
        - 📄 `db.js`: Handles connection logic to MongoDB via Mongoose.
    - 📂 `models/`: 
        - 📄 `User.js`: The database schema for User accounts (email, password, bookmarks, history).
    - 📂 `routes/`: 
        - 📄 `authRoutes.js`: API endpoints for Signup, Login, Bookmarks, and Search History.
- 📂 `data/`:
    - 📄 `tools.json`: The static database containing all AI tool information.

### 📂 `netlify/` (Cloud Infrastructure)
- 📂 `functions/`: 
    - 📄 `api.js`: Wraps the Express app for Netlify's serverless environment.
    - 📄 `login.js` / `signup.js`: Specialized serverless handlers for authentication.

---

## 🏛️ Project Architecture

The project follows a **Client-Server-Database** architecture optimized for serverless deployment.

### 🔄 The "Click to Action" Flow
When a client clicks a button (e.g., "Bookmark a Tool"):
1.  **Frontend Event**: `main.js` captures the click event.
2.  **UI Update**: The UI instantly reflects the change (Local state) for perceived speed.
3.  **API Call**: An `async fetch()` request is sent to `/api/bookmarks/toggle`.
4.  **Routing**: Netlify (or Express local) routes the request to the backend handler in `authRoutes.js`.
5.  **Database logic**: The backend identifies the user in **MongoDB**, updates their `bookmarks` array, and saves the document.
6.  **Confirmation**: A JSON response is sent back to the client, confirming the sync was successful.

### 📊 Connectivity Map

```mermaid
graph TD
    Client[Browser / Frontend] -- Fetch API --> LB[Netlify Load Balancer]
    LB -- Route --> NF[Netlify Functions / Express]
    NF -- JSON Data --> ToolsDB[(tools.json)]
    NF -- Mongoose --> Mongo[(MongoDB Atlas)]
    
    subgraph "Frontend Components"
        Client --> MainJS[main.js]
        MainJS --> UI[Dynamic HTML Rendering]
    end
    
    subgraph "Backend Logic"
        NF --> Auth[Auth Logic]
        NF --> Search[Search Engine]
        NF --> Bookmarks[Bookmark Sync]
    end
```

---

## ✨ Feature List

1.  **AI Tool Discovery**: Browse tools by categories (Writing, Video, Coding, etc.).
2.  **Smart Filtering**: Sort tools by "Newest", "Top Rated", "Open Source", "Free", or "Premium".
3.  **Advanced Search**: High-performance search with autocomplete dropdowns.
4.  **Search History**: Logged-in users see their recent searches for quick access.
5.  **Persistent Bookmarks**: Save tools to your profile; they persist across devices and sessions.
6.  **User Authentication**: Secure Signup/Login system with password hashing (Bcrypt).
7.  **Theme Switcher**: Seamless toggle between "Tech Dark" and "Premium Light" modes.
8.  **Interactive Aesthetics**: 
    - Typewriter landing effect.
    - Liquid Wave ripple search bar.
    - Staggered card animations.
    - Glassmorphic UI elements.

---

## 🔌 API Documentation

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/tools` | `GET` | Fetches the full list of AI tools. |
| `/api/search?q=...` | `GET` | Searches tools based on a query string. |
| `/api/signup` | `POST` | Registers a new user. |
| `/api/login` | `POST` | Authenticates a user. |
| `/api/bookmarks` | `GET` | Retrieves a user's saved tools. |
| `/api/bookmarks/toggle` | `POST` | Adds/Removes a tool from user bookmarks. |
| `/api/search/history` | `GET` | Fetches personal search history. |
| `/api/search/history` | `POST` | Saves a new search term. |
| `/api/search/history` | `DELETE`| Clears the search history. |

---

## ☁️ Deployment Instructions (Netlify)

1.  **Install CLI**: Run `npm install -g netlify-cli`.
2.  **Configure Env**: Add `MONGODB_URI` to your Netlify site settings (dashboard).
3.  **Local Dev**: Run `netlify dev` to simulate the production environment locally.
4.  **Deploy**: Push your changes to GitHub (if connected) or run `netlify deploy --prod`.

---

# 🏗️ The Ultimate "Rebuild from Scratch" Guide

This section provides a highly detailed, step-by-step passage on how to reconstruct the AI-Compass project from the very first file. We will cover the infrastructure, the security protocols, and the intricate frontend logic that gives the site its premium feel.

### Phase 1: Environment & Project Inception
To begin, you must establish a clean development environment. Start by installing **Node.js** (LTS version) and a code editor like VS Code. Create a new directory and initialize it by running `npm init -y` in your terminal. This creates your `package.json`, the heart of your project's dependency management. You will then need to install the essential packages: `express` for the server, `mongoose` for database interaction, `bcrypt` for user security, `cors` for handling cross-origin requests, and `dotenv` to manage your sensitive environment variables. Once initialized, create your folder structure: `frontend/` for the client assets and `backend/src/` for your server-side logic.

### Phase 2: The Modern Data Layer
Data management in AI-Compass is split into two categories: **Static** and **Dynamic**. For the static data (the AI tools themselves), we create a `tools.json` file inside `backend/data/`. This file acts as a high-speed, read-only database containing tool names, icons, descriptions, and pricing models. For dynamic user data, we use **MongoDB Atlas**, a cloud-based NoSQL database. You must create a cluster on MongoDB Atlas and obtain your Connection String. In your project, you define a **User Schema** using Mongoose in `backend/src/models/User.js`. This schema includes fields for the user's email, their hashed password, an array of bookmarked tool IDs, and an array of their most recent search strings.

### Phase 3: Backend Security & Server Architecture
Security is paramount when handling user accounts. We implement **Bcrypt** for password encryption. When a user signs up, we don't store their actual password. Instead, we generate a "salt"—a random string of data—and combine it with the password to create a unique **Hash**. This is a one-way process; even if the database were compromised, the original passwords remain unreadable. During login, Bcrypt compares the provided password against the stored hash to verify the user.

Your server architecture relies on **Express**. The `app.js` file configures middleware like `express.json()` to parse incoming data and defines the API routes. We use `authRoutes.js` to handle all user-specific requests. Each route is an "endpoint" that perform a specific task, such as `/api/signup` or `/api/bookmarks/toggle`. For production, these routes are wrapped into **Netlify Functions**, allowing the backend to scale automatically without the need for a dedicated, always-on server.

### Phase 4: Frontend Masterclass & Coding Details
The frontend is where the project truly shines. We use a **Glassmorphic Design System**, which relies on CSS properties like `backdrop-filter: blur(20px)` and semi-transparent backgrounds to create a "frosted glass" effect.

#### 🌊 The Liquid Wave Search Effect
One of the site's most unique features is the **Liquid Wave** ripple. When you click the search bar, a "wave" expands across the screen. This is achieved by dynamically creating a `div` with the class `.liquid-wave` at the mouse coordinates using a `mousedown` event listener in `main.js`. In CSS, we define an `@keyframes` animation called `expandFluidWave` that scales the div from 0.01 to 1 and fades it out. The `backdrop-filter: blur(6px)` on this wave distorts the content beneath it, creating a realistic water-like refraction effect.

#### 🌗 Theme Persistence & Logic
The **Theme Toggle** allows users to switch between a tech-focused dark mode and a premium-inspired light mode. This is implemented by toggling a `.light-mode` class on the `<body>` element. We use **CSS Variables** (e.g., `--bg-primary`) to define colors, and when the class is present, these variables are updated to the light theme values. To ensure the user's choice is remembered, we save the current theme string in the browser's **LocalStorage**. Every time the page loads, `main.js` checks this storage and re-applies the saved theme instantly.

#### ⌨️ The Typewriter Engine
The hero section features a **Typewriter effect** that greets users. This is not a simple gif, but a recursive JavaScript function. It takes two strings ("Discover the " and "Future of AI") and uses `setTimeout` to append one character at a time to the HTML elements. Once the first string is finished, it starts the second, creating a rhythmic, human-like typing animation that captures attention immediately upon landing.

#### 🔍 Search & Personalization Logic
The search bar uses "On-the-fly Filtering". As you type, an `input` event listener triggers a function that searches through the `tools` array for matches in the name, category, or description. The results are rendered into a dropdown menu. When you press "Enter", the search term is sent to the backend to be stored in the user's **Search History**, and the main grid scrolls down to show the results prominently.

### Phase 5: The Deployment Process
Deploying AI-Compass is streamlined via **Netlify**. First, you install the Netlify CLI and log in. You connect your local project to a new Netlify site. The most critical step is configuring your **Environment Variables** in the Netlify Dashboard; you must add your `MONGODB_URI` there so the production functions can reach your database. Locally, you use `netlify dev` to test your serverless functions. Once ready, you simply run `netlify deploy --prod` (or push to a connected GitHub repo), and Netlify builds your frontend and deploys your backend functions globally in seconds.

---

## 🗺️ Rebuild Connectivity Diagrams

### 🛡️ Authentication & Security Flow
```mermaid
sequenceDiagram
    participant User as Client (Browser)
    participant API as Express / Netlify Function
    participant Bcrypt as Bcrypt Logic
    participant DB as MongoDB Atlas

    User->>API: POST /signup (Email + Password)
    API->>Bcrypt: Hash Password (Salt + Password)
    Bcrypt-->>API: Returns Hashed String
    API->>DB: Save User Document (Email + Hash)
    DB-->>User: Account Created Successfully

    User->>API: POST /login (Email + Password)
    API->>DB: Find User by Email
    DB-->>API: Returns User Document (with Hash)
    API->>Bcrypt: Compare(Password, Hash)
    Bcrypt-->>API: Match True/False
    API-->>User: Login Success (Session Start)
```

### 🧬 UI Component Architecture
```mermaid
graph TD
    Root[index.html] --> Nav[Navigation Bar]
    Nav --> Theme[Theme Toggle Logic]
    Nav --> Profile[User Profile / Auth State]

    Root --> Hero[Hero Section]
    Hero --> TW[Typewriter Script]

    Root --> Search[Search Container]
    Search --> Wave[Liquid Wave Effect JS/CSS]
    Search --> Filter[Real-time Filter Logic]

    Root --> Grids[Grid Layouts]
    Grids --> Cards[Glassmorphic Cards]
    Cards --> Bookmark[Bookmark Sync Logic]

    style Root fill:#0a0a0f,stroke:#00d4ff,stroke-width:2px,color:#fff
    style Wave fill:#00d4ff22,stroke:#00d4ff
```

---
*End of Documentation. Build something amazing!*
