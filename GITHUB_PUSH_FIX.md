# 🔧 Fix GitHub Push Permission Error

**Error**: `Permission to manasshinde369/Mayur-Paints.git denied to Manas0624`

**Cause**: You're authenticated with the wrong GitHub account (`Manas0624` instead of `manasshinde369`)

---

## ✅ Solution Options

### Option 1: Use GitHub Personal Access Token (Recommended)

#### Step 1: Create Personal Access Token
```
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name: "Mayur Paints Project"
4. Select scopes:
   ✅ repo (all)
   ✅ workflow
5. Click "Generate token"
6. COPY THE TOKEN (you won't see it again!)
```

#### Step 2: Update Remote URL with Token
```powershell
# Remove old remote
git remote remove origin

# Add new remote with token
git remote add origin https://YOUR_TOKEN@github.com/manasshinde369/Mayur-Paints.git

# Example:
# git remote add origin https://ghp_xxxxxxxxxxxxxxxxxxxx@github.com/manasshinde369/Mayur-Paints.git
```

#### Step 3: Push
```powershell
git push -u origin main
```

---

### Option 2: Clear Windows Credentials

#### Step 1: Open Credential Manager
```
1. Press Windows Key
2. Type "Credential Manager"
3. Click "Windows Credentials"
4. Find entries for "git:https://github.com"
5. Click each one → "Remove"
```

#### Step 2: Push Again (Will Ask for Login)
```powershell
git push -u origin main
```
When prompted:
- Username: `manasshinde369`
- Password: Use Personal Access Token (not your GitHub password!)

---

### Option 3: Use SSH Instead of HTTPS

#### Step 1: Generate SSH Key (if you don't have one)
```powershell
ssh-keygen -t ed25519 -C "manasshinde369@users.noreply.github.com"
# Press Enter for all prompts (use default location)
```

#### Step 2: Copy SSH Public Key
```powershell
cat ~/.ssh/id_ed25519.pub
# Copy the entire output
```

#### Step 3: Add to GitHub
```
1. Go to: https://github.com/settings/keys
2. Click "New SSH key"
3. Title: "Mayur Paints PC"
4. Paste the key
5. Click "Add SSH key"
```

#### Step 4: Change Remote to SSH
```powershell
git remote remove origin
git remote add origin git@github.com:manasshinde369/Mayur-Paints.git
git push -u origin main
```

---

## 🚀 Quick Fix (Easiest)

### Use Personal Access Token in URL

1. **Create token**: https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Select "repo" scope
   - Generate and COPY token

2. **Run these commands**:
```powershell
# Remove old remote
git remote remove origin

# Add with token (replace YOUR_TOKEN with actual token)
git remote add origin https://YOUR_TOKEN@github.com/manasshinde369/Mayur-Paints.git

# Push
git push -u origin main
```

---

## 📝 Before Pushing - Check What Will Be Pushed

```powershell
# Check status
git status

# Check what files changed
git diff

# Check commit history
git log --oneline -5
```

---

## 🎯 Complete Push Commands

### If you haven't committed yet:
```powershell
# Stage all changes
git add .

# Commit with message
git commit -m "Complete payment system implementation with QR code and admin verification"

# Push
git push -u origin main
```

### If you already committed:
```powershell
# Just push
git push -u origin main
```

---

## ⚠️ Important Notes

### Don't Commit Sensitive Files!

Make sure `.env` is in `.gitignore`:
```powershell
# Check if .env is ignored
git check-ignore server/.env

# If not, add to .gitignore
echo "server/.env" >> .gitignore
echo ".env" >> .gitignore
git add .gitignore
git commit -m "Add .env to gitignore"
```

### Files to NEVER commit:
- ❌ `server/.env` (contains secrets)
- ❌ `node_modules/` (too large)
- ❌ `uploads/` (user uploaded files)
- ❌ `.DS_Store` (Mac files)
- ❌ `*.log` (log files)

---

## 🔍 Verify .gitignore

Check your `.gitignore` file includes:
```
# Dependencies
node_modules/
server/node_modules/

# Environment variables
.env
server/.env
.env.local
.env.production

# Uploads
uploads/
server/uploads/

# Build
dist/
build/

# Logs
*.log
npm-debug.log*

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
```

---

## ✅ Recommended Approach

**Use Personal Access Token (Option 1)**

1. Create token: https://github.com/settings/tokens
2. Copy token
3. Run:
```powershell
git remote remove origin
git remote add origin https://YOUR_TOKEN@github.com/manasshinde369/Mayur-Paints.git
git push -u origin main
```

---

## 🆘 If Still Having Issues

### Check Current User
```powershell
git config user.name
git config user.email
```

### Set Correct User
```powershell
git config user.name "manasshinde369"
git config user.email "manasshinde369@users.noreply.github.com"
```

### Force Push (Use Carefully!)
```powershell
git push -u origin main --force
```

---

## 📞 Need Help?

If you're still stuck:
1. Check GitHub status: https://www.githubstatus.com/
2. Verify repository exists: https://github.com/manasshinde369/Mayur-Paints
3. Check you have write access to the repository
4. Try creating a new repository and pushing there

---

## 🎉 After Successful Push

Verify on GitHub:
```
https://github.com/manasshinde369/Mayur-Paints
```

You should see:
- ✅ All your code files
- ✅ Latest commit message
- ✅ Updated timestamp
- ✅ README.md (if you have one)

---

**Good luck with your push!** 🚀
