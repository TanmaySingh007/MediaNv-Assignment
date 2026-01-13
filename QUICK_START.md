# 🚀 Quick Start Guide

## Project Status

Both servers are starting up!

### Backend Server
- **URL**: http://localhost:5000
- **Status**: Starting...
- **Health Check**: http://localhost:5000/health

### Frontend Server
- **URL**: http://localhost:3000
- **Status**: Starting...
- **Open in Browser**: http://localhost:3000

## ⚠️ Important: Database Setup Required

Before the application works fully, you need to set up PostgreSQL:

### Quick Database Setup

1. **Ensure PostgreSQL is running** on your system

2. **Create the database**:
   ```sql
   CREATE DATABASE course_platform;
   ```

3. **Run the initialization script**:
   ```bash
   psql -U postgres -d course_platform -f backend/src/config/init.sql
   ```
   
   Or using psql command line:
   ```bash
   psql -U postgres
   \c course_platform
   \i backend/src/config/init.sql
   ```

4. **Create `.env` file** in `backend/` directory (optional - defaults are provided):
   ```env
   DB_USER=postgres
   DB_HOST=localhost
   DB_NAME=course_platform
   DB_PASSWORD=your_postgres_password
   DB_PORT=5432
   JWT_SECRET=your-super-secret-jwt-key
   PORT=5000
   ```

## 🎯 Next Steps

1. **Wait 10-15 seconds** for servers to fully start
2. **Open your browser** and navigate to: http://localhost:3000
3. **Register a new account** (admin or student)
4. **Start exploring** the enhanced UI!

## 🎨 What's New

- ✨ Enhanced visual design with custom gradients
- 🎭 Glass morphism effects
- 🌈 Animated backgrounds and transitions
- 📱 Fully responsive design
- 🚀 Smooth micro-interactions
- 🎯 Unique "EduFlow" branding

## 🐛 Troubleshooting

### Port Already in Use
If ports 5000 or 3000 are already in use:
- Backend: Change `PORT` in `backend/.env`
- Frontend: Change port in `frontend/vite.config.js`

### Database Connection Error
- Ensure PostgreSQL is running
- Check database credentials
- Verify database `course_platform` exists
- Run the init.sql script

### Module Not Found
- Run `npm install` in both `backend/` and `frontend/` directories

## 📝 Default Credentials

You'll need to register a new account. The database initialization script includes a placeholder admin user, but it's recommended to register through the UI.

---

**Enjoy your enhanced EduFlow learning platform! 🎓**

