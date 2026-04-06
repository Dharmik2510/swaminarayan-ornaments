# Swaminarayan Ornaments - Admin Panel Guide

This document provides a detailed guide on how to access and use the admin panel for the Swaminarayan Ornaments website.

## 🔓 How to Access the Admin Panel

1. **Navigate to the Admin URL:**
   - **Local Environment:** Open your browser and go to `http://localhost:3000/admin`
   - **Production:** Append `/admin` to your website's main domain (e.g., `https://yourdomain.com/admin`)

2. **Login Credentials:**
   You will be greeted by a login screen. Currently, the application uses a mock backend for simplicity before actual Firebase integration.
   - **Default Password:** `swaminarayan2024`

   Enter this password in the input field and click **Login**.

## ✨ Admin Panel Features

Once logged in, you will have access to the Admin Dashboard where you can manage your product catalog:

- **Add New Products:** Click the "Add Product" button to open the form. You can specify details like name, description, category, purity (carat), price range, image URL, and optionally mark the product as "Featured".
- **Edit Products:** Click the edit icon (✏️) next to any product in the list to modify its details.
- **Delete Products:** Click the trash icon (🗑️) to remove a product. A confirmation prompt will appear to prevent accidental deletions.
- **Reorder Products:** Use the up (⬆️) and down (⬇️) arrows to change the order in which products appear in your digital showroom.

## 🔒 Security Notes & Upcoming Integrations

### Current Implementation
The current authentication and data storage system is built using Firebase. Data and media are securely stored in the cloud.

### Moving to Production
Before making the site public or moving to production, you must set up robust authentication and a cloud database:

1. **Set up Firebase:**
   Create a project on [Firebase](https://firebase.google.com/).
2. **Update `lib/firebase.ts`:**
   Uncomment and configure the Firebase SDK with your actual Firebase Project API keys (`firebaseConfig`).
3. **Migrate Authentication:**
   Replace the hardcoded `swaminarayan2024` password check with Firebase Auth (e.g., email/password or OAuth).
4. **Migrate Database:**
   Update the mock functions (like `getProducts`, `addProduct`) to interact with Firebase Firestore or Realtime Database.

---
*For development purposes, if you wish to change the default password, you can modify it in the `adminLogin` function inside `lib/firebase.ts`.*
