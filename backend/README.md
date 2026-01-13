# Course Platform Backend

Backend API for the Online Course Platform built with Node.js, Express, and PostgreSQL.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

1. Make sure PostgreSQL is installed and running on your system.

2. Create a database:
```sql
CREATE DATABASE course_platform;
```

3. Run the initialization script:
```bash
psql -U postgres -d course_platform -f src/config/init.sql
```

Or using the PostgreSQL command line:
```bash
psql -U postgres
\c course_platform
\i src/config/init.sql
```

### 3. Environment Variables

Create a `.env` file in the backend root directory:

```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=course_platform
DB_PASSWORD=your_password
DB_PORT=5432

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

PORT=5000
NODE_ENV=development
```

### 4. Run the Server

Development mode (with nodemon):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000` (or the PORT specified in .env).

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
  - Body: `{ username, email, password, role }` (role must be "admin" or "student")
  
- `POST /api/auth/login` - Login user
  - Body: `{ email, password }`

### Health Check

- `GET /health` - Check if server is running

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js          # PostgreSQL connection pool
│   │   └── init.sql       # Database schema initialization
│   ├── controllers/
│   │   └── authController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   ├── routes/
│   │   └── authRoutes.js
│   └── server.js          # Main server file
├── .env                   # Environment variables (create this)
├── .gitignore
├── package.json
└── README.md
```

## Middleware

- `checkAuth` - Verifies JWT token and authenticates user
- `checkAdmin` - Ensures user has admin role (must use after checkAuth)
- `checkStudent` - Ensures user has student role (must use after checkAuth)

## Database Schema

- **users**: Stores user accounts (admin/student)
- **courses**: Stores course information
- **enrollments**: Tracks student course enrollments

