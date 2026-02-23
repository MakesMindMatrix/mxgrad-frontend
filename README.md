# GCC-Startup Portal – Frontend

React (Vite + TypeScript) app with Tailwind CSS. Talks to the backend via `/api` (proxy in dev).

## Setup

1. **Env**  
   Optional: create `.env` with `VITE_API_URL=http://localhost:4000/api` if not using Vite proxy.

2. **Install and run**
   ```bash
   npm install
   npm run dev
   ```
   App: `http://localhost:5173`

3. **Build**
   ```bash
   npm run build
   npm run preview
   ```

## Flow

- **Landing** – Home, Explore (requirements), Login, Register.
- **Register** – Choose GCC or Startup; after submit, “pending approval” message and redirect to login.
- **Login** – If not approved, 403 and redirect to Pending Approval page (“under admin” message). If approved, JWT and redirect to dashboard.
- **GCC** – Dashboard, Profile, Requirements (list, create, detail with applications).
- **Startup** – Dashboard, Tabbed Profile (Basic, Team, Product, Engagement, Funding), Explore and Express Interest.
- **Admin** – Approvals: list pending, Approve/Reject. Only ADMIN role.

Auth is JWT in `localStorage`; RBAC and route guards enforce role (ADMIN, GCC, STARTUP).
