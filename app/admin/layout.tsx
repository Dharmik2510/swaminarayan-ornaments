import type { Metadata } from 'next';
import AdminShell from '@/components/admin/AdminShell';

export const metadata: Metadata = {
  title: 'Admin Panel | Swaminarayan Ornaments',
  description: 'Manage products, categories, and settings.',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Admin-only faces. The storefront self-hosts its own fonts. */}
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      {/* eslint-disable-next-line @next/next/no-page-custom-font -- this layout wraps every admin route */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=JetBrains+Mono:wght@400;500&display=swap" precedence="default" />
      <AdminShell>{children}</AdminShell>
    </>
  );
}
