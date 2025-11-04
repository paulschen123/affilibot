# 📸 Instagram API Setup Guide

## Overview
AffilBot now supports **automatic** and **manual** posting to Instagram! This guide will walk you through setting up the Instagram Graph API.

---

## 🎯 What You'll Get

### ✅ **Automatic Posting** (Option A)
- When you **approve an offer**, it automatically posts to Instagram
- No manual intervention needed
- Toggle on/off from the dashboard header

### ✅ **Manual Posting** (Option B)
- Click **"Post to Instagram"** button on approved offers
- Review before posting
- Full control over what gets posted

---

## 📋 Prerequisites

1. **Instagram Business Account** (not personal)
2. **Facebook Page** connected to your Instagram
3. **Meta Developer Account**

---

## 🚀 Step-by-Step Setup

### Step 1: Convert to Instagram Business Account

1. Open Instagram app
2. Go to **Settings** → **Account**
3. Switch to **Professional Account**
4. Choose **Business**
5. Complete the setup

### Step 2: Create a Facebook Page

1. Go to [facebook.com/pages/create](https://facebook.com/pages/create)
2. Create a new page for your business
3. Connect it to your Instagram Business Account:
   - Instagram Settings → **Linked Accounts** → **Facebook**

### Step 3: Create Meta Developer App

1. Go to [developers.facebook.com](https://developers.facebook.com/)
2. Click **"My Apps"** → **"Create App"**
3. Choose **"Business"** as app type
4. Fill in app details:
   - **App Name:** "AffilBot" (or your choice)
   - **Contact Email:** Your email
5. Click **Create App**

### Step 4: Add Instagram Graph API

1. In your app dashboard, click **"Add Product"**
2. Find **"Instagram Graph API"** and click **"Set Up"**
3. This adds Instagram API to your app

### Step 5: Get Access Token

#### Option A: Using Graph API Explorer (Quick Test)
1. Go to [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Select your app from dropdown
3. Click **"Generate Access Token"**
4. Grant permissions:
   - `instagram_basic`
   - `instagram_content_publish`
   - `pages_read_engagement`
5. Copy the **Access Token**

#### Option B: Long-lived Token (Production)
1. Get short-lived token from above
2. Exchange it for long-lived token using this URL:
```
https://graph.facebook.com/v18.0/oauth/access_token?
grant_type=fb_exchange_token&
client_id=YOUR_APP_ID&
client_secret=YOUR_APP_SECRET&
fb_exchange_token=SHORT_LIVED_TOKEN
```
3. Copy the returned access token

### Step 6: Get Instagram Business Account ID

1. Go to [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Use your access token
3. Make this request:
```
GET /me/accounts
```
4. Find your Facebook Page ID
5. Then request:
```
GET /{PAGE_ID}?fields=instagram_business_account
```
6. Copy the `instagram_business_account.id`

---

## 🔧 Configure AffilBot

### For Vercel Deployment:

1. Go to [Vercel Dashboard](https://vercel.com/paulschens-projects/affilibot)
2. Click **Settings** → **Environment Variables**
3. Add these variables:

```
INSTAGRAM_ACCESS_TOKEN=your_access_token_here
INSTAGRAM_BUSINESS_ACCOUNT_ID=your_business_account_id_here
```

4. Click **Save**
5. Redeploy your app (automatic on next git push)

### For Local Development:

1. Create `.env` file in project root:
```bash
PORT=3001
INSTAGRAM_ACCESS_TOKEN=your_access_token_here
INSTAGRAM_BUSINESS_ACCOUNT_ID=your_business_account_id_here
```

2. Restart your server:
```bash
npm start
```

---

## 🎮 How to Use

### Enable Auto-Posting:

1. Open your AffilBot dashboard
2. Click the **"📸 Auto-Post OFF"** button in the header
3. It will turn green: **"📸 Auto-Post ON"**
4. Now when you approve offers, they automatically post to Instagram!

### Manual Posting:

1. Click **"Find New Offers"** to discover offers
2. **Approve** an offer you like
3. Click the **"📸 Post to Instagram"** button
4. Wait for confirmation message
5. Check your Instagram!

---

## 📝 What Gets Posted

AffilBot automatically generates Instagram captions like this:

```
🔥 Amazing Deal Alert! 🔥

Premium Fitness Tracker - 30 Day Trial

💰 Earn €15.50 commission!
🏢 Network: ShareASale
📂 Category: Health & Fitness

Check it out now! Limited time offer 🚀

#affiliate #deals #savings #healthfitness #affiliatemarketing #earnmoney
```

---

## ⚠️ Important Notes

### Text-Only Posts
- Currently posts **text-only** (no images required!)
- Perfect for quick deal announcements
- Add image support later if needed

### Access Token Expiration
- **Short-lived tokens:** Expire in 1-2 hours
- **Long-lived tokens:** Last 60 days
- Use long-lived tokens for production
- Refresh before expiration

### Rate Limits
- Instagram API has rate limits
- Don't post too frequently
- Recommended: Max 25 posts per day

### App Review (Optional)
- For public apps, submit for Instagram Graph API review
- Not needed for testing with your own account
- Required if using with other users' accounts

---

## 🐛 Troubleshooting

### "Instagram API not configured" Warning
**Solution:** Make sure environment variables are set in Vercel/local .env

### "Failed to post to Instagram"
**Possible causes:**
- Expired access token → Get new token
- Wrong Business Account ID → Double-check ID
- Missing permissions → Re-authorize with all permissions
- Rate limit reached → Wait and try again

### Posts Not Appearing
**Check:**
- Is your Instagram account a Business account?
- Is it linked to a Facebook Page?
- Are all API permissions granted?

---

## 🔗 Useful Links

- [Instagram Graph API Docs](https://developers.facebook.com/docs/instagram-api/)
- [Meta Developer Console](https://developers.facebook.com/apps/)
- [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
- [Access Token Debugger](https://developers.facebook.com/tools/debug/accesstoken/)

---

## 🎉 You're All Set!

Once configured, you can:
- ✅ Auto-post approved offers to Instagram
- ✅ Manually post with one click
- ✅ Track all posts in the dashboard
- ✅ Monitor views, likes, and comments

**Happy Posting! 📸💰**
