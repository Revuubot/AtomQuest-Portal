# AtomQuest Hackathon 1.0 - Deployment & Migration Guide

This guide covers the deployment of the Goal Setting & Tracking Portal using Vercel (Frontend), Railway (Backend Node.js server), and Supabase (PostgreSQL Database).

## 1. Database Setup (Supabase)

1. Create a new project on [Supabase](https://supabase.com/).
2. Once the project is created, go to Project Settings -> Database.
3. Copy the "Connection string" (URI) for PostgreSQL.
4. Go to the SQL Editor in Supabase.
5. Copy the contents of `schema.sql` and run the script to create all tables, indexes, and triggers.
6. (Optional) Run the mock data seed script in the SQL Editor if you want to populate the database initially.

## 2. Backend Deployment (Railway)

1. Create an account on [Railway](https://railway.app/).
2. Click "New Project" -> "Deploy from GitHub repo".
3. Select your repository. If the backend is in a subfolder, configure the "Root Directory" to be `backend`.
4. In the Variables tab for the service, add the following environment variables:
   - `PORT`: `5000`
   - `DATABASE_URL`: `[Your Supabase Connection String]`
   - `JWT_SECRET`: `[Generate a secure random string]`
   - `NODE_ENV`: `production`
5. Ensure your `package.json` in the `backend` folder has a start script: `"start": "node index.js"`.
6. Railway will automatically build and deploy. Once deployed, copy the provided public URL (e.g., `https://atomquest-api.up.railway.app`).

## 3. Frontend Deployment (Vercel)

1. Create an account on [Vercel](https://vercel.com/).
2. Click "Add New..." -> "Project".
3. Import your GitHub repository.
4. Set the Framework Preset to "Vite".
5. Set the Root Directory to `frontend`.
6. In Environment Variables, add:
   - `VITE_API_URL`: `[Your Railway Backend URL]` (e.g., `https://atomquest-api.up.railway.app`)
7. Click "Deploy". Vercel will build and serve your React application.

## Local Development

### .env.example (Backend)
```env
PORT=5000
DATABASE_URL=postgres://user:pass@localhost:5432/atomquest
JWT_SECRET=your_super_secret_jwt_key
```

### .env.example (Frontend)
```env
VITE_API_URL=http://localhost:5000
```
