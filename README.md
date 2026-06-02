# Armenian Handwriting Recognition — Frontend

React + TypeScript + TailwindCSS + shadcn/ui single-page app that uploads a
handwritten Armenian word image to the backend and shows the predicted word,
confidence and inference time. Importable into **Lovable**.

## Tech stack

- **Vite** + **React 18** + **TypeScript**
- **TailwindCSS** with CSS variables (light/dark theme)
- **shadcn/ui** primitives (`Button`, `Card`, `Progress`) + **lucide-react** icons

## Project structure

```
frontend/
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── components.json            # shadcn/ui config
├── .env.example               # VITE_API_URL
└── src/
    ├── main.tsx               # entry point
    ├── App.tsx                # root component
    ├── index.css              # Tailwind + theme tokens
    ├── lib/utils.ts           # cn() class merger
    ├── types/index.ts         # shared types + ApiError
    ├── services/api.ts        # backend client (predict, health)
    ├── hooks/
    │   ├── usePrediction.ts   # predict request lifecycle
    │   └── useTheme.ts        # dark-mode toggle + persistence
    ├── components/
    │   ├── ImageUpload.tsx    # drag & drop + file picker + preview
    │   ├── PredictionResult.tsx
    │   ├── ThemeToggle.tsx
    │   └── ui/                # shadcn primitives
    └── pages/Home.tsx         # main page
```

## Getting started

```bash
cd frontend
cp .env.example .env          # set VITE_API_URL to your backend
npm install
npm run dev                   # http://localhost:5173
```

Build for production:

```bash
npm run build && npm run preview
```

## Environment variables

| Variable       | Description                                            |
|----------------|--------------------------------------------------------|
| `VITE_API_URL` | Base URL of the backend (HF Space), e.g. `https://user-space.hf.space`. No trailing slash. |

## Features

- **Upload**: drag & drop, file picker, live image preview, client-side
  type/size validation.
- **Prediction**: predicted Armenian word, confidence bar, inference time, and
  top-k alternatives.
- **UX**: responsive (mobile → desktop), dark mode (persisted), loading
  spinners/animations, and friendly error handling (timeouts, network errors,
  backend 4xx/5xx).

## Importing into Lovable

See the repository root `docs/DEPLOYMENT.md` → "Lovable" section. In short:
create a Lovable project, import this `frontend/` folder, set the `VITE_API_URL`
environment variable to your Hugging Face Space URL, and run.
