# Swaminarayan Ornaments — Admin Panel Guide

## Accessing the Admin Panel

Navigate to `/admin` in your browser.

**Default password:** `swaminarayan2024`

Change this in `lib/store.ts` → `ADMIN_PASSWORD` constant before going live.

All data is stored in Firebase Firestore and images in Firebase Storage.

---

## Dashboard

The first screen after login shows a live overview:

| Section | What it shows |
|---|---|
| Stats row | Total products · Active · Drafts · Featured |
| Recent Products | Last 5 products added, with thumbnail and status |
| Activity Log | Last 15 create / update / delete / duplicate events |
| Categories | All categories with per-category product count |

Click **Add Product** (top right) or **View all** links to navigate to sub-pages.

---

## Products

### Adding a product

1. Click **Add Product** from the dashboard or **New Product** from the Products page.
2. Fill in the required fields (marked with \*):
   - **Product Name** — used throughout the store.
   - **Description** — describe materials, design, and occasion suitability.
   - **Category** — pick from your configured categories.
3. Optional fields:
   - **Carat Purity** — 92 (22K) or 84 (18K).
   - **Tags** — press Enter or comma after each tag. Tags help with search.
   - **Images** — drag-and-drop or click to upload. Up to 8 images per product.
   - **SEO Title / Description** — defaults to product name / description if left blank.
4. Set **Status**:
   - `Active` — visible in the storefront.
   - `Draft` — hidden from the store; saved for later.
   - `Archived` — permanently hidden.
5. Toggle **Featured Product** to surface it in the featured collection.
6. Click **Publish** to save as active, or **Save Draft** to save without publishing.

### Editing a product

Click the edit icon (pencil) on any row in the Products list, or click a product name. Changes auto-save as a draft every 2 seconds while you type.

### Images

- Drag images in the upload zone or click to browse.
- Drag thumbnails to reorder — the first image is the **main** image shown in the store.
- Click the star icon on a thumbnail to set it as the main image.
- Images are automatically compressed to reduce storage size.

### Searching and filtering

The search box on the Products page filters by name, description, and tags in real time. Use the dropdowns to filter by **category** and **status**. Click column headers to sort.

### Bulk actions

1. Check the boxes next to one or more products (or use the header checkbox to select all on the page).
2. Choose an action from the **Choose action** dropdown:
   - Set Active / Draft / Archived
   - Assign to a category
   - Delete selected
3. Click **Apply**.

### Duplicating a product

Click the copy icon on a product row. A duplicate is created instantly as a `draft`, ready for editing.

### Deleting a product

Click the trash icon. A confirmation dialog will appear before deletion.

---

## Categories

Categories group your products. The storefront uses category names for filtering.

### Adding a category

1. Click **New Category**.
2. Enter a **Name** — the slug is generated automatically.
3. Optionally edit the **Slug** (used in URLs) and add a **Description**.
4. Click **Create**.

### Editing a category

Click the pencil icon on any category row. Edit inline and click **Save**.

> Updating a category name does **not** automatically update products that reference the old name. Reassign products via bulk actions on the Products page if you rename a category.

### Reordering categories

Use the up/down arrows on the left side of each category row to change display order.

### Deleting a category

Click the trash icon. If the category has products, you will be warned — the products remain but will have no category assigned.

---

## Media Library

A central store for uploaded images, independent of products.

### Uploading images

- Drag files into the drop zone, or click **Upload**.
- Multiple files can be uploaded at once.
- All images are compressed automatically.

### Tagging images

1. Click an image thumbnail to open the detail panel.
2. Type a tag and press Enter (or click the tag icon).
3. Click the × on any tag to remove it.

Tags help you find images later when assigning them to products.

### Deleting images

Hover over a thumbnail and click the trash icon, or open the detail panel and delete from there.

> Deleting from the Media Library does **not** remove the image from products that already use it.

---

## Security Notes

- The admin panel uses Firebase Authentication for secure access.
- The default password `swaminarayan2024` should be changed before deployment.
- All data is stored client-side. For a shared/multi-device setup, migrate to a real database (Firebase, Supabase, etc.).

---

## Keyboard & UX shortcuts

| Action | How |
|---|---|
| Add tag (product form) | Type tag → press **Enter** or **,** |
| Confirm modal default | **Enter** |
| Dismiss modal | **Esc** or click overlay |
| Navigate back | Browser back, or the ← button in the form header |

---

## Data Model Reference

```
Product
  id          string     Auto-generated
  name        string     Required
  description string     Required
  carat       92 | 84    Gold purity
  category    string     Must match a Category name
  tags        string[]   Lowercase
  images      string[]   Base64 data URLs, first = primary
  featured    boolean    
  status      active | draft | archived
  seoTitle    string     Optional
  seoDescription string  Optional
  createdAt   string     ISO date
  updatedAt   string     ISO date

Category
  id          string
  name        string
  slug        string     URL-safe version of name
  description string     Optional
  order       number     Display order

MediaItem
  id          string
  name        string     Original filename
  dataUrl     string     Compressed base64
  size        number     Original file size (bytes)
  type        string     MIME type
  tags        string[]
  uploadedAt  string     ISO date
```
