'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import { getProduct } from '@/lib/firebase';
import AdminProductForm from '@/components/admin/AdminProductForm';

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const getProductPromise = getProduct(id);
  const product = use(getProductPromise);

  if (!product) notFound();

  return <AdminProductForm product={product} />;
}
