# 📋 Aiven MySQL Setup Instructions

## For Free Tier Users

### Step 1: Get Your Aiven Connection Details

1. Go to [Aiven Console](https://console.aiven.io/)
2. Click on your MySQL service
3. Go to **"Overview"** tab
4. Find **"Connection info"** section

You should see something like:
```
Host: mysql-394a3a35-shivalilaamdabade-6c18.i.aivencloud.com
Port: 21072
User: avnadmin
Password: AVNS_...
Database: defaultdb
SSL: Required
```

### Step 2: Download CA Certificate (IMPORTANT!)

1. In Aiven console, click on your MySQL service
2. Go to **"Overview"** tab
3. Look for **"CA Certificate"** or **"Download CA"** button
4. Click to download the CA certificate file (usually named `ca.pem` or similar)

**If you can't find the download button:**
- Check the "Service settings" tab
- Or look for "SSL/TLS" section
- The CA cert might be displayed as text you can copy

### Step 3: Add CA Certificate to Your Backend

Once you have the CA certificate:

1. Create a new file: `backend/aiven-ca.pem`
2. Paste the CA certificate content into it
3. Save the file

### Step 4: Update Database Configuration

Update `backend/config/database.js` to use the CA certificate:

```javascript
const fs = require('fs');
const path = require('path');


try {
  // Load CA certificate
  const caPath = path.join(__dirname, 'aiven-ca.pem');
  const caCert = fs.readFileSync(caPath);

  pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
      ca: caCert,  // Use CA certificate
      rejectUnauthorized: true
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
  console.log('✓ Database pool created successfully with CA cert');
} catch (error) {
  console.error('✗ Failed to create database pool:', error.message);
  throw error;
}
```

### Step 5: Alternative - If No CA Cert Available

Some free tier accounts don't provide CA certificates. In that case, use this simpler SSL config:

```javascript
ssl: {
  rejectUnauthorized: false
}
```

This is already in your code! So if Render still shows SSL errors after deploying, the issue might be:

1. **Wrong credentials** - Double-check your Render environment variables
2. **Aiven service not running** - Check Aiven dashboard
3. **Network timeout** - Aiven free tier might have slow startup

---

## 🔧 Quick Fix for Render + Aiven Free Tier

Since you're using free tier and can't access IP filters, try this:

### Option 1: Use Direct Connection (No Pool)

Sometimes connection pooling causes issues with free tier databases. We can switch to single connections.

### Option 2: Increase Connection Timeout

Add timeout settings to handle slow free-tier connections:

```javascript
ssl: {
  rejectUnauthorized: false
},
connectTimeout: 30000,  // 30 seconds
acquireTimeout: 30000,  // 30 seconds
timeout: 30000,         // 30 seconds
```

### Option 3: Check Aiven Service Status

1. Go to Aiven console
2. Make sure your MySQL service shows **"Running"** (green)
3. If it says "Rebalancing" or "Starting", wait for it to finish
4. Free tier services sometimes hibernate or take time to start

---

## 📝 What to Do Now

1. **Go to Aiven Console**: https://console.aiven.io/
2. **Check Service Status**: Is it "Running"?
3. **Verify Credentials**: Copy them again from Aiven
4. **Update Render**: Make sure environment variables match EXACTLY
5. **Redeploy on Render**: Manual deploy with cache clear

Then share the NEW logs from Render!
