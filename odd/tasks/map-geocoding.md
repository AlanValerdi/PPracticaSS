# Feature: real map with cached geocoding and admin correction

## Objective
Replace the fake pins in `/mapa` (`lib/mapPinsOffers.ts`) with real offer locations, geocoded once and cached, with an admin role able to fix wrong or missing pins.

## Why
50 offers / 38 distinct `supervisor_work_address` values, messy text. Volume is tiny, so free Nominatim (1 req/s) is enough when results are cached; the real issue is quality, which needs manual correction.

## Scope
- Repos: `pp-backend` (branch `feat/map-geocoding`), `PPracticaSS` (branch `feat/real-map`).
- Out of scope: paid geocoders, UI for promoting admins.

## Constraints
- Nominatim usage policy: max 1 req/s, identifying User-Agent, no bulk re-querying (cache everything).
- Never overwrite `manual` pins automatically.
- TDD: strict (session config). Backend runner: pytest (via `uv run pytest`, or inside the api container). Frontend runner: `node --test tests/*.test.mjs`.
- Delivery strategy: ask-on-risk; forecast > 400 lines → one PR per repo.

## Tasks
- [x] T1 (delegated: writer trigger, 2+ non-trivial files) Backend: migration `geocoded_addresses` + `users.role`; address normalization; Nominatim client + job; `require_admin_user`; endpoints `GET /api/v1/map/pins`, `GET/PUT /api/v1/admin/geocoding`, `POST /api/v1/geocoding/runs`; pytest.
- [x] T2 (inline) Run geocoding job on restored data; record ok/not_found counts.
- [x] T3 (delegated: writer trigger) Frontend: `/mapa` from `/map/pins`, delete `mapPinsOffers.ts`; `/admin/ubicaciones` page; admin guard in proxy + server; sidebar admin link by role; regenerate `lib/api-types.d.ts`; node tests.
- [ ] T4 (inline) End-to-end verification and PRs.

## Acceptance criteria
- `/mapa` shows only real pins (`ok|manual`).
- Admin can set lat/lng for an address; pin moves; job reruns do not overwrite it.
- Non-admin gets 403 on admin API and is redirected from `/admin/*`.

## Progress / evidence
- T1: pp-backend debc1ff, 1262503 (postal-code fallback, status approximate, precision field), 67b8eec (postal code alone). pytest 141 passed. Assessed tier: not run (RDD not enabled).
- T2: run 1 ok=5 not_found=33; after fallback ok=5 approximate=16 not_found=17 -> 30 pins, all inside Puebla/CDMX bbox. Remaining 17 have no CP or are not addresses -> admin.
- T3: delegated writer. RED: new tests failed with ERR_MODULE_NOT_FOUND (map-pins, nav-visibility) and /admin protected-path assertion; GREEN: node --test 16 pass. tsc clean; lint = known baseline (2 errors, 1 warning). /mapa 200 with 30 pins in payload (5 exact, 25 approximate); /admin/ubicaciones without cookie 307 -> /login. api-types regenerated; areaSelected and saved-offer areaSlug query were re-added by hand (running backend lacks them). Admin flow (needs logged-in admin) not verified.

## Next step
T4 end-to-end verification (admin flow manual) and PRs.
