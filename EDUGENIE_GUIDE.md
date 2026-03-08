# 🧞 EduGenie - AI Chatbot Integration Guide

## ✨ What is EduGenie?

**EduGenie** is your LMS's built-in AI learning assistant, powered by Hugging Face's Mistral-7B-Instruct model. It provides ChatGPT-like capabilities directly within your application!

---

## 🚀 Setup Instructions

### Step 1: Get Your Hugging Face Token

1. Go to https://huggingface.co/settings/tokens
2. Click "Create New Token"
3. Give it a name (e.g., "EduGenie")
4. Copy the token (starts with `hf_`)

### Step 2: Configure Environment Variables

#### For Local Development:
Add to `frontend/.env`:
```env
VITE_HUGGINGFACE_TOKEN=YOUR_TOKEN_HERE
```

Replace `YOUR_TOKEN_HERE` with your actual Hugging Face token.

#### For Production (Vercel):
1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add new variable:
   - **Name:** `VITE_HUGGINGFACE_TOKEN`
   - **Value:** [Your Hugging Face token]
   - **Environments:** Production, Preview, Development

### Step 3: Test EduGenie
1. Navigate to any page (Dashboard, Courses, etc.)
2. Click the **"EduGenie"** button in the bottom-right corner
3. Type a message and press Enter
4. Watch the AI respond! 🎉

---

## 💡 Usage Examples

### Student Questions:
```
- "Explain quantum computing in simple terms"
- "What's the difference between HTML and CSS?"
- "Help me understand Python functions"
- "Summarize the French Revolution"
- "What are the best study techniques?"
```

---

## 🔒 Security Notes

### ⚠️ IMPORTANT:
- **NEVER commit your `.env` file** with real tokens to GitHub
- The `.env.example` file is provided as a template
- Your actual token is in `.gitignore`
- Token is loaded via environment variable (secure)

---

## 🐛 Troubleshooting

### Issue: "Failed to get response from AI"
**Solutions:**
1. Verify token in `.env` is correct
2. Check internet connection
3. Wait a few minutes if rate limited
4. Try a different model

---

## 🎉 Enjoy Your AI Assistant!

EduGenie is now fully integrated into your LMS!

**Happy Learning! 🧞✨📚**
