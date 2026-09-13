# 💰 Salary Management Software

> A modern, full-stack employee salary management platform built for HR Managers to efficiently manage and analyze salary data for 10,000+ employees across multiple countries — replacing tedious Excel-based processes.

---

## 📑 Submission Artifacts

As requested in the assessment guidelines, all thinking, planning, and design documents are included in the repository:

- 📋 [**Product Requirements Document (PRD)**](file:///Users/nilanjan/Projects/salary-management/salary-management/REQUIREMENTS.md) — Goal, scope, core features, deliberate non-goals, and constraints.
- 📐 [**Planning & Design Notes**](file:///Users/nilanjan/Projects/salary-management/salary-management/PLANNING_AND_DESIGN_NOTES.md) — Architecture diagrams, design decisions, trade-offs, performance considerations for 10k records, and intentional AI usage log.

---

## 🚀 Quick Start (One Command)

```bash
docker-compose up -d --build
```

Then open **[http://localhost](http://localhost)** in your browser. The backend will automatically seed 10,000 realistic employee records on first boot.

> **Prerequisites:** Docker and Docker Compose must be installed.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Docker Compose                            │
│                                                              │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐    │
│  │   Frontend    │   │   Backend    │   │  PostgreSQL   │    │
│  │   (Nginx)     │──▶│ (Spring Boot)│──▶│   Database    │    │
│  │   Port 80     │   │  Port 8080   │   │  Port 5432    │    │
│  └──────────────┘   └──────────────┘   └──────────────┘    │
│                                                              │
│  React 19 + Vite   Java 21 + JPA     PostgreSQL 15          │
│  Tailwind CSS v4   REST API           10,000 records         │
│  Three.js          Hibernate 7        Auto-seeded            │
│  Recharts          DataFaker                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## ✨ Features

### 📊 Analytics Dashboard
- **Total Payroll**, **Average Salary**, **Median Salary**, and **Total Employees** — displayed as animated stat cards
- **Average Salary by Department** — horizontal bar chart
- **Average Salary by Country** — vertical bar chart
- **Headcount by Country (Top 10)** — distribution chart
- **Salary Expenditure by Department** — donut chart

### 👥 Employee Directory
- **High-performance paginated table** — handles 10,000 records smoothly via server-side pagination
- **Search** — real-time debounced search by name or job title
- **Sort** — click column headers to sort by Name, Role, Country, or Salary (asc/desc)
- **Filter** — dropdown filters for Country and Department with active filter chips
- **Inline salary editing** — edit directly in the table with validation
- **Employee detail panel** — click any row to view full details in a slide-in modal

### 🎨 Premium UI/UX
- **Three.js animated background** — subtle floating particles and glowing orbs
- **Glassmorphism design** — frosted glass cards with backdrop blur
- **Gradient borders** — animated gradient outlines on hover
- **Dark mode** — toggle with localStorage persistence
- **Skeleton loaders** — shimmer placeholders during data loading
- **Staggered animations** — smooth entrance effects for all elements
- **Animated number counters** — dashboard values count up on load

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript 6, Vite 8, Tailwind CSS v4, Recharts 3, Three.js, Framer Motion |
| **Backend** | Java 21, Spring Boot 4.1.1, Spring Data JPA, Hibernate 7, Jakarta Validation |
| **Database** | PostgreSQL 15, JPA/Hibernate DDL auto-update |
| **Data Seeding** | DataFaker (10,000 realistic records across countries & departments) |
| **Infrastructure** | Docker, Docker Compose, Nginx (reverse proxy) |
| **Testing** | JUnit 5, Mockito |

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/employees?page=0&size=15&sort=salary,desc&search=John&country=USA&department=Engineering&minSalary=50000&maxSalary=150000` | Paginated, sorted, filtered employee list |
| `GET` | `/api/employees/{id}` | Individual employee details |
| `PUT` | `/api/employees/{id}/salary` | Update employee salary (validated) |
| `GET` | `/api/analytics/summary` | Dashboard analytics (total, avg, median, by-country, by-department) |
| `GET` | `/api/filters/countries` | Distinct country list for filter dropdown |
| `GET` | `/api/filters/departments` | Distinct department list for filter dropdown |

---

## 📂 Project Structure

```
salary-management/
├── docker-compose.yml          # Full-stack orchestration
├── REQUIREMENTS.md             # Product requirements document
├── PLANNING_AND_DESIGN_NOTES.md # Architecture, design decisions & trade-offs
│
├── backend/                    # Java Spring Boot API
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/main/java/com/example/salary_management_api/
│       ├── model/              # JPA Entity (Employee)
│       ├── repository/         # Spring Data JPA + custom queries
│       ├── controller/         # REST endpoints
│       ├── dto/                # Response DTOs
│       ├── specification/      # Dynamic query filters (JPA Specification)
│       └── service/            # Database seeder (10k records)
│
└── frontend/                   # React + Vite + TypeScript
    ├── Dockerfile
    ├── nginx.conf              # Reverse proxy config
    └── src/
        ├── components/
        │   ├── Background3D/   # Three.js animated background
        │   ├── Dashboard/      # Analytics dashboard
        │   ├── EmployeeDirectory/ # Data table + filters + modal
        │   └── Layout/         # Shell with nav + dark mode
        └── lib/
            └── api.ts          # Typed API client
```

---

## 🧪 Running Tests

```bash
cd backend
./mvnw test
```

---

## 🔧 Local Development (Without Docker)

```bash
# 1. Start PostgreSQL
docker-compose up -d db

# 2. Start Backend (seeds 10k records automatically)
cd backend && ./mvnw spring-boot:run

# 3. Start Frontend (with hot reload)
cd frontend && npm install && npm run dev
```

Frontend will be available at `http://localhost:5173` (Vite dev server proxies API to `:8080`).

---

## 📋 Design Decisions & Trade-offs

1. **Server-side pagination over virtualization** — Chose Spring Data's paginated queries to keep the frontend lightweight and the database responsible for data slicing. 15 rows per page ensures instant rendering.

2. **JPA Specification for filtering** — Rather than building raw SQL strings, used Spring's `JpaSpecificationExecutor` for type-safe, composable dynamic queries that combine search, country, department, and salary range filters.

3. **PostgreSQL `PERCENTILE_CONT` for median** — Used a native query for accurate median calculation rather than fetching all salaries to the application layer.

4. **Three.js particle background** — Adds visual depth without distracting from the data. The particles are low-count (100) to avoid performance impact.

5. **Glassmorphism + Dark Mode** — A design choice that creates visual hierarchy through translucency rather than hard borders, making the UI feel modern and premium.

6. **DataFaker over SQL scripts** — Java-based seeding via `CommandLineRunner` ensures the seed runs automatically on first boot and generates realistic names, titles, countries, and salary distributions.
