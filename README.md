<img src="Stockfolio%20logo.png" alt="Project Logo" width="300">

### Stockfolio
[![CI Tests](https://github.com/joelvkuos/Ohjelmistoprojekti2/actions/workflows/ci-tests.yml/badge.svg)](https://github.com/joelvkuos/Ohjelmistoprojekti2/actions/workflows/ci-tests.yml)

Team:

- Toom-Kaarel Kiisk
- Joel Kuosmanen
- Samu Kekkonen
- Jani Kinnunen
- Konsta Lyytikäinen

Stockfolio is an project: a web app for creating and browsing stock portfolios and holdings. The frontend is built with **Vite + React + TypeScript**, and the backend is a **Spring Boot (Java)** REST API.

**Live** https://ohjelmistoprojekti2.vercel.app/

---

## Key Features

- User authentication (register/login)
- Create and manage portfolios
- Add holdings to portfolios (ticker + quantity)
- Community view: browse portfolios created by all users
- Stock quote fetching to display current price and portfolio/holding value

---

## Data Model

> Field names may vary slightly in code, but the core structure is:

- **User**
  - `id`
  - `username`
  - (auth fields such as password hash / roles, depending on implementation)

- **Portfolio**
  - `portfolioId`
  - `portfolioName`
  - `user` (owner)
  - `holdings[]`

- **Holding**
  - `holdingsId`
  - `ticker`
  - `quantity`
  - belongs to a `portfolio`

Notes:
- The “Community Portfolios” view lists portfolios from all users and displays holdings.
- Stock prices/changes are fetched separately and are **not** persisted in the database.

---

## Database

The backend persists core data (users, portfolios, holdings) in a database.

- Database engine: PostgreSQL

---

## Development Guide

Project structure:
- `backend/` = Spring Boot API
- `frontend/` = Vite + React app

### Backend (Spring Boot)

Requirements:
- Java (project-dependent, 17 as a minimum version)

Run:
```bash
cd backend
./mvnw spring-boot:run
# or
./gradlew bootRun
```

Backend typically runs at:
- http://localhost:8080

### Frontend (Vite + React)

Requirements:
- Node.js (LTS recommended)

Run:
```bash
cd frontend
npm install
npm run dev
```

Frontend typically runs at:
- http://localhost:5173

## REST API

The REST API has [Swagger documentation](https://stockfolio-postgres-stockfolio-postgres.2.rahtiapp.fi/swagger-ui/index.html) (accessible when the backend server is running).


### Dokumentaatio
[Dokumentaatio](Dokumentaatio.md)
