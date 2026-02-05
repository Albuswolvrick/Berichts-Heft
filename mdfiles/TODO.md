# Berichts-Heft — Todo List

_Last updated: 2026-02-05_

## ✅ Goals
- Build a complete front-to-back (and back-to-front) API integration
- Improve UI/UX for a modern, accessible experience
- Implement a proper backend with reliable DB integration

---

## 1) Frontend ➜ Backend API (requests)

### Core auth flow
- [x] **Login**: connect Login UI to `POST /api/auth/login`
- [x] **Logout**: add session invalidation call `POST /api/auth/logout`
- [x] **Register**: connect Register UI to `POST /api/auth/register`

### Reports
- [x] **Create report**: `POST /api/reports`
- [x] **List reports**: `GET /api/reports`
- [x] **View report**: `GET /api/reports/:id`
- [x] **Update report**: `PUT /api/reports/:id`
- [x] **Delete report**: `DELETE /api/reports/:id`

### User profile
- [x] **Get profile**: `GET /api/users/me`
- [x] **Update profile**: `PATCH /api/users/me`

### Error handling + loading states
- [ ] Show loading spinners for all API actions
- [ ] Display friendly errors (toast/snackbar + inline errors)
- [ ] Standardize API error responses in UI

---

## 2) Backend ➜ Frontend API (responses)

### Response contracts
- [ ] Define consistent JSON shape: `{ success, data, error, meta }`
- [ ] Add pagination metadata for list endpoints
- [ ] Validate request/response schemas (Zod/JOI)

### Auth/session
- [ ] Decide auth strategy (cookie session or JWT)
- [ ] Secure endpoints with middleware
- [ ] Add role-based access control (RBAC)

---

## 3) Proper Backend (architecture)

### Server structure
- [ ] Organize routes (`/api/auth`, `/api/reports`, `/api/users`)
- [ ] Add controllers + services + repository layers
- [ ] Centralized error handler + logger

### Testing
- [ ] Add API tests (Supertest / Vitest)
- [ ] Add unit tests for services

### Security
- [ ] Rate limiting on auth endpoints
- [ ] Input validation + sanitization
- [ ] CORS setup + CSRF protection (if cookie-based)

---

## 4) Database Integration (Prisma)

### Schema + migrations
- [ ] Finalize Prisma schema (User, Report, Role, Session)
- [ ] Create migrations and verify on dev DB
- [ ] Seed script with demo users/reports

### Data access
- [ ] Create repository functions for CRUD
- [ ] Add transactions for multi-step writes
- [ ] Add indexes for frequent queries

---

## 5) UI/UX Improvements

### Design system
- [ ] Create a consistent color palette + typography scale
- [ ] Add reusable UI components (Buttons, Inputs, Cards, Alerts)

### Pages
- [ ] **Login page**: modern layout + validation + “Forgot password” CTA
- [ ] **Home page**: quick actions + recent reports
- [ ] **New report**: step-by-step wizard + autosave
- [ ] **Dev menu**: only in development builds

### Accessibility
- [ ] Keyboard navigation
- [ ] Proper labels/ARIA on forms
- [ ] Color contrast compliance

---

## 6) DevOps / Tooling

- [ ] Add `.env.example` and document env vars
- [ ] Configure eslint + prettier
- [ ] Add API base URL config for dev/prod

---

## Priority Order

1. API contracts + backend routes
2. Frontend integration (auth + reports)
3. DB integration + migrations
4. UI/UX polish and accessibility
5. Testing + CI

---

## Notes

- Keep API and UI in sync with a shared contract file.
- Prefer incremental delivery: auth → reports → profile → polish.
