# system flow
---

## 1. Request Processing Pipeline (Deep Dive)
This flow shows every security and logic layer a request passes through before reaching the database.

```mermaid
graph TD
    User([Browser/Client]) -->|HTTP Request| LoadBalancer[Nginx/Docker Proxy]
    LoadBalancer -->|Port 3001| Express[Express.js Server]
    
    subgraph Security_Layer["Security Middleware"]
        Express --> Helmet[Helmet.js - Security Headers]
        Helmet --> Cors[CORS - Origin Validation]
        Cors --> RateLimit[Express Rate Limit - DoS Protection]
    end
    
    subgraph Identity_Layer["Identity & Auth Middleware"]
        RateLimit --> Session[Express Session - SQLite Store]
        Session --> RoleAttach[attachUserRole - Assign NOTLOGDIN if guest]
        RoleAttach --> AuthGuard{Route Guard}
    end
    
    AuthGuard -->|Public Route| Controller[Public Controller]
    AuthGuard -->|Protected Route| IsAuth[isAuthenticated Check]
    IsAuth -->|Fail: 401| User
    IsAuth -->|Pass| ControllerProtected[Protected Controller]
    
    subgraph Logic_Layer["Business Logic"]
        ControllerProtected -->|validate| Service[Service Layer - authService/reportService]
        Service -->|query| Prisma[Prisma ORM - Generated Client]
    end
    
    subgraph Data_Layer["Persistence"]
        Prisma --> DB[(SQLite Database - dev.db)]
    end
    
    DB -.->|Data| Prisma
    Prisma -.->|Object| Service
    Service -.->|DTO| ControllerProtected
    ControllerProtected -.->|JSON Response| User
```

---

## 2. Authentication Detailed Sequence
The precise logic used during the login and registration process.

```mermaid
sequenceDiagram
    participant C as Client (Vite/React)
    participant A as Auth Controller
    participant S as AuthService (Node.js)
    participant B as bcrypt (Security)
    participant D as Database (Prisma/SQLite)

    Note over C, D: User Registration Flow
    C->>A: POST /api/auth/register (name, email, pass)
    A->>S: register({name, email, pass})
    S->>D: countUser()
    D-->>S: 0 Users
    S->>S: Set role = ADMIN (First User)
    S->>B: hash(password, rounds=10)
    B-->>S: Generated Hash
    S->>D: create({name, email, hash, role})
    D-->>S: Record Created
    S-->>A: User Object (no password)
    A-->>C: 201 Created

    Note over C, D: User Login Flow
    C->>A: POST /api/auth/login (email, pass)
    A->>S: login({email, pass})
    S->>D: findUnique({ email OR name })
    D-->>S: User + Hash
    S->>B: compare(pass, hash)
    B-->>S: Boolean Match
    S->>D: update(lastLoginAt)
    S-->>A: User Session Data
    A-->>C: 200 OK + Session Cookie
```

---

## 3. Report Management Workflow (Comprehensive)
The business rules governing how reports move through states.

```mermaid
stateDiagram-v2
    [*] --> DRAFT: "New Report"
    DRAFT --> DRAFT: "Save Changes"
    
    state "Validation Check" as check <<choice>>
    DRAFT --> check: "Submit Button"
    
    check --> REVISION_REQUIRED: "Missing Data"
    check --> SUBMITTED: "Valid Data"
    
    SUBMITTED --> MANAGER_REVIEW: "Notify Manager"
    
    state MANAGER_REVIEW {
        direction LR
        [*] --> Pending
        Pending --> Approved: "Approves"
        Pending --> Revision: "Requests Changes"
        Pending --> Rejected: "Hard Denial"
    }
    
    Approved --> APPROVED
    Revision --> REVISION_REQUIRED
    Rejected --> REJECTED
    
    REVISION_REQUIRED --> DRAFT: "User Corrects"
    
    APPROVED --> PDF_GENERATION: "Export to PDF"
    PDF_GENERATION --> [*]: "Download Link"
```

---

## 4. Entity Relationship Diagram (Detailed)
The actual structure of the database tables and their foreign key constraints.

```mermaid
erDiagram
    User {
        int id PK
        string email UK
        string name
        enum role
        string passwordHash
        dateTime lastLoginAt
        string lastLoginIp
    }
    DailyReport {
        int id PK
        int userId FK
        int weeklyReportId FK
        dateTime reportDate
        string title
        string activities
        float hoursWorked
        enum status
    }
    WeeklyReport {
        int id PK
        int userId FK
        int monthlyReportId FK
        int weekNumber
        dateTime weekStart
        float totalHours
    }
    Comment {
        int id PK
        int userId FK
        int dailyReportId FK
        string content
        dateTime createdAt
    }
    Attachment {
        int id PK
        string fileName
        string filePath
        string mimeType
    }

    User ||--o{ DailyReport : "owns"
    User ||--o{ Comment : "writes"
    DailyReport }o--|| WeeklyReport : "belongs_to"
    WeeklyReport }o--|| MonthlyReport : "belongs_to"
    DailyReport ||--o{ Attachment : "contains"
    DailyReport ||--o{ Comment : "has"
```

---

## 5. Technical Stack Overview

| Component | Technology | Detail |
| :--- | :--- | :--- |
| **Runtime** | Node.js | v18+ Recommended |
| **Language** | JavaScript (ESM) | Using Modern Syntax |
| **Web Server** | Express.js v5 | For RESTful API Endpoints |
| **Frontend** | React v19 | With functional components and hooks |
| **Build Tool** | Vite | For fast HMR and optimized builds |
| **Database** | SQLite | Local relational storage (Zero-config) |
| **ORM** | Prisma v7 | Type-safe database management |
| **Styling** | Vanilla CSS | Custom design system |
| **Testing** | Vitest | Fast unit testing |
| **Tooling** | ESLint + Prettier | Code quality and formatting |
