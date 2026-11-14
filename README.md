# NASA Probes Museum

Educational website about NASA probes (active and retired), the missions they flew, their hardware, and a
small game where you build a probe and see how long it would survive in the conditions of a real mission.

The site is available in English, Portuguese, Spanish and French, and has accessibility features for
deaf users (Libras via VLibras) and blind users (audio narration).

## Project structure

```
frontend/        React + Vite (port 5173)
backend/         ASP.NET Core 10 API (port 5000) - data, simulation, narration
api-1-vlibras/   ASP.NET Core 10 (port 5001) - Portuguese -> Libras gloss (VLibras)
api-2-speech/    ASP.NET Core 10 (port 5002) - text-to-speech
docs/            VLibras swagger
```

The frontend only talks to the backend. The backend calls api-1 and api-2.

## Running

Needs .NET 10 SDK and Node 20+.

```bash
dotnet run --project backend
dotnet run --project api-1-vlibras
dotnet run --project api-2-speech
cd frontend && npm install && npm run dev
```

Open http://localhost:5173. API docs: http://localhost:5000/scalar

### API keys

The speech API key is not in the repo. Set it with user-secrets:

```bash
dotnet user-secrets set "Speech:Knowlez:Key" "<key>" --project api-2-speech
```

(on a server use the env var `Speech__Knowlez__Key`). Without a key, api-2 falls back to the Windows voices.

## Languages

- UI strings: `frontend/src/i18n/locales/*.json`
- Probe/hardware content: `backend/Data/*.json` (each text has `en`, `pt`, `es`, `fr`)
- Simulation messages and narration: `backend/Localization/Messages.cs`
- The API picks the language from `?lang=` or `Accept-Language` (default `en`). The frontend always sends `lang`.

## Backend endpoints

| Method | Route | |
|---|---|---|
| GET | `/api/health` | status of backend + api-1 + api-2 |
| GET | `/api/probes` | list (filters: `destination`, `status`, `type`, `search`) |
| GET | `/api/probes/{id}` | probe details |
| GET | `/api/probes/{id}/hardware` | real hardware of the probe |
| GET | `/api/missions` | missions |
| GET | `/api/missions/environments` | Moon / Mars conditions |
| GET | `/api/hardware`, `/api/hardware/by-category` | game parts |
| POST | `/api/simulation` | run the game |
| GET | `/api/simulation/{probeId}/original` | run with the real hardware |
| POST | `/api/libras/translate` | Portuguese text -> Libras gloss |
| GET | `/api/libras/probes/{id}` | Libras gloss for a probe |
| GET | `/api/audio/probes/{id}` | narration audio (`/text` for the text only) |
| POST | `/api/audio/simulation` | simulation result as audio (`/text` for the text only) |
| POST | `/api/audio/speak` | read any text |

Simulation request example:

```json
{ "probeId": "opportunity", "components": { "Power": "mmrtg", "Thermal": "rhu" } }
```

Categories: Power, Storage, Thermal, Mobility, Communication, Computer. Anything not sent uses the real
hardware of the probe. The model covers power (solar/RTG/batteries), day-night cycles, temperature, dust,
dust storms, radiation, wear and communication. Values are simplified for teaching, not real engineering.

## Data

- `backend/Data/probes.json` - probes from our research document (sources: NASA / NSSDCA)
- `backend/Data/components.json` - parts for the game

Still missing: source links, images and image descriptions.

## Accessibility notes

**Libras (api-1):** uses `POST https://traducao2.vlibras.gov.br/translate` with `{"text": "..."}`. It needs a
`User-Agent` header or it returns 403. VLibras only translates Portuguese, so the backend always sends the
Portuguese text. Video and `/signs` endpoints need a Conecta gov.br token (`VLibras:Token`).

**Speech (api-2):** gov.br doesn't have a TTS API, so we use external/local engines, in this order:

1. Knowlez TTS (https://api-tts.knowlez.com/docs) - all 4 languages. Trial plan: 50 requests total, until
   2026-12-14. Check usage at http://localhost:5002/api/usage
2. Azure Speech - optional, only if `Speech:Azure:Key` is set
3. Windows voices - offline, only the languages installed on the machine

Audio is cached in `api-2-speech/audio-cache/` (ignored by git), so each text is only generated once.
Don't delete this folder or it will spend the trial requests again. If no engine works, the backend
returns 502 with the text and the frontend reads it with the browser voice (`speakInBrowser`).
