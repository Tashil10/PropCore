# PropCore

A **property management demo** with a NestJS API and a React frontend. It manages properties, leases (stored as extracted terms), and maintenance requests, with **AI-powered maintenance triage** and **semantic property search** using Google Gemini.

---

## What it does

- **Properties** – Create and list properties with address, description, and amenities. Each property can have multiple leases and maintenance requests.
- **Leases** – Attach leases to a property with **extracted terms** (rent, deposit, dates, etc.) stored as JSON. No PDF upload in this demo; terms are entered or imported as structured data.
- **Maintenance** – Submit free-text maintenance requests per property. **Gemini** classifies each request into **urgency** (low / medium / high) and **category** (plumbing, electrical, appliances, structural, general). Requests are stored with this triage so you can prioritise and filter.
- **Semantic search** – Property descriptions and amenities are embedded with Gemini. The **Search** page finds properties by meaning (e.g. “garden”, “parking”, “river view”) using vector similarity, not just keyword match.
- **Demo data** – On first run, if the database has no properties, the API seeds **100+ sample properties** (with one lease and one maintenance request each) across UK cities so the app showcases search and triage at scale. After that, all data is treated as real; no automatic wipe or re-seed.

---

## Tech stack

| Layer      | Tech |
|-----------|------|
| **API**   | NestJS 11, TypeScript, Mongoose, MongoDB |
| **AI**    | Google Gemini (text generation for triage, embeddings for semantic search) |
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS, React Router |
| **Run**   | Docker, Docker Compose (API + MongoDB) |

- **API:** REST + Swagger at `/api`. Validation via `class-validator`. Optional embeddings on property create/update for search.
- **Frontend:** SPA with property list, property detail (leases + maintenance), semantic search, and forms to add property / lease / maintenance. UI uses a “liquid glass” style (blur, semi-transparent panels, Inter font, accent `#0066cc`).

---

## Prerequisites

- **Node.js** 20+
- **Docker** and **Docker Compose** (for running the API and MongoDB together)
- **Google Gemini API key** (for maintenance triage and semantic search): [Get one](https://aistudio.google.com/apikey)

---

## How to run

### 1. Clone and env

```bash
cd propcore-api
cp .env.example .env
```

Edit `.env` and set:

- **`GEMINI_API_KEY`** – required for triage and semantic search. Without it, maintenance requests are saved with default urgency/category and semantic search won’t find by meaning.
- **`MONGODB_URI`** – leave as `mongodb://mongo:27017/propcore` when using Docker Compose below.

### 2. Run API + MongoDB with Docker

```bash
docker compose up -d --build
```

- API: **http://localhost:3000**
- Swagger: **http://localhost:3000/api**
- Health: **http://localhost:3000/health** (returns `{ "status": "ok" }`)

On first start with an empty DB, the API seeds 4 properties with leases and maintenance. Later runs do not re-seed.

### 3. Run the frontend

```bash
cd frontend
cp .env.example .env
# Edit .env if needed: VITE_API_URL=http://localhost:3000
npm install
npm run dev
```

Open the URL Vite prints (e.g. **http://localhost:5173**). You should see the property list; click a property for leases and maintenance, and use **Search** for semantic search.

### 4. (Optional) Run API locally without Docker

Use a local or remote MongoDB and run the API with Node:

```bash
# Start only MongoDB with Docker (optional)
docker compose up -d mongo

# In .env set MONGODB_URI=mongodb://localhost:27017/propcore
npm install
npm run start:dev
```

Then run the frontend as in step 3.

---

## Environment variables

### API (root `.env`)

| Variable        | Description |
|----------------|-------------|
| `MONGODB_URI`  | MongoDB connection string (e.g. `mongodb://mongo:27017/propcore` for Docker). |
| `GEMINI_API_KEY` | Google Gemini API key for triage and embeddings. |
| `PORT`         | Server port (default `3000`). |
| `CORS_ORIGIN`  | Comma-separated allowed origins in production (e.g. `https://myapp.vercel.app`). Leave unset in dev to allow any origin. |

### Frontend (`frontend/.env`)

| Variable        | Description |
|----------------|-------------|
| `VITE_API_URL` | API base URL (e.g. `http://localhost:3000` in dev, or your deployed API URL in production). |

---

## Going live / production

### API

1. Set **`MONGODB_URI`** to your production MongoDB (e.g. Atlas).
2. Set **`GEMINI_API_KEY`**.
3. Set **`CORS_ORIGIN`** to your frontend URL(s), e.g. `https://your-app.vercel.app`. Multiple origins: comma-separated.
4. Build and run:
   ```bash
   npm run build
   npm run start:prod
   ```
   Or deploy the Docker image (e.g. build from the repo root and run with the same env vars). Expose port `3000` and use `/health` for health checks.

### Frontend

1. Set **`VITE_API_URL`** to your deployed API URL (e.g. `https://api.yourapp.com`).
2. Build:
   ```bash
   cd frontend
   npm run build
   ```
3. Deploy the **`frontend/dist`** folder to a static host (Vercel, Netlify, Cloudflare Pages, etc.). The app is a SPA; point all routes to `index.html` if required.

After deployment, set **`CORS_ORIGIN`** on the API to your frontend origin so the browser allows requests.

---

## Project layout

```
propcore-api/
├── src/                    # NestJS API
│   ├── main.ts              # Bootstrap, CORS, Swagger, port
│   ├── app.module.ts
│   ├── properties/          # Properties CRUD, search (embeddings)
│   ├── leases/              # Leases per property (extracted terms)
│   ├── maintenance/         # Maintenance requests + Gemini triage
│   ├── seed/                # Auto-seed when DB is empty
│   └── common/              # Gemini service (embed, generate)
├── frontend/                # React SPA
│   ├── src/
│   │   ├── api.ts           # API client
│   │   ├── pages/           # PropertyList, PropertyDetail, Search
│   │   └── components/     # Layout, forms, Lease/Maintenance sections
│   └── dist/                # Production build output
├── docker-compose.yml       # API + MongoDB
├── .env.example
└── README.md
```

---

## API overview

- **GET /properties** – List properties (optional `limit`, `skip`).
- **POST /properties** – Create property (address, description, amenities). Generates embedding when description is present.
- **GET /properties/:id** – Get one property.
- **POST /properties/search** – Semantic search; body `{ "query": "garden parking" }`.
- **GET /properties/:id/leases** – List leases for a property.
- **POST /properties/:id/leases** – Create lease (body: `extractedTerms`, optional `status`, `originalFileName`).
- **GET /properties/:id/maintenance** – List maintenance requests.
- **POST /properties/:id/maintenance** – Create request (body: `description`); Gemini sets urgency and category.
- **GET /health** – Health check for deployments.

Full request/response shapes and try-it-out: **http://localhost:3000/api** (Swagger).

---

## Testing and deployment (free hosting)

A step-by-step guide to **test locally** and **deploy live for free** (MongoDB Atlas + Render + Vercel) is in **[docs/TEST_AND_DEPLOY.md](docs/TEST_AND_DEPLOY.md)**. It covers:

- Running and testing the app on your machine
- Creating a free MongoDB Atlas cluster
- Deploying the API to Render (free tier)
- Deploying the frontend to Vercel (free tier)
- Setting env vars and CORS so the live app works end-to-end

---

## License

UNLICENSED (private).
