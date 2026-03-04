# 🚨 Quick Fix: 404 API Error

## Problem
Your frontend is getting 404 errors because it's trying to connect to `http://localhost:5000/api` but your backend is not running locally.

## Solution: Deploy Backend + Configure Environment Variables

### Step 1: Deploy Backend to Render

1. **Go to [Render.com](https://render.com)** and sign in with GitHub

2. **Create a New Web Service:**
   - Click **"New +"** → **"Web Service"**
   - Connect your GitHub account
   - Select repository: **`shivalilaamdabade/LMS-frontend`**
   - Click **"Connect"**

3. **Configure the Service:**
   ```
   Name: lms-backend-api
   Region: Oregon (or closest to you)
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: node server.js
   Instance Type: Free
   ```

4. **Add Environment Variables:**
   Click **"Advanced"** → **"Add Environment Variable"** and add these ONE BY ONE:

   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `PORT` | `5000` |
   | `DB_HOST` | `mysql-394a3a35-shivalilaamdabade-6c18.i.aivencloud.com` |
   | `DB_PORT` | `21072` |
   | `DB_USER` | `avnadmin` |
   | `DB_PASSWORD` | `<YOUR_ACTUAL_DB_PASSWORD>` ⚠️ |
   | `DB_NAME` | `defaultdb` |
   | `JWT_SECRET` | `lms_jwt_secret_key_2026_change_in_production` |
   | `JWT_EXPIRE` | `7d` |
   | `CORS_ORIGIN` | `*` |

   ⚠️ **Replace `<YOUR_ACTUAL_DB_PASSWORD>` with your actual database password from Aiven!**

5. **Click "Create Web Service"**
   - Render will start building (takes 3-5 minutes)
   - Wait for status to show **"Live"**

6. **Copy Your Backend URL**
   - Once deployed, you'll see a URL like:
     ```
     https://lms-backend-api.onrender.com
     ```
   - **COPY THIS URL!** You need it for the next step.

---

### Step 2: Configure Vercel Frontend

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**

2. **Select your project** (LMS frontend)

3. **Go to Settings → Environment Variables**

4. **Add New Variable:**
   ```
   Key: VITE_API_BASE_URL
   Value: https://your-backend-url.onrender.com/api
   ```
   
   Replace `your-backend-url` with the actual URL from Render!

5. **Click "Save"**

6. **Redeploy:**
   - Go to **"Deployments"** tab
   - Find the latest deployment
   - Click the **three dots (⋮)** → **"Redeploy"**
   - Or click **"Deploy"** → **"Deploy latest commit"**

---

### Step 3: Test Your App

1. **Wait 2-3 minutes** for Vercel to redeploy

2. **Visit your Vercel URL**: `https://your-app.vercel.app`

3. **Try logging in** with test credentials:
   ```
   Email: student@lms.com
   Password: password123
   ```

4. **If login works** - SUCCESS! 🎉

---

## Alternative: Run Backend Locally (For Testing)

If you want to test quickly without deploying to Render:

### On Your Local Machine:

1. **Navigate to backend folder:**
   ```powershell
   cd backend
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```

3. **Create `.env` file in backend folder:**
   ```
   PORT=5000
   DB_HOST=mysql-394a3a35-shivalilaamdabade-6c18.i.aivencloud.com
   DB_PORT=21072
   DB_USER=avnadmin
   DB_PASSWORD=<YOUR_ACTUAL_DB_PASSWORD>
   DB_NAME=defaultdb
   JWT_SECRET=lms_jwt_secret_key_2026
   JWT_EXPIRE=7d
   CORS_ORIGIN=http://localhost:5173
   ```

4. **Start the server:**
   ```powershell
   npm start
   ```

5. **In another terminal, run frontend:**
   ```powershell
   cd frontend
   npm run dev
   ```

6. **Visit:** `http://localhost:5173`

---

## Common Issues

### ❌ "Cannot connect to database"
- Check your Aiven MySQL credentials
- Verify DB_PASSWORD is correct
- Make sure Aiven service is running

### ❌ "CORS error" in browser console
- Backend `CORS_ORIGIN` should be `*` (for testing) or your Vercel URL
- Redeploy backend after changing CORS settings

### ❌ Still getting 404
- Verify `VITE_API_BASE_URL` in Vercel matches your Render URL EXACTLY
- Should end with `/api`
- Example: `https://lms-backend-api.onrender.com/api`

### ❌ Backend won't start on Render
- Check Render logs in the dashboard
- Verify all environment variables are set
- Make sure `backend/server.js` exists

---

## Need Help?

1. **Check Render Logs:** Dashboard → Your service → Logs tab
2. **Check Vercel Deployment:** Dashboard → Your project → Deployments
3. **Test Backend Directly:** Visit `https://your-backend-url.onrender.com/` - should see JSON response

---

**Status:** Follow steps above to fix the 404 error ✅
