# 🛠️ Troubleshooting Guide - Frontend Connection Issues

## Problem: 500 Error During Registration/Login

### Error Message:
```
Failed to load resource: the server responded with a status of 500 ()
Register error: AxiosError: Request failed with status code 500
```

---

## Root Causes & Solutions

### Cause 1: Backend Server Not Running ✅ RESOLVED

**Solution:**
The backend must be running on `http://localhost:5000`

**Verify:**
```bash
cd backend
npm start
```

You should see:
```
🚀 Server running on port 5000
✓ Database connected successfully!
```

---

### Cause 2: Incorrect API Base URL

**Check Frontend Environment:**
Open `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

**For Production (Vercel):**
Update `frontend/.env.production` or Vercel environment variables:
```env
VITE_API_BASE_URL=https://your-backend-url.onrender.com/api
```

**Important:** After changing `.env`, restart the dev server:
```bash
# Stop the server (Ctrl+C)
npm run dev
```

---

### Cause 3: Database Connection Issues

**Symptoms:**
- Backend starts but shows database connection errors
- Registration fails with 500 error

**Solution:**
1. Check `backend/.env` has correct credentials:
   ```env
   DB_HOST=mysql-394a3a35-shivalilaamdabade-6c18.i.aivencloud.com
   DB_PORT=21072
   DB_USER=avnadmin
   DB_PASSWORD=your_actual_password_here
   DB_NAME=defaultdb
   ```

2. Test database connection:
   ```bash
   cd backend
   node test-db-connection.js
   ```

3. Check Aiven dashboard for:
   - Database is running
   - IP whitelist allows your server
   - Credentials are correct

---

### Cause 4: CORS Issues

**Symptoms:**
- Console shows CORS error
- Network tab shows blocked requests

**Solution:**
Backend already has CORS enabled in `server.js`:
```javascript
app.use(cors());
```

If deploying to production, update CORS settings:
```javascript
const cors = require('cors');
app.use(cors({
  origin: ['https://your-frontend.vercel.app', 'http://localhost:5173']
}));
```

---

### Cause 5: JWT Secret Missing

**Symptoms:**
- Registration completes but returns 500 error
- Error mentions JWT or token

**Solution:**
Ensure `backend/.env` has:
```env
JWT_SECRET=lms_jwt_secret_key_2026_change_in_production
```

Generate a new secret if needed:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## Step-by-Step Testing

### Test 1: Backend Health Check

1. Start backend:
   ```bash
   cd backend
   npm start
   ```

2. Open browser and navigate to:
   - `http://localhost:5000` → Should show API info
   - `http://localhost:5000/api` → Should show endpoints

**Expected Response:**
```json
{
  "success": true,
  "message": "LMS API v1",
  "endpoints": { ... }
}
```

### Test 2: Direct API Call

Use curl or Postman:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "student"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": { ... }
}
```

### Test 3: Frontend Configuration

1. Verify frontend env file exists:
   ```bash
   cat frontend/.env
   ```

2. Check the value matches backend:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

3. Rebuild frontend if needed:
   ```bash
   cd frontend
   rm -rf dist
   npm run build
   npm run dev
   ```

### Test 4: Browser DevTools

1. Open frontend in browser
2. Press F12 (DevTools)
3. Go to Network tab
4. Try to register
5. Click on the failed request
6. Check:
   - **Request URL**: Should be `http://localhost:5000/api/auth/register`
   - **Request Method**: Should be `POST`
   - **Status Code**: Should be `200` or `201` (not 500)
   - **Response**: Check for error messages

---

## Common Scenarios

### Scenario A: Local Development

**Frontend:** `http://localhost:5173`
**Backend:** `http://localhost:5000`

**Setup:**
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Scenario B: Production Deployment

**Frontend:** Vercel/Netlify
**Backend:** Render/Railway

**Steps:**
1. Deploy backend to Render
2. Get backend URL (e.g., `https://lms-backend.onrender.com`)
3. Update Vercel environment variable:
   ```
   VITE_API_BASE_URL=https://lms-backend.onrender.com/api
   ```
4. Redeploy frontend on Vercel

---

## Debugging Checklist

- [ ] Backend server is running (`npm start` in backend folder)
- [ ] Database connection successful (check backend logs)
- [ ] Frontend `.env` has correct `VITE_API_BASE_URL`
- [ ] Backend `.env` has all required variables
- [ ] No CORS errors in browser console
- [ ] Network tab shows correct request URL
- [ ] Backend logs show the request arriving
- [ ] JWT_SECRET is set in backend `.env`
- [ ] All required tables exist in database

---

## Quick Fixes

### Fix 1: Restart Everything
```bash
# Stop all servers
# Ctrl+C in all terminals

# Start backend
cd backend
npm start

# New terminal - Start frontend
cd frontend
npm run dev
```

### Fix 2: Clear Cache and Rebuild
```bash
cd frontend
rm -rf node_modules
rm -rf dist
npm install
npm run dev
```

### Fix 3: Reset Database
```bash
cd backend
node setup-db.js
```

---

## Security Reminder

⚠️ **Never commit `.env` files to Git!**

Your current setup is secure:
- ✅ `.env` files are in `.gitignore`
- ✅ Using `.env.example` templates
- ✅ Secrets stored locally only

If you accidentally committed secrets:
1. Change passwords immediately
2. Follow SECURITY_GUIDE.md
3. Rotate all credentials

---

## Still Having Issues?

### Enable Detailed Logging

Add to `backend/server.js`:
```javascript
// More verbose logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});
```

### Check Backend Logs

Look for error messages in the terminal where backend is running:
```
Error: [error message]
Stack: [stack trace]
```

### Test Database Directly

```bash
cd backend
node test-db-connection.js
```

---

## Contact & Resources

- Backend logs: Check terminal output
- Frontend logs: Check browser console (F12)
- Network requests: Browser DevTools → Network tab
- Database status: Aiven dashboard
