# Setup Instructions

## Prerequisites

1. **Node.js** (v14 or higher) - ✅ Installed
2. **PostgreSQL** - ⚠️ Must be installed and running
3. **npm** - ✅ Installed

## Database Setup

Before running the application, you need to set up the PostgreSQL database:

1. **Install PostgreSQL** (if not already installed)
   - Download from: https://www.postgresql.org/download/
   - Default installation includes:
     - User: `postgres`
     - Port: `5432`

2. **Create the database:**
   ```sql
   CREATE DATABASE course_platform;
   ```

3. **Run the initialization script:**
   ```bash
   psql -U postgres -d course_platform -f backend/src/config/init.sql
   ```
   
   Or using PostgreSQL command line:
   ```bash
   psql -U postgres
   \c course_platform
   \i backend/src/config/init.sql
   ```

4. **Create `.env` file in `backend/` directory** (optional, defaults are provided):
   ```env
   DB_USER=postgres
   DB_HOST=localhost
   DB_NAME=course_platform
   DB_PASSWORD=your_postgres_password
   DB_PORT=5432

   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d

   PORT=5000
   NODE_ENV=development
   ```

## Running the Application

### Backend Server
```bash
cd backend
npm install  # Already done
npm run dev  # Running on http://localhost:5000
```

### Frontend Server
```bash
cd frontend
npm install  # Already done
npm run dev  # Running on http://localhost:3000
```

## Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## Default Admin User

The database initialization script creates a default admin user, but you'll need to:
1. Register a new admin user through the registration page, OR
2. Update the password hash in the database for the default admin user

## Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Check database credentials in `.env` file
- Verify database `course_platform` exists
- Check PostgreSQL is listening on port 5432

### Port Already in Use
- Backend uses port 5000 (change in `.env` if needed)
- Frontend uses port 3000 (change in `vite.config.js` if needed)

### Module Not Found
- Run `npm install` in both `backend/` and `frontend/` directories

## Next Steps

1. Open http://localhost:3000 in your browser
2. Register a new user (admin or student)
3. Start using the application!

