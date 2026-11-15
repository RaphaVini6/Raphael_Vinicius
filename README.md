# Spacy Legacy

Educational website about the NASA probes and equipment that are still on the Moon, on Mars and in deep space.
For each one you can see what it did, where it is and how its parts could be reused by future missions. There is
also a small game: you pick a real mission, build a probe and see how long it would survive.

The site is in English, Portuguese, Spanish and French, and has accessibility features for deaf users (Libras)
and blind users (audio narration).

## What's in the site

| Page | What it does |
|---|---|
| Home | intro, numbers of the collection, the three destinations (Moon, Mars, deep space) and highlights |
| Exhibits | the 27 artifacts with filters by destination, status, type and a search box |
| Artifact page | data, scientific goal, how it could be reused, location map, diagrams, NASA source link, audio narration and Libras |
| Missions | timeline of the missions, from Surveyor 3 (1967) to Perseverance |
| Simulator | pick a mission, choose the hardware (power, battery, insulation, wheels, radio, computer) and launch |
| Learn | historical precedents, a 3-phase teaching method, payload savings calculator and mobile robotics basics |

Accessibility menu (top right): high contrast, text size, reduce motion and the VLibras widget.

## Project structure

```
frontend/        React 19 + Vite
backend/         ASP.NET Core 10 API - data, simulation and narration
api-1-vlibras/   ASP.NET Core 10 - Portuguese text -> Libras gloss (VLibras)
api-2-speech/    ASP.NET Core 10 - text-to-speech
docs/            VLibras swagger
```

The frontend only talks to the backend; the backend calls `api-1-vlibras` and `api-2-speech`.

| Service | Local port | Docker port |
|---|---|---|
| frontend | 5173 | 8080 |
| backend | 5000 | 5050 |
| api-1-vlibras | 5001 | internal only |
| api-2-speech | 5002 | internal only |

## Getting started

```bash
git clone https://github.com/RaphaVini6/Spacy-Legacy-Nasa-Hackathon.git
cd Spacy-Legacy-Nasa-Hackathon
cp .env.example .env
```

Then open `.env` and fill in `Speech__Knowlez__Key` (ask the team for it - it is never committed).
Everything else in `.env.example` already works for local development.

You can run the project in two ways: with Docker (easiest) or directly with .NET and Node.

### Option 1: Docker

Needs [Docker Desktop](https://www.docker.com/products/docker-desktop/). On Windows it also needs WSL 2:
run `wsl --install` in PowerShell as administrator and restart the computer.

```bash
docker compose up -d --build
```

- Website: http://localhost:8080
- API docs: http://localhost:5050/scalar

The first build takes a few minutes. When it is ready, `docker compose ps` shows the four services as `healthy`.

Useful commands:

```bash
docker compose ps                 # status
docker compose logs -f backend    # logs of one service
docker compose down               # stop everything (keeps the audio cache)
docker compose up -d --build      # rebuild after pulling new code
```

Homologation / production (backend port closed, `ASPNETCORE_ENVIRONMENT=Production`, always restart):

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

### Option 2: .NET + Node

Needs the .NET 10 SDK and Node 20+. Open four terminals in the project folder:

```bash
dotnet run --project backend
dotnet run --project api-1-vlibras
dotnet run --project api-2-speech
cd frontend && npm install && npm run dev
```

- Website: http://localhost:5173
- API docs: http://localhost:5000/scalar

Frontend scripts: `npm run dev`, `npm run build`, `npm run lint`.

## Configuration (.env)

All settings live in one `.env` file in the project root. It is read by the three .NET projects, by Vite and by
Docker Compose. `.env` is ignored by git; `.env.example` lists every option with comments.

| Variable | Used by | What it is |
|---|---|---|
| `ASPNETCORE_ENVIRONMENT` | .NET | `Development` shows the API docs at `/scalar` |
| `FRONTEND_PORT`, `BACKEND_PORT` | Docker | ports on your machine (8080 and 5050) |
| `Speech__Knowlez__Key` | api-2-speech | key of the speech service (ask the team) |
| `Speech__Azure__Key`, `Speech__Azure__Region` | api-2-speech | optional second speech engine |
| `VLibras__Token` | api-1-vlibras | optional, only for VLibras video endpoints |
| `VITE_API_URL` | frontend | leave empty (Vite proxies `/api` to the backend) |

.NET settings use `__` for nesting: `Speech__Knowlez__Key` is `Speech:Knowlez:Key` in `appsettings.json`.
Real environment variables always win over the `.env` file.

## Branches and workflow

| Branch | Use |
|---|---|
| `master` | stable code |
| `dev` | development - start your branches from here |
| `homologa` | staging, tested before release |
| `prod` | what is deployed |

1. Create a branch from `dev`: `feature/<name>` for new things, `fix/<name>` for corrections.
2. Commit and push your branch.
3. Open a pull request to `dev`. It needs approval from @RaphaVini6 (see `.github/CODEOWNERS`).

Flow: `feature/*` -> `dev` -> `homologa` -> `prod`, and `prod` -> `master`.

## Languages

- Interface texts: `frontend/src/i18n/locales/{en,pt,es,fr}.json`
- Artifacts, parts and teaching content: `backend/Data/*.json` (each text has `en`, `pt`, `es`, `fr`)
- Simulation messages and narration: `backend/Localization/Messages.cs`

The API answers in the language of `?lang=` or the `Accept-Language` header (default `en`). The frontend
always sends `lang`.

## API

| Method | Route | |
|---|---|---|
| GET | `/api/health` | status of the backend and the two APIs |
| GET | `/api/probes` | list (filters: `destination`, `status`, `type`, `search`) |
| GET | `/api/probes/{id}` | artifact details |
| GET | `/api/probes/{id}/hardware` | real hardware of the artifact |
| GET | `/api/missions` | missions |
| GET | `/api/missions/environments` | Moon and Mars conditions |
| GET | `/api/learn` | teaching content |
| GET | `/api/learn/robotics-cases` | artifacts with a classroom robotics application |
| GET | `/api/hardware`, `/api/hardware/by-category` | game parts |
| POST | `/api/simulation` | run the game |
| GET | `/api/simulation/{probeId}/original` | run the game with the real hardware |
| POST | `/api/libras/translate` | Portuguese text -> Libras gloss |
| GET | `/api/libras/probes/{id}` | Libras gloss of an artifact |
| GET | `/api/audio/probes/{id}` | narration audio (`/text` for the text only) |
| POST | `/api/audio/simulation` | simulation result as audio (`/text` for the text only) |
| POST | `/api/audio/speak` | read any text aloud |

Simulation request:

```json
{ "probeId": "opportunity", "components": { "Power": "mmrtg", "Thermal": "rhu" } }
```

Categories are Power, Storage, Thermal, Mobility, Communication and Computer. Anything not sent uses the real
hardware of the probe. The model covers power (solar, nuclear, batteries), day and night, temperature, dust,
dust storms, radiation, wear and communication. Values are simplified for teaching, not real engineering.

## Data

- `backend/Data/probes.moon.json`, `probes.mars.json`, `probes.deep-space.json` - the 27 artifacts from our
  research document (NASA / NSSDCA), each with a link to its NSSDCA catalog entry
- `backend/Data/components.json` - parts for the game
- `backend/Data/learn.json` - teaching content
- `frontend/public/images/probes/` - 3D renders made by the team and NASA public domain photos (credited on
  the artifact page)

Only artifacts with a `scenario` (landers, rovers, the helicopter and the ALSEP stations) appear in the simulator.
To add an artifact, add it to the right `probes.*.json` file and restart the backend.

## Accessibility

**Libras (api-1-vlibras).** Uses `POST https://traducao2.vlibras.gov.br/translate` with `{"text": "..."}`, which
works without a token but needs a `User-Agent` header (403 otherwise). VLibras only translates Portuguese, so the
backend always sends the Portuguese text, whatever the site language.

**Audio narration (api-2-speech).** gov.br has no text-to-speech API, so api-2 tries these engines in order:

1. Knowlez TTS (https://api-tts.knowlez.com/docs) - all 4 languages. The trial plan allows 50 requests in total
   and ends on 2026-12-14.
2. Azure Speech - optional, only if `Speech__Azure__Key` is set.
3. Windows voices - only when running outside Docker on Windows, and only for the installed languages.

Every generated audio is cached, so each text spends a request only once. The cache is the `speech-cache`
Docker volume, or `api-2-speech/audio-cache/` when running outside Docker. Don't delete it: `docker compose down -v`
removes the volume. If no engine works, the site reads the text with the browser's own voice.

## Troubleshooting

| Problem | Fix |
|---|---|
| Site is down after restarting the computer | Docker Desktop is closed. Open it, or turn on Settings -> General -> "Start Docker Desktop when you sign in" |
| `port is already allocated` | another program or another copy of the project uses 8080 or 5050. Stop it, or change `FRONTEND_PORT` / `BACKEND_PORT` in `.env` |
| Old containers in Docker Desktop (stopped `frontend` copies) | `docker compose down --remove-orphans` and then `docker compose up -d --build` |
| Audio narration does not play | `Speech__Knowlez__Key` is missing in `.env`, or the trial requests ran out |
| Site opens but the data does not load (error 502) | the backend is still starting or stopped. Check `docker compose ps` and `docker compose logs backend` |
| Changes in the code don't show up in Docker | rebuild: `docker compose up -d --build` |

## Credits

- Artifact data: NASA and the NASA Space Science Data Coordinated Archive (NSSDCA)
- Photos: NASA Image and Video Library (public domain)
- Libras: VLibras, Brazilian government (gov.br)
- Robotics background: Andrade, *Estudo Comparativo Aplicado ao Planejamento e Controle de Trajetórias de Robôs
  Móveis*, Federal University of Ceará (UFC), 2011
