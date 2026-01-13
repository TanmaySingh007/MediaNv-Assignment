# Online Course Platform (MERN + PostgreSQL)

A full-stack online course platform built with MongoDB (MERN stack adapted for PostgreSQL), Express, React, and Node.js.

## Project Structure

```
MediaNv Assignment/
├── backend/                 # Node.js + Express + PostgreSQL backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js       # PostgreSQL connection pool
│   │   │   └── init.sql    # Database schema initialization
│   │   ├── controllers/
│   │   │   └── authController.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   └── roleMiddleware.js
│   │   ├── routes/
│   │   │   └── authRoutes.js
│   │   └── server.js
│   ├── package.json
│   └── README.md
│
└── frontend/                # React + Vite frontend
    ├── src/
    ├── public/
    ├── package.json
    └── vite.config.js
```

## Phase 1: Infrastructure and Database Initialization ✅

- ✅ Backend folder initialized with Node.js project
- ✅ Frontend folder initialized with React + Vite
- ✅ Folder structure created (config, middleware, controllers, routes)
- ✅ Database schema (init.sql) created with:
  - Users table (admin/student roles)
  - Courses table
  - Enrollments table
  - Proper constraints and indexes
- ✅ PostgreSQL connection pool implemented (db.js)

## Phase 2: Core Authentication and Middleware ✅

- ✅ Authentication controller with register and login functions
- ✅ Password hashing using bcrypt
- ✅ JWT token generation using jsonwebtoken
- ✅ Auth routes with express-validator
- ✅ Role validation (admin/student only)
- ✅ Authentication middleware (checkAuth)
- ✅ Role-based middleware (checkAdmin, checkStudent)

## Getting Started

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up PostgreSQL database (see backend/README.md for details)

4. Create `.env` file with database credentials

5. Run the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user (role: admin or student)
- `POST /api/auth/login` - Login user

### Health Check
- `GET /health` - Server status

## Technologies Used

- **Backend**: Node.js, Express.js, PostgreSQL, bcrypt, jsonwebtoken, express-validator
- **Frontend**: React, Vite
- **Database**: PostgreSQL

