# Vercel Deployment Guide

## 🚀 Quick Deploy

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy from project root:**
   ```bash
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy? **Yes**
   - Which scope? **Your account**
   - Link to existing project? **No**
   - Project name? **media-nv-assignment** (or your choice)
   - Directory? **./frontend** (for frontend) or **./backend** (for backend)
   - Override settings? **No**

### Option 2: Deploy via GitHub Integration

1. **Push your code to GitHub** (already done)
2. Go to [vercel.com](https://vercel.com)
3. Click **"Add New Project"**
4. Import your GitHub repository
5. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
6. Add environment variables (see below)
7. Click **"Deploy"**

## 📋 Deployment Strategy

### Frontend Deployment (Vercel)

The frontend will be deployed as a static site on Vercel.

**Configuration:**
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### Backend Deployment (Separate Options)

**Option A: Deploy Backend to Vercel as Serverless Functions**

1. Create a separate Vercel project for backend
2. Root Directory: `backend`
3. Build Command: (leave empty or `echo "No build needed"`)
4. Output Directory: (leave empty)

**Option B: Deploy Backend to Railway/Render/Heroku** (Recommended for PostgreSQL)

Since Vercel serverless functions have execution time limits, for a PostgreSQL backend, consider:
- **Railway** (Recommended): Easy PostgreSQL setup
- **Render**: Free tier available
- **Heroku**: Paid plans
- **Fly.io**: Good for Node.js apps

## 🔐 Environment Variables

### Frontend Environment Variables (Vercel Dashboard)

Add these in Vercel Project Settings → Environment Variables:

```
VITE_API_URL=https://your-backend-url.vercel.app/api
```

### Backend Environment Variables

Add these in your backend hosting platform:

```
DB_USER=your_postgres_user
DB_HOST=your_postgres_host
DB_NAME=course_platform
DB_PASSWORD=your_postgres_password
DB_PORT=5432
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
NODE_ENV=production
PORT=5000
```

## 📁 Project Structure for Vercel

```
MediaNv Assignment/
├── frontend/          # Deploy this to Vercel
│   ├── vercel.json
│   ├── package.json
│   └── ...
├── backend/           # Deploy separately or to Vercel serverless
│   ├── vercel.json
│   ├── api/
│   │   └── index.js   # Serverless function entry
│   └── ...
└── vercel.json        # Root config (optional)
```

## 🔧 Configuration Files

### Frontend vercel.json
Already created at `frontend/vercel.json`

### Backend vercel.json
Already created at `backend/vercel.json`

### Root vercel.json
Already created at `vercel.json`

## 🌐 Database Setup

### Option 1: Vercel Postgres (Recommended for Vercel)

1. Go to Vercel Dashboard → Your Project → Storage
2. Click **"Create Database"** → **"Postgres"**
3. Copy connection string
4. Update backend environment variables

### Option 2: External PostgreSQL

Use services like:
- **Supabase** (Free tier)
- **Neon** (Free tier)
- **Railway** (Free tier)
- **ElephantSQL** (Free tier)

## 📝 Step-by-Step Deployment

### Step 1: Deploy Frontend

```bash
cd frontend
vercel
```

Or via GitHub:
1. Import repository
2. Set Root Directory: `frontend`
3. Deploy

### Step 2: Deploy Backend

**If using Vercel serverless:**
```bash
cd backend
vercel
```

**If using Railway (Recommended):**
1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Select your repository
4. Add PostgreSQL service
5. Set Root Directory: `backend`
6. Add environment variables
7. Deploy

### Step 3: Update Frontend API URL

After backend is deployed, update frontend environment variable:
```
VITE_API_URL=https://your-backend-url.railway.app/api
```

### Step 4: Redeploy Frontend

Redeploy frontend to pick up new API URL.

## ✅ Post-Deployment Checklist

- [ ] Frontend deployed and accessible
- [ ] Backend deployed and accessible
- [ ] Environment variables set
- [ ] Database connected
- [ ] API endpoints working
- [ ] CORS configured correctly
- [ ] Frontend API URL updated

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel CLI](https://vercel.com/cli)
- [Railway Documentation](https://docs.railway.app)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)

## 🐛 Troubleshooting

### Build Fails
- Check Node.js version (Vercel uses Node 18 by default)
- Verify all dependencies in package.json
- Check build logs in Vercel dashboard

### API Not Working
- Verify CORS settings
- Check environment variables
- Verify API URL in frontend
- Check backend logs

### Database Connection Issues
- Verify connection string
- Check database is accessible
- Verify environment variables
- Check firewall settings

---

**Ready to deploy?** Follow the steps above and your application will be live! 🚀

