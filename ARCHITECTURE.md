# Berichts-Heft: System Architecture & Technical Deep-Dive

This document provides a comprehensive overview of the technical architecture, data flows, and design patterns used in the Berichts-Heft application.

---

## 1. High-Level Technology Stack

| Layer | Technology | Role |
| :--- | :--- | :--- |
| **Frontend** | React v19 + Vite | SPA Framework, Hooks-based state, client-side routing. |
| **Backend** | Node.js + Express.js | API server, middleware pipeline, business logic. |
| **Database** | SQLite + Prisma | Relational storage, type-safe migrations and queries. |
| **Security** | bcrypt + Session | Password hashing, stateful session management. |
| **Testing** | Vitest | Fast unit and integration tests. |

---

## 2. Detailed Request Lifecycle

Every request follows a multi-stage pipeline designed for security and scalability.

```mermaid
graph TD
    User([Browser]) -->|HTTP/REST| Express[Express Server]
    
    subgraph Security_Middleware["1. Security Filters"]
        Express --> Helmet[Helmet.js: Secure Headers]
        Helmet --> RateLimit[Rate Limit: DoS Mitigation]
        RateLimit --> CORS[CORS: Origin Validation]
    end
    
    subgraph Identity_Middleware["2. Identity & Context"]
        CORS --> Session[Session: SQLite Lookup]
        Session --> RoleAttach[attachUserRole: Assign NOTLOGDIN if guest]
    end
    
    subgraph Logic_Routing["3. Routing & Authorization"]
        RoleAttach --> Router{API Router}
        Router -->|Protected| AuthGuard{Is Authenticated?}
        AuthGuard -->|No| Unauthorized[401 Response]
        AuthGuard -->|Yes| Controller[Controller Method]
        Router -->|Public| Controller
    end
    
    subgraph Service_Persistence["4. Logic & Persistence"]
        Controller --> Service[Service Layer: Business Rules]
        Service --> Validation{Data Validation}
        Validation -->|Fail| Err400[400 Bad Request]
        Validation -->|Pass| Prisma[Prisma Client]
        Prisma --> DB[(SQLite DB)]
    end
    
    DB -.-> Prisma -.-> Service -.-> Controller -.-> JSON[JSON Response]
```

---

## 3. Core Mechanics

### A. Authentication & "NOTLOGDIN" Role
The system ensures that `req.user.role` is **always** defined. If a user is not logged in, they are assigned the `NOTLOGDIN` role. This allows frontend and backend logic to perform role-based checks without worrying about `undefined` errors.

**Login Sequence:**
1. Client sends email/password.
2. `authService` performs a lookup by `email` or `name` (optimized via DB indexes).
3. `bcrypt.compare` verifies the hash.
4. User object is injected into the session.

### B. Report State Machine
Reports follow a strict lifecycle to ensure quality and accountability.

```mermaid
stateDiagram-v2
    [*] --> DRAFT: Initial Creation
    DRAFT --> DRAFT: Partial Edits
    DRAFT --> SUBMITTED: Finalize & Submit
    SUBMITTED --> REVISION_REQUIRED: Manager Request
    REVISION_REQUIRED --> DRAFT: Edit Corrected
    SUBMITTED --> APPROVED: Manager Approval
    SUBMITTED --> REJECTED: Manager Denial
    APPROVED --> PDF: Export to PDF
    REJECTED --> [*]
```

### C. Error Handling Strategy
The system uses a centralized error-handling pattern. Services throw specific errors (e.g., `NotFoundError`), and a global middleware catches them to return a standardized format: `{ "error": "Message" }`.

**Key Error Classes:**
- `BadRequestError` (400)
- `UnauthorizedError` (401)
- `ForbiddenError` (403)
- `NotFoundError` (404)
- `ConflictError` (409)

---

## 4. Entity Relationship Diagram (ERD)

The database structure focuses on hierarchical report relationships (Daily -> Weekly -> Monthly -> Yearly).

```mermaid
erDiagram
    User {
        int id PK
        string email UK
        string name
        enum role
        string passwordHash
        dateTime lastLoginAt
    }
    DailyReport {
        int id PK
        int userId FK
        int weeklyReportId FK
        dateTime reportDate
        string title
        string activities
        enum status
    }
    WeeklyReport {
        int id PK
        int userId FK
        int monthlyReportId FK
        dateTime weekStart
        float totalHours
    }
    Comment {
        int id PK
        int userId FK
        int dailyReportId FK
        string content
    }

    User ||--o{ DailyReport : "creates"
    User ||--o{ WeeklyReport : "creates"
    DailyReport }o--|| WeeklyReport : "rolls up to"
    WeeklyReport }o--|| MonthlyReport : "rolls up to"
    DailyReport ||--o{ Comment : "contains"
```

---

## 5. Development & Verification
To maintain this architecture:
1. **Schema Changes**: Update `prisma/schema.prisma` and run `npm run prisma:generate`.
2. **Linting**: All code must pass `npm run lint` (ESLint v9 Flat Config).
3. **Tests**: Verify logic with `npm test` (Vitest).

---
*Created by Antigravity AI Coding Assistant.*
