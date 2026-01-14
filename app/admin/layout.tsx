import React from 'react';
import AdminGuard from '@/components/auth/AdminGuard';

export const metadata = {
  title: 'Admin',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminGuard>{children}</AdminGuard>;
}
