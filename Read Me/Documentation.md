# AI Compass: Full Project Documentation

This document explains the AI Compass project as it exists in the current repository. It is written from the code, not from assumptions. The project is a full-stack web application that combines a static frontend, an Express backend, Netlify serverless deployment wrappers, and MongoDB Atlas for persistent user data. The main product idea is not to generate AI responses itself, but to act as a curated discovery platform for AI tools. In other words, AI Compass is a searchable directory and personalization layer around AI products, not an AI model-serving application.

The application has two very different data paths. The first path is public catalog data: the list of AI tools lives in `backend/data/tools.json`, is loaded into memory by the backend, and is returned through read-only APIs like `/api/tools`, `/api/search`, and `/api/tools/:id`. The second path is user data: user accounts, password hashes, bookmarks, and recent searches are stored in MongoDB through Mongoose. The frontend is written in plain HTML, CSS, and JavaScript, but behaves like a lightweight SPA because the main page updates sections dynamically without full reloads.

The development style of this project is "frontend-driven, backend-supported." The UI is designed first in static HTML and Tailwind utility classes, then interactive behavior is added in `frontend/js/main.js`, and finally persistence is attached through backend endpoints in `backend/src/routes/authRoutes.js`. Deployment is shaped around Netlify, so the same Express logic is reused both locally and in serverless functions. That is why the codebase contains both `backend/src/app.js` and `netlify/functions/*.js`.

## 1. Repository Structure and What Every Folder/File Does

### 1.1 Root directory

The root folder is the command center of the project. It contains environment configuration, package metadata, local run helpers, documentation files, and small maintenance scripts.

- `.env`
  This file contains real environment variables for the local machine. In this project it is expected to hold values like `PORT` and `MONGODB_URI`. It is intentionally ignored by Git because it contains secrets. The frontend never reads this file directly; the backend uses it through `dotenv`.

- `.env.example`
  This is the safe sample version of the environment file. It shows which variables are required and the general format expected by the app. In this repository it documents `PORT` and `MONGODB_URI` with placeholder Atlas values so a new developer knows what to create in their local `.env`.

- `.gitignore`
  This file tells Git what not to track. Here it excludes `node_modules/`, `.DS_Store`, `.env`, and `.netlify`. That means dependencies, OS artifacts, secrets, and local Netlify runtime state stay out of version control.

- `Codex`
  This file is the full technical documentation you are reading now.

- `Project Map`
  This is an older internal documentation file. It already tries to summarize the architecture, features, and deployment, but it is shorter and less precise than this document. It is still useful as a quick orientation file, but it does not capture every implementation detail or every current behavior.

- `README.md`
  This is the public-facing setup and overview document. It explains the product idea, lists major features, shows how to run the app, and describes the basic APIs. It is meant for first contact, not deep architecture review.

- `package.json`
  This is the central Node.js project manifest. It defines the project name, version, scripts, and dependencies. The important runtime dependencies are:
  `express` for backend routing,
  `cors` for cross-origin handling,
  `dotenv` for environment loading,
  `mongoose` for MongoDB integration,
  `bcrypt` for password hashing,
  `serverless-http` for wrapping Express into Netlify functions.
  It also defines the useful scripts:
  `npm run server` starts raw Express from `backend/src/server.js`,
  `npm start` and `npm run dev` both start `netlify dev`.

- `package-lock.json`
  This is the generated npm lockfile. It records the exact dependency tree and exact package versions installed under `node_modules/`. It is not handwritten application logic, but it is important for reproducible installs.

- `deno.lock`
  This is a lockfile used by Deno-compatible tooling, typically introduced through Netlify edge-related tooling. The current project does not use Deno in its application scripts, so this file is best understood as tooling metadata rather than core app logic.

- `netlify.toml`
  This is the Netlify deployment configuration. It defines the publish directory as `frontend`, the functions directory as `netlify/functions`, and redirect rules so requests like `/api/login`, `/api/signup`, and `/api/*` reach the correct serverless handlers.

- `Run-AI-Compass.bat`
  This Windows batch file automates local startup. It checks for `node_modules`, installs dependencies if they are missing, opens `http://localhost:8888`, and then runs `npx netlify dev`. For a Windows user this is the easiest way to boot the entire project.

- `inject-wave.js`
  This is a utility script, not part of normal runtime. It programmatically edits `frontend/index.html` to inject a ripple/wave effect. The main app now already contains a search-wave implementation in `frontend/css/style.css` and `frontend/js/main.js`, so this file looks like a historical helper or one-off automation tool.

- `seed_user.js`
  This is a development utility that connects directly to MongoDB, checks for a hard-coded email (`admin@ai.com`), hashes the password with bcrypt, and creates the user if it does not exist. It is useful for local testing, but in a production-grade project this kind of default account seeding should be handled much more carefully.

- `test_db.js`
  This is another maintenance utility. It tests the MongoDB connection, counts user documents, and prints stored users without showing password hashes. It is useful when debugging database connectivity or checking whether signup is actually writing data.

- `.git/`
  This folder is Git's own internal metadata store. It tracks commits, branches, refs, objects, and repository history. It is not application code and should never be edited as part of normal feature development.

- `node_modules/`
  This folder contains installed third-party dependencies downloaded from npm. It is generated from `package.json` and `package-lock.json`. It is part of the working runtime, but not authored project logic, so it should not be documented file-by-file.

### 1.2 `.vscode/`

This folder contains editor-level settings for Visual Studio Code.

- `.vscode/settings.json`
  This file sets `liveServer.settings.port` to `5501`. That setting is editor-specific and separate from the real recommended dev runtime, which is Netlify Dev on port `8888` or raw Express on port `3000`.

### 1.3 `.netlify/`

This folder is generated by Netlify CLI for local development and simulation of the serverless environment.

- `.netlify/state.json`
  This stores local Netlify state, including geolocation metadata captured by the local dev environment.

- `.netlify/blobs-serve/`
  Generated runtime data for local Netlify features.

- `.netlify/functions-internal/`
  Generated function build artifacts used internally by Netlify Dev.

- `.netlify/v1/`
  Additional generated local runtime data for Netlify.

These files and folders are not part of the app's authored business logic. They support local emulation and are intentionally ignored by Git.

### 1.4 `backend/`

This folder contains the backend source code and the static catalog dataset.

#### `backend/data/`

- `backend/data/tools.json`
  This is the public tool catalog database. It currently contains `217` tool objects. Each object typically includes fields such as:
  `id`,
  `name`,
  `category`,
  `description`,
  `features`,
  `pricing`,
  `link`,
  `tags`,
  `color`,
  `icon`,
  `img`,
  plus optional flags like `isTopRated`, `isNew`, `isOpenSource`, and `gradient`.
  This file is not a database engine; it is a JSON array that gets loaded into memory by Node.js. The backend then filters it when the frontend searches or requests lists.

#### `backend/src/`

- `backend/src/app.js`
  This is the main backend application assembler. It creates the Express app, attaches `cors()` and `express.json()` middleware, loads `tools.json`, mounts authentication routes, defines tool-related routes (`/tools`, `/search`, `/tools/:id`, and a health check), and serves the `frontend/` directory statically for raw local Express usage. This file is the center of backend composition.

- `backend/src/server.js`
  This is the raw local server entry point. It loads environment variables with `dotenv`, imports the app from `app.js`, tries to connect to MongoDB if `MONGODB_URI` exists, and starts listening on `PORT` or `3000`. This route is mainly for local Express development and testing.

#### `backend/src/config/`

- `backend/src/config/db.js`
  This file encapsulates database connection logic. It imports Mongoose, checks whether a connection already exists, validates the `MONGODB_URI`, rejects placeholder values like `YOUR_CLUSTER`, then connects with timeout settings. This is where database connectivity is centralized.

#### `backend/src/models/`

- `backend/src/models/User.js`
  This defines the Mongoose schema and model for users. The `User` document contains:
  `email` as a required, unique, trimmed, lowercased string,
  `password` as a required string that stores the bcrypt hash,
  `bookmarks` as an array of tool ID strings,
  `recentSearches` as an array of search query strings,
  and automatic `createdAt` / `updatedAt` timestamps.

#### `backend/src/routes/`

- `backend/src/routes/authRoutes.js`
  This file contains all user-facing backend endpoints. It handles:
  `POST /signup`,
  `POST /login`,
  `GET /bookmarks`,
  `POST /bookmarks/toggle`,
  `GET /search/history`,
  `POST /search/history`,
  `DELETE /search/history`.
  It is also where password hashing and password comparison happen through bcrypt. This file is the logic bridge between browser requests and MongoDB document updates.

### 1.5 `frontend/`

This folder contains the user interface. The project does not use React, Vue, or another framework; instead it uses static HTML pages plus plain JavaScript modules for behavior.

- `frontend/index.html`
  This is the main product page. It defines the fixed top navigation, account/profile areas, hero section, typewriter heading, search bar, categories scroller, sticky filter bar, and the empty grid containers that `main.js` fills dynamically. Tailwind is loaded from CDN in the page head, as are Google Fonts and Material Symbols. This file is the structural skeleton of the main experience.

- `frontend/login.html`
  This is the dedicated sign-in page. It contains the glassmorphism-styled login form, feedback alert box, and form controls for email, password, and remember-me UI. The real submit logic lives in `frontend/js/login.js`.

- `frontend/signup.html`
  This is the account creation page. It contains the registration form for email, password, confirm password, and terms acceptance. Client-side validation and backend submission are handled by `frontend/js/signup.js`.

- `frontend/terms.html`
  This is a static terms page linked from signup. It explains data, usage, security, and updates in a styled layout. It is informational only and has no backend behavior.

#### `frontend/css/`

- `frontend/css/style.css`
  This is the custom stylesheet that turns the HTML into the visual brand. It defines CSS variables for dark and light themes, glass-card styling, mesh gradient backgrounds, light-mode drifting orbs, navbar styling, search bar light mode styling, staggered card animations, the liquid wave effect, and toast notification animations. This file is where the project's visual identity lives outside of Tailwind utility classes.

#### `frontend/js/`

- `frontend/js/main.js`
  This is the largest and most important frontend logic file. It loads tools from `/api/tools`, renders cards into the various grids, manages active tabs, handles category filters, powers the search dropdown and search results, creates the search click wave effect, syncs bookmarks, loads and clears recent search history, controls auth-dependent UI states, manages logout, runs the hero typewriter animation, and persists the selected theme in `localStorage`.

- `frontend/js/login.js`
  This file manages the login page behavior. It validates DOM references, intercepts the form submit, shows loading state, posts credentials to `/api/login`, parses the response carefully, stores the session marker in `localStorage` under `userEmail`, shows success or error alerts, and redirects back to `index.html` on success.

- `frontend/js/signup.js`
  This file manages the signup page behavior. It validates the terms checkbox, checks password confirmation, enforces a minimum password length, sends the email/password to `/api/signup`, handles success/error feedback, and redirects to `login.html` after successful registration.

### 1.6 `netlify/`

This folder contains the serverless deployment wrappers used when the site runs on Netlify.

#### `netlify/functions/`

- `netlify/functions/api.js`
  This is the main serverless wrapper. It loads environment variables, imports the Express app from `backend/src/app.js`, wraps it with `serverless-http`, and exports `handler`. This is what allows the same Express app to run as a Netlify Function.

- `netlify/functions/login.js`
  This is a compatibility wrapper for the login endpoint. It creates a small Express app, rewrites requests aimed at `/` or `/login` to `/login`, mounts `authRoutes`, and exports a serverless handler. The redirect in `netlify.toml` points `/api/login` here.

- `netlify/functions/signup.js`
  This does the same as `login.js`, but for signup. It rewrites `/` or `/signup` to `/signup`, mounts `authRoutes`, and exports the handler used by `/api/signup`.

## 2. How the Project Was Developed

The project was built as a pragmatic full-stack web app with a strong emphasis on visual polish and simple operational structure. The likely development path visible in the repository is:

First, the visual shell was built in static pages using Tailwind CDN and custom CSS. This can be seen in the heavy HTML structure of `frontend/index.html`, `frontend/login.html`, and `frontend/signup.html`, along with the brand-level styles in `frontend/css/style.css`. The design language is a mix of dark cyber aesthetic, glassmorphism, neon gradients, and animated UI accents.

Second, frontend interactivity was layered on with plain JavaScript. Instead of introducing a component framework, the project treats the DOM as the rendering surface and uses functions in `frontend/js/main.js` to load data, generate cards, switch tabs, filter results, and maintain state such as saved bookmarks, active theme, and current login marker.

Third, backend APIs were added with Express so the frontend had a clean JSON interface. The catalog data was kept in JSON because it is public, structured, and easy to serve quickly. User data was split into MongoDB because it needs persistence, mutation, uniqueness rules, and separate documents per user.

Fourth, the local Express backend was adapted for Netlify deployment instead of being rebuilt as a second codebase. That is why `backend/src/app.js` is written as a reusable Express app and then wrapped by `netlify/functions/api.js`. This avoids duplicating route logic and keeps local development close to production behavior.

Finally, personalization features such as bookmarks, search history, and account pages were added on top of that architecture. The interesting result is a hybrid app: catalog browsing behaves like a fast client-side SPA, while user-specific actions go through backend APIs.

## 3. High-Level Architecture

The architecture can be described as four layers:

1. Presentation layer: static HTML, Tailwind utilities, custom CSS, and DOM-manipulating JavaScript in the browser.
2. Application layer: Express route handlers and frontend orchestration logic.
3. Data layer: `tools.json` in memory for public catalog data, MongoDB for private user data.
4. Deployment layer: local Express for direct testing and Netlify Functions for production routing.

In local development, there are two possible runtime shapes:

- Raw Express mode:
  `node backend/src/server.js`
  This runs the app on port `3000`, serves API routes and static frontend from Express.

- Netlify emulation mode:
  `netlify dev`
  This is the preferred mode and typically runs on port `8888`. Netlify applies the redirects from `netlify.toml`, serves the `frontend/` publish folder, and invokes the function wrappers under `netlify/functions/`.

In deployment, the frontend is published directly from `frontend/`, while backend requests flow through Netlify Functions.

## 4. Detailed Runtime Flow: "When the User Clicks Something, What Happens?"

### 4.1 Initial page load on `index.html`

When the browser opens `frontend/index.html`, the HTML loads Tailwind from CDN, Google fonts, Material Symbols, and `css/style.css`. The DOM renders the page shell immediately, but most tool content grids are empty at first. Then `js/main.js` runs on `DOMContentLoaded`. At that moment several initialization functions fire:

- `updateAuthUI()` checks whether `localStorage` has `userEmail`.
- `initAccountDropdown()` attaches dropdown and clear-history listeners.
- `loadInitialTools()` calls `fetch('/api/tools')`.
- `initTypewriter()` starts the hero headline typing effect.
- `initTheme()` reads `localStorage.theme` and applies light mode if needed.

The `loadInitialTools()` request reaches the backend, which responds with the array from `tools.json`. The frontend stores that list in the `allTools` array and calls `renderActiveTab()`. Because "Featured" is the default, the app filters out `isNew` items, generates tool card HTML strings with `renderToolCard()`, and injects those cards into the featured grid.

### 4.2 When the user types in the search bar

The search bar is the most active UI path in the app. The input element in `index.html` has id `searchInput`, and `main.js` attaches several listeners to it.

On `mousedown`, the file creates a full-screen `div` with class `liquid-wave`, positions it at the click coordinates, calculates a size large enough to cover the viewport, appends it to `document.body`, and lets the CSS animation `expandFluidWave` in `style.css` expand and fade it. That is the wave effect. So if you want to change this feature, you change the event logic in `frontend/js/main.js` and the animation/styling in `frontend/css/style.css`.

On `focus`, if the user is logged in and the input is empty, the app calls `GET /api/search/history?email=...` and shows recent searches in the dropdown. This means search history is not a purely frontend feature; it is loaded from MongoDB through the backend.

On `input`, the code debounces by `300ms` using `setTimeout`. After the wait, it calls `/api/search?q=...`. The backend lowercases the query and filters the in-memory `tools` array by `name`, `category`, `description`, plus legacy fields `cat` and `desc`. The results come back as JSON, and the frontend does two things at once:

- It renders a dropdown under the search bar with clickable suggestions.
- It also fills the `searchResultsGrid` so the main content area already reflects the search.

On `Enter`, the query is treated as confirmed. If the user is logged in, the app sends `POST /api/search/history` with `{ email, query }`, so the term is inserted at the top of `recentSearches` in MongoDB and trimmed to the latest 10 entries. Then the page scrolls smoothly to the main results section.

One important implementation note: `main.js` contains code that references `searchOverlay` and `searchContainer`, but those elements do not exist in the current `index.html`. That means the overlay/dim effect branches are effectively dormant right now, while the dropdown, results rendering, and wave effect are active.

### 4.3 When the user clicks a category card

Each category tile in `index.html` calls the global function `filterByCategory('CategoryName')`. That function lives in `main.js`. It clears the search box, hides the dropdown, filters the already-loaded `allTools` array in memory, updates the section title, fills the `searchResultsGrid`, and shows that grid. No backend request is needed here because the catalog data was already fetched during initial load. So category browsing is client-side and very fast.

### 4.4 When the user clicks one of the filter pills

The Featured, Top Rated, Newest, Open Source, Free, and Premium pills are button-driven client-side filters. Each button calls a renderer such as `renderFeaturedTab()`, `renderTopRatedTab()`, or `renderPremiumTab()`. These functions work by filtering `allTools` locally and re-rendering a grid. Again, no server request is needed because the data is already in memory.

This is why the site feels like an SPA even though it is written as static HTML plus vanilla JavaScript. The app fetches once, then reshapes the view many times in the browser.

### 4.5 When the user clicks the bookmark icon

Bookmarking behaves differently depending on whether the user is logged in.

If the user is a guest, `toggleSave()` updates the in-memory `savedTools` array, changes the bookmark icon fill state visually, and shows a toast saying the user should sign in to save bookmarks permanently. There is no persistence for guest bookmarks in the current code. That means guest bookmarks vanish on refresh. This is important because some older docs still describe localStorage bookmark persistence, but the current implementation does not do that for guests.

If the user is logged in, `toggleSave()` still updates the UI immediately for responsiveness, but then it also sends `POST /api/bookmarks/toggle` with `{ email, toolId }`. The backend loads the user document, checks whether `toolId` is already in the `bookmarks` array, adds or removes it, saves the user, and returns the updated bookmark list.

When the main page loads for a logged-in user, `updateAuthUI()` also calls `GET /api/bookmarks?email=...` so the frontend can sync `savedTools` from the database and render saved states correctly.

### 4.6 When the user signs up

The signup flow is split between `signup.html`, `signup.js`, and `authRoutes.js`.

The browser renders the form from `frontend/signup.html`. When the form is submitted, `frontend/js/signup.js` prevents the default browser submission and performs client-side checks:

- terms checkbox must be checked,
- password and confirm password must match,
- password must be at least 6 characters.

If validation passes, the script sends `POST /api/signup` with JSON `{ email, password }`.

The request reaches `authRoutes.js`. The backend first calls `connectToDatabase()`. Then it normalizes the email to trimmed lowercase, verifies both fields exist, checks if a user with that email already exists, and if not hashes the password using `bcrypt.hash(password, 10)`. The resulting hash, not the raw password, is stored in MongoDB through `User.create({ email, password: hashedPassword })`.

The backend returns a success message, the frontend shows a success alert, and then redirects to `login.html`.

### 4.7 When the user logs in

The login flow is similar but has a critical security distinction: the current app does not create a real server session or token.

The login form in `frontend/login.html` posts through `frontend/js/login.js`. The JS sends `POST /api/login` with `{ email, password }`. On the backend, `authRoutes.js` finds the user by email, then uses `bcrypt.compare(password, user.password)` to verify the submitted password against the stored bcrypt hash.

If the password matches, the backend returns only a JSON success message. It does not generate JWT, cookie, session ID, or refresh token. The frontend then stores the plain email string in `localStorage` under the key `userEmail`. From that point on, the UI treats the user as "logged in" because `main.js` checks whether that key exists.

This means current auth state is client-tracked, not server-issued. Personalized APIs also trust the provided email parameter. So the current implementation is fine for a learning/demo project, but it is not a hardened authentication model.

### 4.8 When the user toggles the theme

The theme toggle is attached to the floating image with id `themeToggleTrigger` in `index.html`. `main.js` binds a click listener to it in `initTheme()`. When clicked, `toggleTheme()` toggles the class `light-mode` on the `<body>` and writes either `light` or `dark` into `localStorage.theme`.

The actual theme change is powered by CSS variables in `frontend/css/style.css`. The root defines dark theme values like `--bg-primary`, `--text-main`, `--primary`, and `--secondary`. The selector `body.light-mode` overrides those variables with light-mode values. Because the rest of the stylesheet reads from variables, the whole interface re-skins itself without rewriting HTML.

So if you want to modify theme behavior, the logic lives in `frontend/js/main.js`, while the visual tokens live in `frontend/css/style.css`.

### 4.9 When the user logs out

There are multiple logout-related UI fragments in `index.html` and `main.js`, which shows the file still contains some legacy account code. The active path removes `userEmail` from `localStorage`, clears in-memory `savedTools`, and reloads the page. Because the login marker is gone, `updateAuthUI()` returns the page to guest mode on reload.

## 5. How Passwords Are Protected and How User Data Is Stored

The password is not stored in plain text, and it is not stored in reversible encrypted form. The project uses bcrypt hashing, which is a one-way password hashing mechanism designed for authentication. During signup, the backend runs:

`bcrypt.hash(password, 10)`

The second argument, `10`, is the salt rounds factor. Bcrypt internally creates a salt and mixes it with the password before producing the final hash string. The resulting string is what gets stored in MongoDB as `user.password`.

During login, the backend never decrypts anything. Instead it runs:

`bcrypt.compare(submittedPassword, storedHash)`

If bcrypt determines that the submitted password matches the hash, login succeeds.

User data is stored in MongoDB Atlas using the `User` schema from `backend/src/models/User.js`. Each user document currently contains:

- `email`: unique, lowercase, trimmed identifier
- `password`: bcrypt hash string
- `bookmarks`: array of saved tool IDs
- `recentSearches`: array of recent search strings
- `createdAt` and `updatedAt`: automatic timestamps

The AI tools themselves are not stored in MongoDB. They are stored in the file `backend/data/tools.json`, loaded into backend memory, and served as catalog data.

### Important security reality of the current code

This codebase protects passwords with bcrypt, which is good, but the overall account/session model is still lightweight:

- There is no JWT.
- There is no signed session cookie.
- There is no server-side session store.
- The browser stores only `userEmail` in `localStorage`.
- Bookmark and history APIs rely on the email sent by the client.

So the project does hash passwords properly, but authorization is not strongly enforced yet. If the project grows into a production platform, the next step should be adding true authentication tokens or session cookies plus authorization middleware.

## 6. Feature Inventory of the Website

The current website includes these user-facing features:

- AI tool catalog with `217` listed tools.
- Multiple categories including Coding, Image Gen, Marketing, Music, Presentation, Productivity, Prompt Gen, Social, Social Media, Video, and Writing.
- Featured, Newest, Top Rated, Open Source, Free, and Premium filtering.
- Dynamic search suggestions while typing.
- Full result-grid search rendering.
- Search term persistence for logged-in users.
- Bookmark toggling on tool cards.
- Saved Tools view.
- Signup page with client-side validation.
- Login page with loading and alert states.
- Terms of Service page.
- Theme switching between dark and light appearance.
- Typewriter hero animation.
- Liquid wave effect on search-bar interaction.
- Toast messages.
- Smooth category scroller controls.
- Tool cards with visual badges, categories, images, and external links.

## 7. API Endpoints Used by the Project

### 7.1 Internal REST API provided by this project

These are the APIs the frontend actually uses:

- `GET /api/tools`
  Returns the full tool catalog from `tools.json`.

- `GET /api/search?q=term`
  Returns filtered tools by searching `name`, `category`, `description`, and legacy `cat`/`desc`.

- `GET /api/tools/:id`
  Returns one tool by its `id`.

- `POST /api/signup`
  Creates a new user after hashing the password.

- `POST /api/login`
  Verifies email/password against MongoDB and bcrypt hash.

- `GET /api/bookmarks?email=user@example.com`
  Returns bookmark IDs for a user.

- `POST /api/bookmarks/toggle`
  Adds or removes a tool ID from the user's bookmarks.

- `GET /api/search/history?email=user@example.com`
  Returns recent searches for the user.

- `POST /api/search/history`
  Inserts a recent search and limits history to 10 items.

- `DELETE /api/search/history`
  Clears the user's stored recent searches.

### 7.2 External services, libraries, and browser APIs used

The project also depends on these external systems:

- MongoDB Atlas
  Used as the persistent cloud database for user records.

- Mongoose
  Used as the ODM layer between Node.js and MongoDB.

- Netlify Functions
  Used to deploy the backend in serverless form.

- `fetch()`
  Browser API used by frontend JavaScript to call backend endpoints.

- Tailwind CDN
  Loaded in HTML pages to provide utility-first styling without a local Tailwind build pipeline.

- Google Fonts
  Used for `Space Grotesk` and `Inter`.

- Material Symbols
  Used for iconography.

- External image URLs
  Tool cards use remote images from services such as Picsum and Unsplash.

### 7.3 What API is not being used

The site does not currently call OpenAI, Gemini, Anthropic, or any other AI model API as part of its own application logic. It lists AI tools, but it does not itself function as an AI chat or inference platform.

## 8. Coding Detail by Major Feature

### 8.1 Search bar implementation

The search bar is implemented in `frontend/index.html` as a text input and dropdown container. The logic is in `frontend/js/main.js`. It works in three layers:

1. Visual input and dropdown shell in HTML.
2. Search event handling and rendering in JavaScript.
3. Query filtering in Express backend routes.

The frontend debounces input by 300ms so it does not send a request on every single keystroke instantly. The backend performs a simple lowercase `includes()` match over the already-loaded tool array. This is fast enough for the current catalog size because `217` entries are small enough to filter in memory.

If you want to improve the search bar later, here are the exact places:

- To change the search UI shell: edit `frontend/index.html`
- To change dropdown behavior or debounce timing: edit `frontend/js/main.js`
- To change search matching logic: edit `backend/src/app.js`
- To add fuzzy search or tags/feature weighting: edit `backend/src/app.js` and optionally enrich `tools.json`

### 8.2 Wave effect in the search bar

The wave effect is not a CSS-only decoration; it is event-driven. In `frontend/js/main.js`, the `mousedown` listener on `searchInput` captures the click position, computes the maximum distance to the screen corners, creates a new `div.liquid-wave`, and appends it to the body. In `frontend/css/style.css`, the class `.liquid-wave` and keyframes `expandFluidWave` determine how that circle scales, blurs, and fades.

If you want to make the wave effect bigger, softer, faster, or more colorful:

- Increase or decrease animation duration in `.liquid-wave`
- Change the gradient colors in the `.liquid-wave` background
- Adjust `backdrop-filter` blur
- Modify the growth curve in `@keyframes expandFluidWave`
- Change the event from `mousedown` to `click` or `focus` in `main.js`

There is also `inject-wave.js`, but the runtime app already has the feature directly coded. For ongoing development, the real source of truth is `frontend/js/main.js` plus `frontend/css/style.css`.

### 8.3 Login page implementation

The login page consists of three coordinated pieces:

- `frontend/login.html`: structure and visuals
- `frontend/js/login.js`: behavior
- `backend/src/routes/authRoutes.js`: validation and password check

The HTML provides the form and feedback box. `login.js` handles loading state, error messaging, response parsing, and redirect. The backend validates the credentials and checks the bcrypt hash. On success, the frontend stores `userEmail` in `localStorage`.

If you want to redesign the login page visually, edit `frontend/login.html` and the inline styles inside that page. If you want to change validation or response behavior, edit `frontend/js/login.js`. If you want to add stronger auth security like tokens or sessions, edit `backend/src/routes/authRoutes.js` and the frontend login handling together.

### 8.4 Signup page implementation

The signup page follows the same layered pattern as login. `signup.html` provides the form, `signup.js` performs immediate validation, and `authRoutes.js` hashes the password and writes the user record. This split is important because client-side checks improve user experience, while server-side checks are the real source of trust.

### 8.5 Theme toggle implementation

The theme system is a nice example of separation of concerns. JavaScript only toggles one class and stores one preference key. CSS handles the real styling change through variables. That means the app avoids manually touching each component on theme change.

If you want to add a third theme later, the cleanest route is:

1. Replace the boolean light/dark system with a named theme key.
2. Add a body class such as `theme-sunset`.
3. Define a new variable set in CSS.
4. Update `toggleTheme()` into a more general theme setter.

### 8.6 Bookmark system implementation

Bookmarks are rendered per card in `renderToolCard()`. The card checks whether the tool ID is present in `savedTools`, and then sets the Material Symbol fill accordingly. Clicking the bookmark icon calls `toggleSave(id, element)`. That function updates UI first, then optionally syncs to the backend.

This is an optimistic UI pattern: the page feels fast because the icon changes immediately. The tradeoff is that a backend failure could leave UI and server out of sync until refresh. The current code logs such failures to the console.

### 8.7 Search history implementation

Recent search storage only activates for logged-in users. The frontend saves a query when Enter is pressed, and loads history when the empty search bar receives focus. The backend stores those queries in `recentSearches`, moves repeated terms to the top, and caps the array at ten items. This keeps the document small and the UX useful.

## 9. Architecture Diagrams

### 9.1 Whole-project connectivity map

```text
Browser
  |
  |-- loads --> frontend/index.html, login.html, signup.html, terms.html
  |-- loads --> frontend/css/style.css
  |-- loads --> frontend/js/main.js / login.js / signup.js
  |
  |-- fetch /api/tools --------------------------+
  |-- fetch /api/search -------------------------|--> Express app / Netlify function --> tools.json in memory
  |-- fetch /api/login --------------------------|
  |-- fetch /api/signup -------------------------|
  |-- fetch /api/bookmarks ----------------------|--> authRoutes.js --> Mongoose --> MongoDB Atlas
  |-- fetch /api/bookmarks/toggle ---------------|
  |-- fetch /api/search/history -----------------+
  |
  |-- stores local UI state in localStorage:
      theme
      userEmail
```

### 9.2 Deployment architecture

```text
Netlify
  |
  |-- publishes static frontend from: frontend/
  |
  |-- redirect /api/login  --> netlify/functions/login.js
  |-- redirect /api/signup --> netlify/functions/signup.js
  |-- redirect /api/*      --> netlify/functions/api.js
                                   |
                                   --> backend/src/app.js
                                         |
                                         |-- tool routes -> backend/data/tools.json
                                         |-- auth routes -> backend/src/routes/authRoutes.js
                                                             |
                                                             --> backend/src/config/db.js
                                                             --> backend/src/models/User.js
                                                             --> MongoDB Atlas
```

### 9.3 Signup and login sequence

```text
User submits signup form
  -> signup.js validates password/terms
  -> POST /api/signup
  -> authRoutes.js checks duplicate email
  -> bcrypt.hash(password, 10)
  -> User.create(...)
  -> success JSON
  -> redirect to login.html

User submits login form
  -> login.js sends POST /api/login
  -> authRoutes.js finds user by email
  -> bcrypt.compare(password, storedHash)
  -> success JSON
  -> login.js stores localStorage.userEmail
  -> redirect to index.html
```

### 9.4 Search sequence

```text
User clicks search bar
  -> main.js creates .liquid-wave element
  -> style.css animates ripple

User types query
  -> main.js waits 300ms
  -> GET /api/search?q=query
  -> app.js filters tools array
  -> JSON results returned
  -> main.js renders dropdown and searchResultsGrid

User presses Enter
  -> main.js optionally POSTs search history if logged in
  -> page scrolls to results section
```

### 9.5 Bookmark sequence

```text
User clicks bookmark icon
  -> main.js toggleSave()
  -> icon fill changes immediately
  -> if guest: show toast, no persistence
  -> if logged in: POST /api/bookmarks/toggle
  -> authRoutes.js updates bookmarks array in MongoDB
  -> response returns updated bookmarks
```

## 10. Current Implementation Notes and Maintenance Observations

This section is important because it explains the difference between what the project intends to do and what the present code actually does.

There are some legacy fragments in `frontend/js/main.js`. For example, there is an earlier `updateAuthUI()` definition near the top that expects JSON in `localStorage`, but later in the same file there is another `updateAuthUI()` that treats `userEmail` as a plain string. The later function is the effective one because it overwrites the earlier declaration. That tells us the auth UI evolved over time and some old logic was left behind.

Similarly, there are references to elements like `loginBtn`, `searchOverlay`, and `searchContainer` that do not exist in the current `frontend/index.html`. Those branches do not fully activate because the DOM nodes are absent. The site still works because the code checks for null in many places, but this is a sign that the main JS file contains both current and historical implementation layers.

There are also older descriptions in documentation that say guest bookmarks persist in localStorage. The current code does not do that. Guest bookmark state exists only in memory and is lost on page reload.

These are not fatal problems, but they matter if you are extending the codebase. Before large feature additions, `frontend/js/main.js` would benefit from cleanup so the active UI flow is easier to reason about.

## 11. If You Want to Build or Extend the Whole Project

To develop the whole project, the practical workflow is:

1. Configure `.env` with a valid `MONGODB_URI`.
2. Run `npm install`.
3. Start with `npm start` or `Run-AI-Compass.bat`.
4. Open the site through Netlify Dev, usually `http://localhost:8888`.
5. Edit frontend structure in `frontend/*.html`.
6. Edit main interactions in `frontend/js/*.js`.
7. Edit visual design and theme tokens in `frontend/css/style.css`.
8. Edit APIs in `backend/src/app.js` and `backend/src/routes/authRoutes.js`.
9. Edit data shape in `backend/src/models/User.js` and `backend/data/tools.json`.
10. Use `seed_user.js` or `test_db.js` only as helper scripts for development and debugging.

If you want to add a new visual feature, the usual pattern is HTML shell plus CSS styling plus JS event logic. If you want to add a new persistent user feature, the usual pattern is frontend event handler plus `fetch()` plus Express route plus MongoDB schema/document update. If you want to add a new public catalog feature, the usual pattern is editing `tools.json`, then adjusting frontend rendering or backend filtering if needed.

## 12. Final Summary

AI Compass is a visually rich AI tool directory built with vanilla frontend technologies, Express, MongoDB, and Netlify Functions. Public tool data is file-based and fast; private user data is database-backed and mutable. Search, category filtering, and most browsing behavior are client-driven after initial load. Login, signup, bookmarks, and recent searches are backend-supported. Passwords are protected with bcrypt hashing, but user session handling is still lightweight because the frontend stores only the email in localStorage rather than using secure tokens or cookies.

If you want to understand the project as a system, the shortest mental model is this: `frontend/index.html` creates the shell, `frontend/js/main.js` makes it feel like an SPA, `backend/src/app.js` exposes the catalog APIs, `backend/src/routes/authRoutes.js` handles account and personalization logic, `backend/data/tools.json` provides the public directory data, and MongoDB Atlas stores the private user data.
