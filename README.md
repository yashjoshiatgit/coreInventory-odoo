<div align="center">

# 📦 CoreInventory

![CoreInventory](https://img.shields.io/badge/CoreInventory-Inventory%20Management%20System-blue?style=for-the-badge)

**A lightweight inventory and warehouse management system for tracking products, stock movements, and warehouse operations.**

<p align="center">

<a href="https://react.dev/">
<img src="https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
</a>

<a href="https://vitejs.dev/">
<img src="https://img.shields.io/badge/Vite-Frontend-646CFF?style=for-the-badge&logo=vite&logoColor=white"/>
</a>

<a href="https://spring.io/projects/spring-boot">
<img src="https://img.shields.io/badge/SpringBoot-Backend-6DB33F?style=for-the-badge&logo=springboot&logoColor=white"/>
</a>

<a href="https://www.java.com/">
<img src="https://img.shields.io/badge/Java-17+-f89820?style=for-the-badge&logo=java&logoColor=white"/>
</a>

<a href="https://www.postgresql.org/">
<img src="https://img.shields.io/badge/PostgreSQL-Database-316192?style=for-the-badge&logo=postgresql&logoColor=white"/>
</a>

<a href="https://www.docker.com/">
<img src="https://img.shields.io/badge/Docker-Containerization-2496ED?style=for-the-badge&logo=docker&logoColor=white"/>
</a>

<a href="https://jwt.io/">
<img src="https://img.shields.io/badge/JWT-Authentication-black?style=for-the-badge&logo=jsonwebtokens"/>
</a>

<a href="https://spring.io/projects/spring-security">
<img src="https://img.shields.io/badge/Spring_Security-Auth-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white"/>
</a>

</p>

</div>

# 📑 Table of Contents

- 📌 [Project Overview](#project-overview)
- 🏗 [System Architecture](#system-architecture)
- ⚙ [Runtime Topology](#runtime-topology)
- 🧰 [Tech Stack](#tech-stack)
- 📂 [Project Structure](#project-structure)
- 🚀 [Quick Start (Docker)](#quick-start-docker)
- 💻 [Quick Start (Development Mode)](#quick-start-development-mode)
- ⚙ [Backend Architecture](#backend-architecture)
- ⚛ [Frontend Architecture](#frontend-architecture)
- 🗄 [Database Design](#database-design)
- 🔗 [API Endpoints](#api-endpoints)
- 🔐 [Authentication & Roles](#authentication-roles)
- 📊 [Entity Relationship Diagram](#entity-relationship-diagram)
- 🖼 [Screenshots](#screenshots)

---

<a id="project-overview"></a>

# 📌 Project Overview

CoreInventory is a **lightweight inventory and warehouse management platform** designed to manage:

- 📦 **Product Catalog** – maintain and organize product information
- 🔄 **Stock Movements** – track inventory inflow and outflow
- 📍 **Warehouse Locations** – manage storage locations and warehouses
- ✔ **Operation Validation** – verify and approve stock operations
- 📊 **Dashboard Insights** – view analytics and inventory summaries
- 👥 **Role-Based Administration** – manage users and permissions

It supports **Admin and User roles**, where some actions such as **operation validation and settings management are restricted to admins**.

---

<a id="system-architecture"></a>

# 🏗 System Architecture

The application follows a **3-tier architecture**:

```
Frontend (React + Vite)
        │
        ▼
Backend API (Spring Boot)
        │
        ▼
Database (PostgreSQL)
```

Frontend communicates with backend through **REST APIs**, while backend interacts with database using **Spring Data JPA**.

---

<a id="runtime-topology"></a>

# ⚙ Runtime Topology

The system runs three main services using Docker:

```
Frontend (Vite React)
        │
        ▼
Backend (Spring Boot REST API)
        │
        ▼
PostgreSQL Database
```

- Frontend → HTTP requests → Backend  
- Backend → JPA queries → PostgreSQL  

Docker Compose orchestrates all services.

---

<a id="tech-stack"></a>

# 🧰 Tech Stack

## Frontend

- React
- TypeScript
- Vite
- Context API
- Axios

## Backend

- Spring Boot
- Spring Security
- Spring Data JPA
- JWT Authentication

## Database

- PostgreSQL

## DevOps

- Docker
- Docker Compose

---

<a id="project-structure"></a>

# 📂 Project Structure

```
CoreInventory
│
├── backend
│   ├── controllers
│   ├── services
│   ├── repositories
│   ├── models
│   ├── config
│   └── utils
│
├── frontend
│   ├── components
│   ├── pages
│   ├── services
│   ├── context
│   └── layouts
│
├── database
│   └── init.sql
│
└── docker-compose.yml
```

---

<a id="quick-start-docker"></a>

# 🚀 Quick Start (Docker)

### Requirements

- Docker  
- Docker Compose  

### Run the project

```bash
docker compose up --build
```

### Stop containers

```bash
docker compose down -v
```

### Access URLs

Frontend

```
http://localhost:5173
```

Backend API

```
http://localhost:8080
```

---

<a id="quick-start-development-mode"></a>

# 💻 Quick Start (Development Mode)

## Frontend

```bash
cd frontend
npm install
npm run dev
```

## Backend

Requirements:

- Java 17+
- Maven

Run backend:

```bash
cd backend
./mvnw spring-boot:run
```

or

```bash
mvn spring-boot:run
```

---

## Database

Use PostgreSQL and execute schema from:

```
database/init.sql
```

Configure database connection in:

```
backend/src/main/resources/application.properties
```

---

<a id="backend-architecture"></a>

# ⚙ Backend Architecture

The backend follows **layered architecture**:

```
Controller
   │
   ▼
Service
   │
   ▼
Repository
   │
   ▼
Database
```

### Controllers

Expose REST endpoints such as:

- Auth
- Products
- Operations
- Dashboard
- Settings

### Services

Contain **business logic**, such as:

- product management
- stock movement
- validation rules

### Repositories

Spring Data JPA interfaces that interact with the database.

### Models

Main entities include:

- Product
- Category
- Location
- StockDocument
- ProductStock
- ReorderRule
- Contact

---

<a id="frontend-architecture"></a>

# ⚛ Frontend Architecture

Frontend is built using **React + TypeScript**.

### Entry

```
main.tsx
  → App.tsx
      → Pages
```

### Layout

```
layouts/MainLayout.tsx
```

Controls navigation and layout depending on user role.

---

### Authentication Context

```
context/AuthContext.tsx
```

Responsible for:

- storing user
- storing JWT token
- protecting routes

---

### API Layer

```
services/api.ts
```

Handles:

- API requests
- authentication headers
- error handling

---

<a id="database-design"></a>

# 🗄 Database Design

Database is initialized using:

```
database/init.sql
```

It creates and seeds tables for:

- Users
- Roles
- Products
- Categories
- Locations
- Stock
- Reorder Rules
- Stock Documents

---

<a id="entity-relationship-diagram"></a>

# 📊 Entity Relationship Diagram

### ERD

![ER Diagram 1](docs/er1.png)

![ER Diagram 2](docs/er2.png)

![ER Diagram 3](docs/er3.png)


---

<a id="api-endpoints"></a>

# 🔗 API Endpoints

## Authentication

```
POST /auth/login
POST /auth/signup
```

---

## Dashboard

```
GET /dashboard/summary
GET /operations
```

---

## Operations

```
GET /operations
POST /operations
PUT /operations/{id}
POST /operations/{id}/validate
```

(Admin only)

---

## Products

```
GET /products
POST /products
GET /categories
GET /locations
```

---

<a id="authentication-roles"></a>

# 🔐 Authentication & Roles

Authentication uses **JWT tokens**.

### Flow

```
User Login
   │
   ▼
Backend generates JWT
   │
   ▼
Frontend stores token (localStorage)
   │
   ▼
Token attached to API requests
```

### Roles

| Role | Permissions |
|-----|-------------|
Admin | Validate operations, manage settings |
User | View products, create operations |


---

<a id="screenshots"></a>

# 🖼 Screenshots

### Dashboard

![Dashboard](docs/dashboard.png)

---

### Products

![Products](docs/products.png)

---

### Operations

![Operations](docs/operations.png)

---