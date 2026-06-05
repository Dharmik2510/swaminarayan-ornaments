import { collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { db } from './firebase-client';
import type { Product, CategoryItem, ActivityLog } from './data';

const PRODUCTS_COLLECTION = 'products';
const CATEGORIES_COLLECTION = 'categories';
const ACTIVITY_LOGS_COLLECTION = 'activityLogs';

export async function getProducts(): Promise<Product[]> {
  const querySnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
  return querySnapshot.docs.map(d => {
    const data = d.data() as Product;
    if (data.images && Array.isArray(data.images)) {
      data.images = data.images.filter(img => typeof img === 'string' && img.trim() !== '' && img !== '//');
    }
    return data;
  }).sort((a,b) => a.order - b.order);
}

export async function getProduct(id: string): Promise<Product | undefined> {
  const docSnap = await getDoc(doc(db, PRODUCTS_COLLECTION, id));
  if (docSnap.exists()) {
    const data = docSnap.data() as Product;
    if (data.images && Array.isArray(data.images)) {
      data.images = data.images.filter(img => typeof img === 'string' && img.trim() !== '' && img !== '//');
    }
    return data;
  }
  return undefined;
}

export async function addProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'order'>): Promise<Product> {
  const products = await getProducts();
  const now = new Date().toISOString();
  const id = `prod-${Date.now()}`;
  const newProduct: Product = { 
    ...product, 
    id, 
    order: products.length + 1, 
    createdAt: now.split('T')[0], 
    updatedAt: now.split('T')[0] 
  };
  await setDoc(doc(db, PRODUCTS_COLLECTION, id), newProduct);
  await logActivity({ action: 'created', entityType: 'product', entityId: id, entityName: newProduct.name });
  return newProduct;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  const now = new Date().toISOString();
  await updateDoc(docRef, { ...updates, updatedAt: now.split('T')[0] });
  const updated = await getProduct(id);
  if (updated) {
    await logActivity({ action: 'updated', entityType: 'product', entityId: id, entityName: updated.name });
    return updated;
  }
  return null;
}

/** Soft-delete: marks the product as deleted. Stays recoverable via the Trash page. */
export async function deleteProduct(id: string): Promise<boolean> {
  const product = await getProduct(id);
  if (!product) return false;
  await updateDoc(doc(db, PRODUCTS_COLLECTION, id), { deletedAt: new Date().toISOString() });
  await logActivity({ action: 'deleted', entityType: 'product', entityId: id, entityName: product.name });
  return true;
}

/** Hard-delete: removes the Firestore doc permanently. */
export async function purgeProduct(id: string): Promise<boolean> {
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return false;
  await deleteDoc(docRef);
  return true;
}

export async function restoreProduct(id: string): Promise<Product | null> {
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  await updateDoc(docRef, { deletedAt: null });
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return snap.data() as Product;
}

export async function duplicateProduct(id: string): Promise<Product | null> {
  const product = await getProduct(id);
  if (!product) return null;
  const { id: _id, createdAt: _c, updatedAt: _u, order: _o, ...rest } = product;
  const dup = await addProduct({ ...rest, name: `${product.name} (Copy)`, status: 'draft' });
  await logActivity({ action: 'duplicated', entityType: 'product', entityId: dup.id, entityName: dup.name });
  return dup;
}

/** Soft-delete many products at once (batched). */
export async function deleteProductsBulk(ids: string[]): Promise<void> {
  const batch = writeBatch(db);
  const now = new Date().toISOString();
  for (const id of ids) {
    batch.update(doc(db, PRODUCTS_COLLECTION, id), { deletedAt: now });
  }
  await batch.commit();
}

export async function purgeProductsBulk(ids: string[]): Promise<void> {
  const batch = writeBatch(db);
  for (const id of ids) batch.delete(doc(db, PRODUCTS_COLLECTION, id));
  await batch.commit();
}

export async function updateProductsBulkCategory(ids: string[], category: string): Promise<void> {
  const batch = writeBatch(db);
  const now = new Date().toISOString().split('T')[0];
  for (const id of ids) {
    batch.update(doc(db, PRODUCTS_COLLECTION, id), { category, updatedAt: now });
  }
  await batch.commit();
}

export async function updateProductsBulkStatus(ids: string[], status: Product['status']): Promise<void> {
  const batch = writeBatch(db);
  const now = new Date().toISOString().split('T')[0];
  for (const id of ids) {
    batch.update(doc(db, PRODUCTS_COLLECTION, id), { status, updatedAt: now });
  }
  await batch.commit();
}

export type BulkEditOps = {
  /** Tags to add to existing (deduplicated) */
  addTags?: string[];
  /** Tags to remove from existing */
  removeTags?: string[];
  /** If set, overrides featured flag */
  featured?: boolean;
  /** If set, overrides carat */
  carat?: 92 | 84;
  /** If set, appends text to description. {{name}} / {{carat}} are substituted. */
  appendDescription?: string;
};

function interpolate(template: string, product: Product): string {
  return template
    .replace(/\{\{\s*name\s*\}\}/g, product.name)
    .replace(/\{\{\s*carat\s*\}\}/g, String(product.carat));
}

export async function applyBulkEdit(ids: string[], ops: BulkEditOps): Promise<void> {
  const now = new Date().toISOString().split('T')[0];
  const hasTagOps = (ops.addTags?.length ?? 0) > 0 || (ops.removeTags?.length ?? 0) > 0;
  const hasAppend = !!ops.appendDescription?.trim();

  // Tag and description changes need per-product read-modify-write.
  if (hasTagOps || hasAppend) {
    for (const id of ids) {
      const p = await getProduct(id);
      if (!p) continue;
      const updates: Partial<Product> = { updatedAt: now };
      if (hasTagOps) {
        const remove = new Set((ops.removeTags ?? []).map(t => t.toLowerCase()));
        const current = (p.tags ?? []).filter(t => !remove.has(t.toLowerCase()));
        const merged = new Set(current.map(t => t.toLowerCase()));
        (ops.addTags ?? []).forEach(t => merged.add(t.toLowerCase()));
        updates.tags = Array.from(merged);
      }
      if (ops.featured !== undefined) updates.featured = ops.featured;
      if (ops.carat !== undefined) updates.carat = ops.carat;
      if (hasAppend) {
        const prefix = p.description ? `${p.description}\n\n` : '';
        updates.description = `${prefix}${interpolate(ops.appendDescription!.trim(), p)}`;
      }
      await updateDoc(doc(db, PRODUCTS_COLLECTION, id), updates as { [k: string]: unknown });
    }
    return;
  }

  // Simple flag-only changes batch nicely.
  if (ops.featured === undefined && ops.carat === undefined) return;
  const batch = writeBatch(db);
  const updates: Record<string, unknown> = { updatedAt: now };
  if (ops.featured !== undefined) updates.featured = ops.featured;
  if (ops.carat !== undefined) updates.carat = ops.carat;
  for (const id of ids) batch.update(doc(db, PRODUCTS_COLLECTION, id), updates);
  await batch.commit();
}

export async function reorderProducts(productIds: string[]): Promise<void> {
  const batch = writeBatch(db);
  productIds.forEach((id, index) => {
    batch.update(doc(db, PRODUCTS_COLLECTION, id), { order: index + 1 });
  });
  await batch.commit();
}

// category functions
export async function getCategories(): Promise<CategoryItem[]> {
  const querySnapshot = await getDocs(collection(db, CATEGORIES_COLLECTION));
  return querySnapshot.docs.map(d => d.data() as CategoryItem).sort((a,b) => a.order - b.order);
}

export async function getCategoryNames(): Promise<string[]> {
  const cats = await getCategories();
  return cats.map(c => c.name);
}

export async function addCategory(data: Omit<CategoryItem, 'id' | 'createdAt' | 'order'>): Promise<CategoryItem> {
  const cats = await getCategories();
  const id = `cat-${Date.now()}`;
  const newCat: CategoryItem = {
    ...data,
    id,
    order: cats.length + 1,
    createdAt: new Date().toISOString().split('T')[0],
  };
  await setDoc(doc(db, CATEGORIES_COLLECTION, id), newCat);
  await logActivity({ action: 'created', entityType: 'category', entityId: id, entityName: newCat.name });
  return newCat;
}

export async function updateCategory(id: string, updates: Partial<Omit<CategoryItem, 'id' | 'createdAt'>>): Promise<CategoryItem | null> {
  const docRef = doc(db, CATEGORIES_COLLECTION, id);
  await updateDoc(docRef, updates);
  const snap = await getDoc(docRef);
  const cat = snap.data() as CategoryItem;
  await logActivity({ action: 'updated', entityType: 'category', entityId: id, entityName: cat.name });
  return cat;
}

export async function deleteCategory(id: string): Promise<boolean> {
  const docRef = doc(db, CATEGORIES_COLLECTION, id);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return false;
  const cat = snap.data() as CategoryItem;
  await deleteDoc(docRef);
  await logActivity({ action: 'deleted', entityType: 'category', entityId: id, entityName: cat.name });
  return true;
}

export async function reorderCategories(ids: string[]): Promise<void> {
  const batch = writeBatch(db);
  ids.forEach((id, index) => {
    batch.update(doc(db, CATEGORIES_COLLECTION, id), { order: index + 1 });
  });
  await batch.commit();
}

interface LogInput {
  action: ActivityLog['action'];
  entityType: ActivityLog['entityType'];
  entityId: string;
  entityName: string;
}

export async function logActivity(input: LogInput, user = 'Admin'): Promise<void> {
  const id = `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const entry: ActivityLog = {
    id,
    ...input,
    timestamp: new Date().toISOString(),
    user,
  };
  await setDoc(doc(db, ACTIVITY_LOGS_COLLECTION, id), entry);
}

export async function getActivityLogs(limitCount = 20): Promise<ActivityLog[]> {
  const querySnapshot = await getDocs(collection(db, ACTIVITY_LOGS_COLLECTION));
  const logs = querySnapshot.docs.map(d => d.data() as ActivityLog);
  // manual sort since we are not using composite index initially
  logs.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return logs.slice(0, limitCount);
}

export async function clearActivityLogs(): Promise<void> {
  // Not practical to delete without knowing IDs, but let's query all and batch delete
  const snapshot = await getDocs(collection(db, ACTIVITY_LOGS_COLLECTION));
  const batch = writeBatch(db);
  snapshot.docs.forEach(d => batch.delete(d.ref));
  await batch.commit();
}

const MEDIA_COLLECTION = 'media';
export interface MediaItem {
  id: string;
  url: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  tags: string[];
}
export async function getMediaItems(): Promise<MediaItem[]> {
  const querySnapshot = await getDocs(collection(db, MEDIA_COLLECTION));
  const items = querySnapshot.docs.map(d => d.data() as MediaItem);
  return items.sort((a,b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
}

export async function addMediaItem(item: Omit<MediaItem, 'id' | 'uploadedAt'>): Promise<MediaItem> {
  const id = `media-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const newItem: MediaItem = {
    ...item,
    id,
    uploadedAt: new Date().toISOString(),
  };
  await setDoc(doc(db, MEDIA_COLLECTION, id), newItem);
  return newItem;
}

export async function deleteMediaItem(id: string): Promise<boolean> {
  const docRef = doc(db, MEDIA_COLLECTION, id);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return false;
  await deleteDoc(docRef);
  return true;
}

export async function updateMediaItemTags(id: string, tags: string[]): Promise<void> {
  await updateDoc(doc(db, MEDIA_COLLECTION, id), { tags });
}
