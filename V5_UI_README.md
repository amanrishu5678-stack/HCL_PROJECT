# INDUSENSE UI V5 — Motion Studio

This version is a full visual redesign of the React frontend only. The FastAPI backend, AI model, SQLite data, simulator and API contracts are preserved.

## Visual direction
- animated lava/aurora background layers
- animated AI reactor core
- animated fleet radar sweep and live nodes
- animated waveform/area/line charts using Recharts
- animated health distribution donut
- animated sensor risk radar
- animated incident stream
- animated asset matrix and micro-sparklines
- animated scanlines, glow, pulses and data-fabric effects
- responsive industrial command/deck aesthetic

## Apply to an existing Windows project
Replace only:
- `frontend/src/App.tsx`
- `frontend/src/styles.css`

Then from `frontend`:

```cmd
npm run dev
```

The current backend continues to run on port 8000.
