# 🔐 Security Guide - Remove Sensitive Files from Git

## Current Status
✅ **Good News**: Your `.env` files are properly listed in `.gitignore` and have NOT been committed to GitHub.

## Files That Should Never Be Committed

### Backend Secrets (backend/.env)
- Database credentials (DB_HOST, DB_PASSWORD)
- JWT_SECRET keys
- API keys
- Server configuration

### Frontend Configuration (frontend/.env)
- API endpoints (can be public but better in .env.local)
- Build configuration

---

## Step-by-Step Solution

### Step 1: Verify .gitignore is Correct ✅

Your `.gitignore` files are already configured correctly:

**Root `.gitignore`:**
```
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

**Backend `.gitignore`:**
```
.env
```

**Frontend `.gitignore`:**
```
.env
.env.local
```

### Step 2: Check Git History

Run this command to verify no `.env` files were ever committed:
```bash
git log --all --full-history -- "**/.env"
```

If nothing appears, you're safe! ✅

### Step 3: Create .env.example Files

Already done! You have:
- `backend/.env` (actual values, ignored by git)
- `frontend/.env.example` (template, safe for git)
- `frontend/.env.production` (production values, should be added to .gitignore)

### Step 4: Add frontend/.env.production to .gitignore

This file contains production URLs and should be ignored:

Add to your root `.gitignore`:
```
frontend/.env.production
```

---

## Best Practices

### 1. Use Environment Variables Properly

**Backend:**
- Keep all secrets in `backend/.env`
- Create `backend/.env.example` with placeholder values
- Never commit real credentials

**Frontend:**
- Use `.env.local` for local development
- Use `.env.example` as a template
- Store production env vars in Vercel/Netlify dashboard

### 2. If You Accidentally Committed Secrets

If you ever commit sensitive files, follow these steps:

#### Option A: File was just staged (not committed)
```bash
git reset HEAD .env
rm .env  # Remove the file
```

#### Option B: File was committed in last commit
```bash
git reset --soft HEAD~1
git reset HEAD .env
rm .env
git commit -m "New commit without .env"
```

#### Option C: File was committed multiple commits ago
Use BFG Repo-Cleaner or git filter-branch:
```bash
# Install BFG first
bfg --delete-files .env
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push origin --force --all
```

⚠️ **WARNING**: Force pushing rewrites history. Coordinate with your team!

### 3. Rotate Compromised Secrets

If you accidentally pushed secrets to GitHub:

1. **Change database password immediately**
   - Update in Aiven console
   - Update `backend/.env` with new password

2. **Generate new JWT secret**
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```
   - Update `backend/.env`

3. **Update deployment platforms**
   - Render: Update environment variables in dashboard
   - Vercel: Update environment variables in dashboard

---

## Current Action Items

### Immediate Tasks:
1. ✅ Verify .gitignore is correct
2. ✅ Check git history for .env files
3. ⏳ Add `frontend/.env.production` to .gitignore
4. ⏳ Create `backend/.env.example` file
5. ⏳ Test that frontend connects to backend

### Security Checklist:
- [ ] No .env files in git history
- [ ] Database password is strong
- [ ] JWT secret is randomly generated
- [ ] Production credentials differ from development
- [ ] Team members know not to commit .env files

---

## Troubleshooting Frontend Connection Issues

If frontend shows 500 errors:

1. **Check backend is running:**
   ```bash
   cd backend
   npm start
   ```

2. **Verify backend URL in frontend:**
   - Local: `VITE_API_BASE_URL=http://localhost:5000/api`
   - Production: `VITE_API_BASE_URL=https://your-backend.onrender.com/api`

3. **Test backend health endpoint:**
   ```
   http://localhost:5000
   http://localhost:5000/api
   ```

4. **Check CORS settings:**
   - Backend should allow requests from frontend origin
   - Check `backend/server.js` cors() configuration

5. **Verify database connection:**
   - Check backend logs for database connection errors
   - Ensure MySQL credentials are correct

---

## Quick Commands Reference

```bash
# Check if .env is tracked
git ls-files | findstr ".env"

# See what's ignored
git check-ignore -v .env

# Remove cached file (if accidentally added)
git rm --cached .env

# Force push after cleaning history
git push origin --force --all
```

---

## Summary

Your repository is currently secure! The `.env` files are properly ignored. Just need to:
1. Add `frontend/.env.production` to `.gitignore`
2. Create `backend/.env.example` for documentation
3. Test the frontend-backend connection
