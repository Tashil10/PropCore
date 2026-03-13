# PropCore: How to test and deploy for free

This guide walks you through **testing PropCore locally** and then **hosting it live** using free tiers: **MongoDB Atlas**, **Render** (API), and **Vercel** (frontend).

---

## Part 1: Test locally

### 1.1 Prerequisites

- **Node.js 20+** and **npm**
- **Docker** and **Docker Compose** (for API + MongoDB)
- **Google Gemini API key** from [Google AI Studio](https://aistudio.google.com/apikey)

### 1.2 Clone and env

```bash
cd propcore-api
cp .env.example .env
```

Edit `.env`:

- **`GEMINI_API_KEY`** – paste your key (needed for maintenance triage and semantic search).
- **`MONGODB_URI`** – leave as `mongodb://mongo:27017/propcore` when using Docker.

### 1.3 Start API + MongoDB

```bash
docker compose up -d --build
```

- First run seeds **100+ properties** (with 1 lease and 1 maintenance each). This can take **2–5 minutes** while Gemini triages maintenance requests.
- API: **http://localhost:3000**
- Swagger: **http://localhost:3000/api**
- Health: **http://localhost:3000/health** → `{"status":"ok"}`

### 1.4 Start the frontend

```bash
cd frontend
cp .env.example .env
# .env: VITE_API_URL=http://localhost:3000
npm install
npm run dev
```

Open the URL Vite prints (e.g. **http://localhost:5173**).

### 1.5 What to test

| Step | What to do | What to check |
|------|------------|----------------|
| 1 | Open **Properties** | List shows many properties (scroll; 100+ seeded). |
| 2 | Click a property | Detail page shows address, amenities, **Leases** (1 per property), **Maintenance** (1 per property with urgency/category). |
| 3 | **Search** | Try “garden”, “parking”, “river view”, “gym”, “balcony”. Results match meaning. |
| 4 | **Add property** | Create a new property; it appears in the list. |
| 5 | **Add lease** (on a property) | Add lease with JSON terms; it appears in Leases. |
| 6 | **Add maintenance** (on a property) | Submit a description; after a moment it appears with AI-set urgency and category. |

If anything fails, check: API is running (`docker compose ps`), `GEMINI_API_KEY` is set, and frontend `.env` has `VITE_API_URL=http://localhost:3000`.

---

## Part 2: Deploy for free (live)

You’ll use:

- **MongoDB Atlas** (free M0 cluster) – database
- **Render** (free tier) – API
- **Vercel** (free tier) – frontend

### 2.1 MongoDB Atlas (database)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and sign up / log in.
2. Create a **free M0 cluster** (e.g. AWS, region nearest you). Wait until it’s ready.
3. **Database Access** → Add Database User (username + password). Note the password.
4. **Network Access** → Add IP Address → **Allow Access from Anywhere** (`0.0.0.0/0`) for simplicity (or add Render’s IPs if you prefer).
5. **Database** → Connect → **Drivers** → copy the connection string. It looks like:
   `mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
6. Replace `USER` and `PASSWORD` with your DB user. Add a database name:
   `mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/propcore?retryWrites=true&w=majority`
7. Save this as **`MONGODB_URI`** for the API (e.g. in Render env).

### 2.2 Render (API)

1. Go to [render.com](https://render.com) and sign up (GitHub is easiest).
2. **New** → **Web Service**.
3. Connect your GitHub repo that contains **propcore-api** (root = repo root with `package.json`, `docker-compose` not required for Render).
4. Settings:
   - **Build command:** `npm install && npm run build`
   - **Start command:** `npm run start:prod`
   - **Environment:** Add variables:
     - `MONGODB_URI` = your Atlas URI (from 2.1)
     - `GEMINI_API_KEY` = your Gemini key
     - `CORS_ORIGIN` = your frontend URL (you’ll set this after Vercel; e.g. `https://your-app.vercel.app`)
     - `PORT` = `3000` (Render sets this; you can leave it)
5. Create Web Service. Render will build and run the API. Note the URL (e.g. `https://propcore-api.onrender.com`).
6. **First deploy:** With an empty Atlas database, the API will seed 100+ properties on startup. The first request may be slow; health check: `https://your-api.onrender.com/health`.
7. After you deploy the frontend (next step), go back to Render → Environment → set **`CORS_ORIGIN`** to your Vercel URL (e.g. `https://propcore-xxx.vercel.app`) and save (redeploy if needed).

### 2.3 Vercel (frontend)

1. Go to [vercel.com](https://vercel.com) and sign up (GitHub is easiest).
2. **Add New** → **Project** → import the same repo.
3. **Root Directory:** set to **`frontend`** (the folder that has `package.json` and `vite.config` for the React app).
4. **Build command:** `npm run build`
5. **Output directory:** `dist`
6. **Environment variables:**
   - `VITE_API_URL` = your Render API URL (e.g. `https://propcore-api.onrender.com`)
7. Deploy. Vercel will give you a URL (e.g. `https://propcore-xxx.vercel.app`).
8. Open that URL: you should see PropCore and the property list (from Atlas). If you get CORS errors, set **`CORS_ORIGIN`** on Render to this Vercel URL and redeploy the API.

### 2.4 Go live checklist

- [ ] Atlas: cluster running, user created, `MONGODB_URI` in Render.
- [ ] Render: API env has `MONGODB_URI`, `GEMINI_API_KEY`, `CORS_ORIGIN` = Vercel URL. Health: `https://your-api.onrender.com/health`.
- [ ] Vercel: `VITE_API_URL` = Render API URL. Root = `frontend`, build = `npm run build`, output = `dist`.
- [ ] Open Vercel URL: list loads, search works, add property/lease/maintenance works.

### 2.5 Free tier limits (summary)

- **MongoDB Atlas:** 512 MB storage, shared cluster; enough for this demo.
- **Render (free):** Service may sleep after inactivity; first request after sleep can be slow. No custom domain on free tier (optional upgrade).
- **Vercel:** Generous bandwidth and builds for personal/side projects.

---

## Part 3: Optional – run API without Docker locally

If you don’t want Docker for the API:

1. Use **MongoDB Atlas** (step 2.1) and set `MONGODB_URI` in `.env` to your Atlas URI.
2. In repo root: `npm install && npm run start:dev`.
3. Run the frontend as in 1.4 with `VITE_API_URL=http://localhost:3000`.

---

## Troubleshooting

| Issue | What to do |
|-------|------------|
| “Cannot GET/POST …” or 404 | API not running or wrong URL. Check Render dashboard and `VITE_API_URL`. |
| CORS errors in browser | Set `CORS_ORIGIN` on the API to the exact frontend origin (e.g. `https://propcore-xxx.vercel.app`). No trailing slash. |
| Empty list or “Failed to fetch” | Check API health URL. If using Atlas, ensure IP allowlist includes Render (or 0.0.0.0/0). |
| Search returns nothing | Ensure `GEMINI_API_KEY` is set; embeddings are created when properties are created. Seed creates them; if you added properties before setting the key, re-seed (fresh DB) or add new properties. |
| Seed takes a long time | Normal on first start: 100+ properties + 100+ maintenance (each calls Gemini). Wait 2–5 minutes. |

You’re done: PropCore is tested locally and deployed live for free.
