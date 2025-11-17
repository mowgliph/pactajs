# PACTA Web Application

This is the web adaptation of the PACTA (Plataforma de Automatización y Control de Contratos Empresariales) desktop application.

## Project Structure

- `frontend/` - React frontend with Vite, TypeScript, Tailwind CSS, ShadcnUI
- `backend/` - Node.js backend with Express, TypeScript, MongoDB, JWT authentication

## Setup Instructions

1. Install Node.js 18+ from https://nodejs.org/

2. Install MongoDB locally (https://www.mongodb.com/try/download/community) or use MongoDB Atlas.

3. Clone or navigate to the project directory.

4. Install dependencies for both frontend and backend:

   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   ```

5. Set up environment variables:

   - Copy `backend/.env.example` to `backend/.env`
   - Fill in the required values (MONGO_URI, JWT_SECRET)

6. Start the backend server:

   ```bash
   cd backend && npm run dev
   ```

7. In a new terminal, start the frontend development server:

   ```bash
   cd frontend && npm run dev
   ```

8. Open your browser:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## Testing the Setup

- Frontend dev server should start successfully on port 5173
- Backend dev server should start on port 5000 with "Server running on port 5000" message
- MongoDB connection should log "MongoDB connected" in the backend console
- Frontend should display "Bienvenido a PACTA" in Spanish

## Authentication Endpoints

- POST /auth/register - Register a new user
- POST /auth/login - Login and receive JWT token

## Technologies Used

- Frontend: React 18, TypeScript, Vite, Tailwind CSS, ShadcnUI
- Backend: Node.js, Express, TypeScript, MongoDB, Mongoose, JWT, bcrypt
- Security: CORS, Helmet