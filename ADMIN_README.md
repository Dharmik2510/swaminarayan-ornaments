# Swaminarayan Ornaments — Admin Panel Guide

This document outlines the usage steps and functionalities available to administrators of the **Swaminarayan Ornaments** digital platform. The admin panel empowers authorized users to manage the showroom's inventory, media, and taxonomy securely.

## 1. Accessing the Admin Panel

- **URL:** Navigate to `/admin` in your browser.
- **Authentication:** The dashboard is protected via an authentication gate. Use the configured master password to log in.
- **Security:** The admin panel is restricted. Ensure your `ADMIN_PASSWORD` environment variable (or relevant constant in `lib/store.ts` / your env file) is set securely for production.

---

## 2. Dashboard Overview

Upon logging in, you are presented with a live overview of your catalog data drawn directly from **Firebase Firestore**.

- **Stats Row:** View a quick summary of total products, active products, drafts, and featured items.
- **Recent Activity:** Review the latest items added or updated in your catalog.
- **Category Summary:** See all available categories alongside the number of products within each.
- **Quick Links:** Instantly navigate to core pages like "Add Product," "Media Library," and "Categories" using quick action buttons.

---

## 3. Product Management

Administrators have full CRUD (Create, Read, Update, Delete) capabilities over the jewelry items showcased in the digital storefront. All data is saved to Firestore.

### Adding a New Product
1. From the Dashboard or Products page, click **Add Product**.
2. **Details:** Fill out fundamental fields like Product Name, Description (material/design details), and select a Category.
3. **Attributes:** Define specifics such as Carat Purity (e.g., 22K or 18K Gold) and search Tags.
4. **Media Upload:** Upload up to 8 images. Images are processed and stored in **Firebase Storage**. You can drag and drop to reorder; the first image becomes the primary thumbnail.
5. **SEO & Visibility:** Customize the SEO Title and Description. Choose a status:
   - **Active:** Live on the showroom.
   - **Draft:** Saved, but hidden from visitors.
   - **Archived:** Hidden and retired.
6. **Publishing:** Toggle the "Featured" flag if you want the item on the homepage, then hit **Publish** or **Save Draft**.

### Editing an Existing Product
- Click on any product row from the Products list to enter the editor.
- Changes auto-save as drafts or you can explicitly update the live item.
- Update tags, descriptions, and active status as needed.

### Duplicating & Deleting
- **Duplicate:** Use the copy icon next to a product to clone it as a draft immediately. Useful when adding similar variations of jewelry.
- **Delete:** Remove products permanently with the trash icon (requires confirmation).

### Bulk Actions & Filtering
- Use the central search bar on the Products page to filter by name or tags.
- Select multiple products via checkboxes to apply bulk actions like status changes (Activate/Draft), category reassignment, or bulk deletion.

---

## 4. Category Management

Categories dictate the primary navigation for normal users visiting the site. 

### Functionalities:
- **Create:** Click **New Category**, provide a name, and an optional description. The system typically generates a URL-safe slug automatically.
- **Edit:** Update category names and descriptions inline.
- **Reorder:** Change the frontend display order of categories so that your most important collections (e.g., Necklaces) appear first.
- **Delete:** Remove obsolete categories. *Note: Products bound to deleted categories will remain in the database but will lose their category assignment.*

---

## 5. Media Library

A centralized repository for uploading and organizing imagery independent of the product creation workflow. 

### Functionalities:
- **Upload Center:** Drag and drop files to upload directly to Firebase Storage. The app automatically handles size compression where applicable.
- **Image Tagging:** Click any image to add distinct tags, making it easier to search through the library later.
- **Gallery Deletion:** Remove images no longer needed. *Note: Be cautious not to delete images currently assigned to active products.*

---

## 6. Real-Time Cloud Integration

This admin panel no longer uses mock or local local-storage data. 
- **Database:** It is fully integrated with **Firebase Firestore**. Any change in the admin panel reflects asynchronously and seamlessly across the application.
- **Storage:** Product photos are persisted in **Firebase Storage** with structured paths, ensuring fast delivery and scalability.
