# AtomQuest 1.0 - Goal Setting & Tracking Portal

AtomQuest 1.0 is a comprehensive, full-stack Goal Setting and Tracking Portal designed for an internal company hackathon. The application provides role-based access for Employees, Managers, and Admins to create, track, manage, and review quarterly performance goals in a centralized, visually appealing dashboard.

## Features

- **Role-Based Access Control**: Different views and capabilities for `employee`, `manager`, and `admin` roles.
- **Goal Lifecycle Management**: Create, submit, approve, and track goals across designated cycles.
- **Interactive Dashboards**: Visual charts (using Recharts) for tracking goal weightage and overall score completion.
- **Team Management**: Managers can view their entire team's goal sheets, check-ins, and performance summaries.
- **PostgreSQL Database**: Persistent data storage utilizing Supabase with custom constraints, triggers, and full audit logging.

## Tech Stack

### Frontend
- **React 19**
- **Vite**
- **React Router** for declarative navigation
- **Lucide-React** for icons
- **Recharts** for data visualization
- Custom CSS (No Tailwind)

### Backend
- **Node.js** with **Express.js**
- **PostgreSQL** via `pg` module
- RESTful API architecture

## Local Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- A running PostgreSQL instance (or a [Supabase](https://supabase.com) project)

### Database Configuration
1. Open your PostgreSQL editor or Supabase SQL Editor.
2. Run the `schema.sql` file located in the root of the project to generate all tables and triggers.
3. Add initial users directly into the database matching the roles you want to test.

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Rename `.env.example` to `.env` and add your database URL:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/db"
   PORT=5000
   ```
4. Start the server:
   ```bash
   node index.js
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

## API Endpoints

- `POST /api/auth/login`
- `GET /api/goal-sheets`
- `PUT /api/goal-sheets/:id`
- `GET /api/goals`
- `POST /api/goals`
- `PUT /api/goals/:id`
- `DELETE /api/goals/:id`
- `GET /api/users`
- `GET /api/goal-sheets/team`

## License
Proprietary / Internal Company Hackathon.
