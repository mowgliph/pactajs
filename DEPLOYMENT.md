# PACTA Application Deployment Guide

## Overview
This guide provides instructions for deploying the PACTA web application, which consists of a React frontend and an Express.js backend with MongoDB.

## Prerequisites
- Node.js 18+
- MongoDB (local or MongoDB Atlas)
- Git

## Local Development Setup

### Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/pacta
   JWT_SECRET=your-secret-key
   VAPID_PUBLIC_KEY=your-vapid-public-key
   VAPID_PRIVATE_KEY=your-vapid-private-key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Production Deployment

### Frontend Deployment (Vercel Example)
1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   cd frontend
   vercel
   ```

3. Set environment variable for API URL:
   ```
   REACT_APP_API_URL=https://your-backend-url
   ```

### Database Setup
- Use MongoDB Atlas for production
- Ensure network access allows connections from your deployment platforms

## PWA Setup
- The frontend is configured as a PWA with service workers
- After deployment, users can install the app on their devices
- Offline functionality is supported via IndexedDB

## Testing
- Run backend tests: `cd backend && npm test`
- Run frontend tests: `cd frontend && npm test`
- Run E2E tests: `cd frontend && npm run test:e2e`

## Monitoring
- Logs are available in `backend/logs/`
- Use Winston for structured logging
- Rate limiting is implemented to prevent abuse

## Security Notes
- JWT tokens are used for authentication
- Helmet.js provides security headers
- Input validation is implemented
- CORS is configured for cross-origin requests