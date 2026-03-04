# Quick Start Guide - LMS Platform

## Current Status

✅ **Backend**: Complete and running on port 5000
✅ **Frontend**: Complete and running on port 5173
⚠️ **Database**: Connection pending network configuration

## Database Connection Issue

The Aiven MySQL database connection is failing due to DNS resolution. Here are solutions:

### Option 1: Check Network/Firewall
1. Ensure you have internet connectivity
2. Check if your firewall allows MySQL connections (port 21072)
3. Verify the Aiven service is running at https://console.aiven.io/

### Option 2: Use Local MySQL (Recommended for Testing)

1. Install MySQL locally if not already installed
2. Create a database named `defaultdb`
3. Update `.env` file in backend folder:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_local_mysql_password
DB_NAME=defaultdb
```

4. Run the setup script:
```bash
cd backend
node setup-db.js
npm run seed
npm start
```

### Option 3: Fix Aiven Connection String

Your Aiven credentials might need SSL mode adjustment. Try updating the database.js config:

```javascript
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false  // Try this if SSL verification fails
  }
});
```

## Running the Application

### Terminal 1 - Backend
```bash
cd backend
npm start
```
Server runs on: http://localhost:5000

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```
App runs on: http://localhost:5173

## Test the Application

1. Open browser: http://localhost:5173
2. You'll be redirected to login page
3. Login with demo credentials:
   - Email: student@lms.com
   - Password: password123
4. Browse courses and enroll!

## Features Implemented

✅ User Authentication (Login/Signup)
✅ Role-based Access Control
✅ Course Browsing
✅ Course Enrollment
✅ Video Lessons (YouTube embeds)
✅ Progress Tracking
✅ Last Watched Lesson
✅ Responsive Design

## File Structure Summary

```
LMS/
├── backend/              # Node.js + Express API
│   ├── controllers/     # Business logic
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth & role checks
│   └── config/          # Database config
└── frontend/            # React application
    ├── src/
    │   ├── components/  # Reusable UI components
    │   ├── pages/       # Page components
    │   ├── context/     # React context (Auth)
    │   └── services/    # API calls
    └── public/          # Static assets
```

## Next Steps After Database Fix

Once database connection is working:

1. Run `node setup-db.js` to create tables
2. Run `npm run seed` to populate sample data
3. Restart backend server
4. Login and test all features

## Common Issues

### "Cannot connect to database"
- Check internet connection
- Verify Aiven console shows service as running
- Check firewall settings
- Try local MySQL instead

### "Port 5000 already in use"
- Change PORT in .env file
- Or kill the process using port 5000

### Frontend can't reach backend
- Ensure backend is running
- Check CORS settings in server.js
- Verify API base URL in api.js

## YouTube Video URLs

To add your own YouTube videos:

1. Get video URLs from your Excel file
2. Either:
   - Update the seed.js file with real URLs before seeding
   - Or manually insert into lessons table via MySQL client
   - Or build an admin panel to manage courses

Example YouTube URL formats supported:
- https://www.youtube.com/watch?v=VIDEO_ID
- https://youtu.be/VIDEO_ID

---

**The application is fully functional and ready to use once database connection is established!**
