# INDUSENSE AI — Industrial Equipment Health Scoring

A professional Embedded IoT + AI predictive-maintenance demonstration that runs locally in **VS Code on Windows without Docker**.

## Default local architecture

`Python Simulator / ESP32 → HTTP telemetry → FastAPI → SQLite → AI → Health Score → Alerts → WebSocket → React Dashboard`

MQTT + Mosquitto and PostgreSQL remain optional deployment paths.

## Features

- Industrial dark React dashboard
- 0–100 explainable equipment health score
- Temperature, vibration, current, voltage, RPM and pressure telemetry
- Isolation Forest anomaly detection with deterministic fallback
- Alert generation, acknowledgement and resolution
- Historical telemetry and health data
- WebSocket live updates
- SQLite persistence for zero-setup local development
- Python simulator with normal/anomaly/critical/offline modes
- Optional MQTT transport
- ESP32 firmware scaffold
- FastAPI Swagger docs
- VS Code tasks
- GitHub Copilot instructions

## Run in VS Code

1. Open the `INDUSENSE_AI` folder in VS Code.
2. Open PowerShell.
3. Run:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\RUN_LOCAL.ps1
```

4. Open http://localhost:5173
5. Login with `admin@indusense.local` / `Admin@123`.
6. In another terminal:

```powershell
.\.venv\Scripts\Activate.ps1
python simulator\simulator.py --equipment CNC-042 --mode normal
```

Try:

```powershell
python simulator\simulator.py --equipment CNC-042 --mode vibration_anomaly
python simulator\simulator.py --equipment CNC-042 --mode overheating
python simulator\simulator.py --equipment CNC-042 --mode current_anomaly
python simulator\simulator.py --equipment CNC-042 --mode critical
```

## Endpoints

- Dashboard: http://localhost:5173
- API: http://localhost:8000
- Health: http://localhost:8000/health
- Swagger: http://localhost:8000/docs

## Deploy to Vercel

### Frontend-only deployment

1. Import this repository into Vercel and set **Root Directory** to `frontend`.
2. Keep the detected Vite build settings (`npm run build`, output directory
   `dist`) and deploy. `frontend/vercel.json` enables client-side route refreshes.

This publishes the dashboard UI only. Equipment, telemetry, alerts, and other
API-backed data will not load until the FastAPI backend is deployed and
connected; the frontend uses same-origin `/api` requests unless `VITE_API_URL`
is configured for a separately hosted API.

### Full-stack deployment (requires a database)

To deploy the backend with the frontend, set the Vercel project root back to
the repository root. The root `vercel.json` routes both Vercel Services on one
domain. Vercel Services are currently in Beta.

Set the Vercel project's **Root Directory** to the repository root so Vercel
loads `vercel.json` and builds the `frontend/` and `backend/` services
separately. The frontend and API share one origin, so the frontend can call
`/api` directly. If you choose a separate API origin, set `VITE_API_URL` to
that origin and add the frontend origin to `CORS_ORIGINS`.

SQLite files on Vercel are not persistent. Set these environment variables in
Vercel for the production environment:

- `DATABASE_URL`: the provider's PostgreSQL connection URL (`postgresql://`).
- `JWT_SECRET`: a unique random secret, generated locally with
  `python -c "import secrets; print(secrets.token_urlsafe(48))"`.
- `MQTT_ENABLED`: `false` unless a separately reachable MQTT broker is
  configured.
- `VITE_API_URL`: the production app origin when using a separate API; omit it
  for same-origin Services routing.
- `CORS_ORIGINS`: comma-separated allowed frontend origins when using a
  separate API origin.

The API rejects Vercel startup if `DATABASE_URL` is SQLite or `JWT_SECRET` is
a known placeholder. Once deployed, `/health` checks the API and `/docs` opens
Swagger UI. `VITE_API_URL` is only needed when the frontend calls an API on a
different origin; configure that API's `CORS_ORIGINS` accordingly.

This workspace is linked to its Neon production branch. Run `neon deploy` to
refresh the local `.env` values from Neon; the backend reads `DATABASE_URL`
through SQLAlchemy and `psycopg2`. `.env` is local-only and must not be
committed. Neon CLI does not add these values to Vercel automatically, so set
`DATABASE_URL` and a unique `JWT_SECRET` in the Vercel project's environment
settings before deploying the full stack.

## Copilot

See `.github/copilot-instructions.md`. Copilot should preserve the current architecture and use HTTP + SQLite for local work unless you explicitly request MQTT/PostgreSQL.

## AI model

The included Isolation Forest is trained on synthetic normal operating data. It is a demonstration model, not a production-certified predictive-maintenance model. Real industrial deployment requires real machine data, calibration and validation.

## Optional Docker/MQTT/PostgreSQL

`docker-compose.yml` and the ESP32/MQTT materials remain in the repository as an optional deployment path. They are not required for the normal VS Code demo.
