# CoreInventory

Lightweight inventory and warehouse management stack: React/Vite frontend, Spring Boot backend, PostgreSQL database. Run locally with Docker or start services separately for dev.

## Quick start (Docker)
- Requirements: Docker + docker compose
- From repo root:
	- Build & run: `docker compose up --build`
	- Stop & clean: `docker compose down -v`
- Frontend: http://localhost:5173 (proxied to backend)
- Backend API: http://localhost:8080

## Quick start (dev mode)
Frontend
- `cd frontend`
- Install deps: `npm install`
- Run dev server: `npm run dev`

Backend
- `cd backend`
- Java 17+, Maven
- Run: `./mvnw spring-boot:run` (or `mvn spring-boot:run`)

Database
- PostgreSQL with schema/seed from `database/init.sql`
- Configure connection in `backend/src/main/resources/application.properties`

## Architecture at a glance
- Frontend: React + TypeScript (Vite). Auth context manages JWT; pages fetch via `src/services/api.ts`.
- Backend: Spring Boot (REST). Controllers -> Services -> Repositories (JPA) -> Postgres. Security config handles auth/roles.
- Database: Postgres seeded with products, locations, stock documents, reorder rules.

## Directory hints
```
backend/        Spring Boot app (controllers, services, models, repos, config)
frontend/       React/Vite client (pages, components, auth context, API client)
database/       init.sql seed + schema
docker-compose.yml  Orchestrates frontend, backend, and Postgres
``` 

## Key endpoints
- Auth: `/auth/login`, `/auth/signup`
- Dashboard: `/dashboard/summary`, `/operations`
- Operations: `/operations`, `/operations/{id}/validate` (admin)
- Products: `/products`, `/categories`, `/locations`

## Notes
- Default admin/user seeds are in `database/init.sql`.
- Role-based UI hides admin-only actions for non-admin users.
