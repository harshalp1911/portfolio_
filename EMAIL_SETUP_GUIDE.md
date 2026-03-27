# 📧 Email Setup Guide for Contact Form

## Overview
Your portfolio contact form now sends emails using **Nodemailer** with Gmail SMTP. When someone fills out the contact form, emails are sent to the admin email you configure in the admin panel settings.

---

## 🔧 Setup Steps

### 1. **Enable Gmail App Password**

Since Gmail requires 2-factor authentication for app access, you need to generate an **App Password**:

#### Steps:
1. Go to your Google Account: https://myaccount.google.com/
2. Click **Security** in the left sidebar
3. Under "Signing in to Google", enable **2-Step Verification** (if not already enabled)
4. After enabling 2-Step Verification, go back to **Security**
5. Under "Signing in to Google", click **App passwords**
6. Select:
   - **App**: Mail
   - **Device**: Other (Custom name) - type "Portfolio Contact Form"
7. Click **Generate**
8. Copy the **16-character password** (e.g., `abcd efgh ijkl mnop`)

---

### 2. **Update `.env` File**

Open `server/.env` and update these values:

```env
EMAIL_USER=your.actual.email@gmail.com
EMAIL_PASS=abcdefghijklmnop
```

**Important:**
- `EMAIL_USER`: Your Gmail address (the one you generated app password for)
- `EMAIL_PASS`: The 16-character app password (remove spaces)

---

### 3. **Configure Admin Settings**

1. Go to **Admin Panel** → **Settings**
2. Fill in your contact information:
   - **Email**: Where you want to receive contact form submissions
   - **Phone**: Your contact number
   - **Address**: Your location
   - **LinkedIn**: Your LinkedIn profile URL
   - **GitHub**: Your GitHub profile URL
   - **Twitter** (optional)
   - **Instagram** (optional)
3. Click **Save Settings**

---

## 🎯 How It Works

### When someone submits the contact form:

1. **Email to Admin** (you):
   - Sent to the email you configured in Admin Settings
   - Contains: sender's name, email, and message
   - Subject: "New Contact Form Submission from [Name]"

2. **Auto-reply to User**:
   - Sent to the person who filled the form
   - Thanks them for reaching out
   - Includes a copy of their message

### Dynamic Updates:

When you update settings in the admin panel, the entire website updates automatically:
- ✅ Contact page shows your new email, phone, address
- ✅ Social media icons update with your links
- ✅ Contact form emails go to your new email address
- ✅ No code changes needed!

---

## 🧪 Testing

1. **Start Backend Server**:
   ```bash
   cd server
   npm run dev
   ```

2. **Start Frontend**:
   ```bash
   cd client
   npm start
   ```

3. **Test Contact Form**:
   - Go to Contact page
   - Fill in the form
   - Click "Send Message"
   - Check your email inbox (the one in Admin Settings)
   - You should receive the contact form submission
   - The sender should receive an auto-reply

---

## ⚠️ Troubleshooting

### "Failed to send message" error:

**Check:**
1. ✅ `.env` file has correct `EMAIL_USER` and `EMAIL_PASS`
2. ✅ App password is correct (16 characters, no spaces)
3. ✅ 2-Step Verification is enabled on Gmail
4. ✅ Admin Settings email is configured
5. ✅ Backend server is running

### Email not received:

**Check:**
1. ✅ Spam/Junk folder
2. ✅ Admin Settings email is correct
3. ✅ Gmail account has sending limits (500 emails/day for free accounts)
4. ✅ Backend console for error messages

---

## 📝 Example Configuration

**`.env` file:**
```env
EMAIL_USER=harshalp0602@gmail.com
EMAIL_PASS=abcdefghijklmnop
```

**Admin Settings:**
```
Email: harshalp0602@gmail.com
Phone: +91 9158508339
Address: Nagpur, Maharashtra, India
LinkedIn: https://linkedin.com/in/harshalp0011
GitHub: https://github.com/harshalp1911
```

---

## 🚀 Ready to Use!

Once configured, your contact form will:
- ✅ Send emails to your admin settings email
- ✅ Send auto-replies to users
- ✅ Display dynamic contact info throughout the site
- ✅ Update social links automatically

**No more hardcoded values!** Everything is controlled from the admin panel.
