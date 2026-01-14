"use client";

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppSelector } from '@/hooks/useAppSelector';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAppSelector((s) => s.auth.user);

  React.useEffect(() => {
    if (!pathname) return;

    if (user && (user as any).role === 'user') {
      // compute candidate user path by removing /admin prefix
      let candidate = pathname.replace(/^\/admin/, '');
      // remove trailing /edit or /create segments
      candidate = candidate.replace(/\/(edit|create)(?:\/.*)?$/, '');
      if (!candidate) candidate = '/';

      (async () => {
        try {
          const res = await fetch(candidate, { method: 'GET' });
          if (res.ok) {
            router.replace(candidate);
          } else {
            router.replace('/');
          }
        } catch (err) {
          router.replace('/');
        }
      })();
    }
  }, [pathname, user, router]);

  // Always render children to match server-rendered HTML and avoid hydration mismatch
  return <>{children}</>;
}

export default AdminGuard;
