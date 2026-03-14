<div align="center">

# 📦 CoreInventory

![CoreInventory](https://img.shields.io/badge/CoreInventory-Inventory%20Management%20System-blue?style=for-the-badge)

**Lightweight inventory and warehouse management platform for tracking products, stock movements, and warehouse operations.**

<p>

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

---

# 📑 Table of Contents

- 📌 [Project Overview](#project-overview)
- 🏗 [System Architecture](#system-architecture)
- ⚙ [Runtime Topology](#runtime-topology)
- 🧰 [Tech Stack](#tech-stack)
- 📂 [Project Structure](#project-structure)
- 🚀 [Quick Start](#quick-start)
- ⚙ [Backend Architecture](#backend-architecture)
- ⚛ [Frontend Architecture](#frontend-architecture)
- 🗄 [Database Design](#database-design)
- 🔗 [API Endpoints](#api-endpoints)
- 🔐 [Authentication & Roles](#authentication--roles)
- 📊 [ER Diagram](#er-diagram)
- 🖼 [Screenshots](#screenshots)

---

<a id="project-overview"></a>

# 📌 Project Overview

CoreInventory is a **lightweight inventory and warehouse management system** for managing:

- 📦 Product catalog
- 🔄 Stock movements
- 📍 Warehouse locations
- ✔ Operation validation
- 📊 Dashboard insights
- 👥 Role-based access

The system supports **Admin and User roles**, where administrative actions such as **operation validation and settings management are restricted to admins**.

---

<a id="system-architecture"></a>

# 🏗 System Architecture

CoreInventory follows a **3-tier architecture** separating UI, business logic, and data storage.

```
Frontend (React + Vite)
        │
        ▼
Backend API (Spring Boot)
        │
        ▼
Database (PostgreSQL)
```

- Frontend communicates with backend using **REST APIs**
- Backend interacts with database via **Spring Data JPA**

---

<a id="runtime-topology"></a>

# ⚙ Runtime Topology

Services are orchestrated using **Docker Compose**.

```
Frontend (Vite)
      │
      ▼
Backend (Spring Boot)
      │
      ▼
PostgreSQL
```

- Frontend → HTTP requests → Backend  
- Backend → JPA queries → Database  

---

<a id="tech-stack"></a>

# 🧰 Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Context API
- Axios

### Backend
- Spring Boot
- Spring Security
- Spring Data JPA
- JWT Authentication

### Database
- PostgreSQL

### DevOps
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
│   └── config
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

<a id="quick-start"></a>

# 🚀 Quick Start

## Run with Docker

Requirements:

- Docker
- Docker Compose

Start project:

```bash
docker compose up --build
```

Stop containers:

```bash
docker compose down -v
```

Access:

```
Frontend → http://localhost:5173
Backend → http://localhost:8080
```

---

## Development Mode

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

Requirements:

- Java 17+
- Maven

Run server:

```bash
cd backend
mvn spring-boot:run
```

---

<a id="backend-architecture"></a>

# ⚙ Backend Architecture

Backend follows **layered architecture**:

```
Controller → Service → Repository → Database
```

### Main Entities

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

React application structure:

```
main.tsx
  → App.tsx
      → Pages
      → Components
```

Key modules:

- **AuthContext** – manages authentication & JWT
- **API Service** – centralized API requests
- **Layouts** – role-based navigation

---

<a id="database-design"></a>

# 🗄 Database Design

Database schema and seed data are defined in:

```
database/init.sql
```

Main tables include:

- Users
- Roles
- Products
- Categories
- Locations
- Stock
- ReorderRules
- StockDocuments

---

<a id="api-endpoints"></a>

# 🔗 API Endpoints

### Authentication

```
POST /auth/login
POST /auth/signup
```

### Dashboard

```
GET /dashboard/summary
```

### Operations

```
GET /operations
POST /operations
PUT /operations/{id}
POST /operations/{id}/validate
```

(Admin only validation)

### Products

```
GET /products
POST /products
GET /categories
GET /locations
```

---

<a id="authentication--roles"></a>

# 🔐 Authentication & Roles

Authentication uses **JWT tokens**.

### Flow

```
User Login → JWT Generated → Stored in Frontend → Attached to API Requests
```

| Role | Permissions |
|-----|-------------|
| Admin | Validate operations, manage settings |
| User | View products, create operations |

---

<a id="er-diagram"></a>

# 📊 ER Diagram

![ER Diagram 1](docs/er1.png)

![ER Diagram 2](docs/er2.png)

![ER Diagram 3](docs/er3.png)

---

<a id="screenshots"></a>

# 🖼 Screenshots

### Dashboard
![Dashboard](docs/dashboard.png)

### Products
![Products](docs/products.png)

### Operations
![Operations](docs/operations.png)