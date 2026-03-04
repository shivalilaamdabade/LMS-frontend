# 🚀 LMS Deployment Guide

Complete steps to deploy your LMS on Render (Backend) and Vercel (Frontend)

---

## **Part 1: Deploy Backend to Render**

### **Prerequisites:**
- GitHub account with backend repository pushed
- Aiven MySQL database credentials (already set up)
- Render account (sign up at https://render.com)

### **Step-by-Step Instructions:**

#### **1. Sign Up/Login to Render**
- Go to https://render.com
- Click "Get Started for Free"
- Sign up with your GitHub account
- This allows Render to access your repositories

#### **2. Create a New Web Service**
- Click **"New +"** → **"Web Service"**
- Connect your GitHub account if prompted
- Select your repository: **`shivalilaamdabade/LMS-backend`**
- Click **"Connect"**

#### **3. Configure the Service**

**Basic Settings:**
- **Name:** `lms-backend-api` (or your preferred name)
- **Region:** Choose closest to your users (e.g., Oregon, Frankfurt)
- **Branch:** `main`
- **Root Directory:** Leave blank (since backend is in root of its repo)
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `node server.js`

**Instance Type:**
- **Free Tier:** Select "Free" (0$/month)
  - Note: Free tier spins down after 15 minutes of inactivity
  - First request after spin-down takes ~30 seconds to wake up

#### **4. Add Environment Variables**

Click **"Advanced"** section and add these environment variables:
```
NODE_ENV=production
PORT=5000
DB_HOST=<your-aiven-mysql-host>
DB_PORT=<your-aiven-mysql-port>
DB_USER=<your-database-username>
DB_PASSWORD=<your-database-password>
DB_NAME=defaultdb
JWT_SECRET=<your-secret-key>
JWT_EXPIRE=7d
CORS_ORIGIN=*
```

⚠️ **Important:** Replace placeholders with your actual credentials from your `.env` file. Never commit credentials to Git!

#### **5. Create the Service**
- Click **"Create Web Service"**
- Render will start building and deploying your application

#### **6. Monitor Deployment**
- Watch the logs in real-time
- Wait for status to show **"Live"**
- This takes 3-5 minutes

#### **7. Test Backend**
Once deployed, visit your Render URL:
```
https://lms-backend-api.onrender.com/
```

You should see:
```json
{
  "success": true,
  "message": "LMS API is running",
  "version": "1.0.0"
}
```

---

## **Part 2: Deploy Frontend to Vercel**

### **Step-by-Step Instructions:**

#### **1. Push Frontend to GitHub**
Make sure your frontend code is pushed to a separate repository or in a subdirectory.

#### **2. Sign Up/Login to Vercel**
- Go to https://vercel.com
- Sign up with your GitHub account

#### **3. Import Your Project**
- Click **"Add New..."** → **"Project"**
- Select your frontend repository: **`shivalilaamdabade/LMS-frontend`**
- Click **"Import"**

#### **4. Configure Build Settings**
Vercel auto-detects Vite settings:
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

#### **5. Add Environment Variables**
Click **"Environment Variables"** and add:
```
VITE_API_BASE_URL=https://your-backend-url.onrender.com
```

Replace with your actual Render backend URL.

#### **6. Deploy**
- Click **"Deploy"**
- Vercel will build and deploy your application
- Takes 2-3 minutes

#### **7. Get Your Frontend URL**
- Once deployed, you'll get a URL like:
  ```
  https://lms-frontend.vercel.app
  ```
- **Your app is now live!** 🎉

---

## **Part 3: Final Configuration**

### **1. Update Backend CORS**

After frontend is deployed, update your backend's CORS settings:

**In Render Dashboard:**
- Go to your backend service
- Click **"Environment"** tab
- Update `CORS_ORIGIN` to your Vercel URL:
  ```
  CORS_ORIGIN=https://lms-frontend.vercel.app
  ```
- Click **"Save Changes"**
- Render will automatically redeploy

### **2. Test the Full Application**

1. Visit your Vercel frontend URL
2. Try logging in with test credentials:
   - Email: `student@lms.com`
   - Password: `password123`
3. Browse courses
4. Enroll in a course
5. Watch lessons

---

## **Part 4: Custom Domain (Optional)**

### **For Render Backend:**
1. Buy a domain (e.g., from Namecheap, GoDaddy)
2. In Render dashboard, go to your service
3. Click **"Settings"** → **"Custom Domains"**
4. Add your domain: `api.yourdomain.com`
5. Update DNS records as instructed
6. Update `CORS_ORIGIN` in environment variables

### **For Vercel Frontend:**
1. In Vercel dashboard, go to your project
2. Click **"Settings"** → **"Domains"**
3. Add your domain: `www.yourdomain.com`
4. Update DNS records (Vercel provides instructions)
5. Update backend `CORS_ORIGIN` to new domain

---

## **Part 5: Troubleshooting**

### **Common Issues & Solutions:**

#### **1. Backend Not Starting**
- Check Render logs in **"Logs"** tab
- Verify all environment variables are set
- Ensure `package.json` has correct start script

#### **2. CORS Errors**
- Update backend `CORS_ORIGIN` environment variable
- Make sure it matches your Vercel URL exactly
- For development, you can temporarily set `CORS_ORIGIN=*`

#### **3. Frontend Can't Connect to Backend**
- Verify `VITE_API_BASE_URL` in Vercel environment variables
- Check that backend URL is correct and accessible
- Test backend URL directly in browser

#### **4. Database Connection Fails**
- Verify Aiven MySQL credentials in environment variables
- Check Aiven dashboard to ensure service is running
- Verify IP whitelist includes Render's IPs

#### **5. 404 Errors on Refresh (Vercel)**
- Ensure `vercel.json` exists with rewrite rules
- This is required for React Router to work properly

---

## **Part 6: Monitoring & Maintenance**

### **Render Backend:**
- **Logs:** View real-time logs in Render dashboard
- **Metrics:** Monitor CPU, memory usage
- **Manual Deploys:** Can trigger manual deploy from dashboard

### **Vercel Frontend:**
- **Analytics:** Built-in analytics in Vercel dashboard
- **Deployments:** View all deployments and rollback if needed
- **Preview Deployments:** Every PR gets a preview URL

---

## **Quick Reference**

### **Your URLs:**
- **Backend:** `https://your-app.onrender.com`
- **Frontend:** `https://your-app.vercel.app`

### **Test Credentials:**
- Student: `student@lms.com` / `password123`
- Instructor: `instructor@lms.com` / `password123`
- Admin: `admin@lms.com` / `password123`

---

## **Estimated Costs**

### **Free Tier:**
- **Render:** $0/month (with limitations)
  - Backend sleeps after 15 min inactivity
  - Wakes up on next request (~30 sec delay)

- **Vercel:** $0/month (generous free tier)
  - Unlimited deployments
  - No sleep/timeout issues

### **Pro Tier (Optional):**
- **Render:** $7/month (prevents sleep)
- **Vercel:** $20/month (for advanced features)

---

## **Next Steps After Deployment**

1. ✅ Test all features (login, enrollment, progress tracking)
2. ✅ Share your Vercel URL with users
3. ✅ Monitor logs in both platforms
4. ✅ Set up custom domains (optional)
5. ✅ Consider upgrading to paid tiers for production use

---

## **Support Links**

- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **Aiven MySQL:** https://aiven.io/docs

---

**🎉 Congratulations! Your LMS is now deployed and accessible worldwide!**
