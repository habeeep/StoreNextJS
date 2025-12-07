'use client';

import { useAppSelector } from '@/hooks/useAppSelector';
import { NewsAdminPage } from './components/NewsAdminPage/NewsAdminPage';
import { NewsUserPage } from './components/NewsUserPage/NewsUserPage';
import { Container } from '@/components/layout/Container/Container';

export default function NewsPage() {
  const { user } = useAppSelector((state) => state.auth);
  
  const isAdmin = user?.role === 'admin';

  return (
    <Container>
      {isAdmin ? <NewsAdminPage /> : <NewsUserPage />}
    </Container>
  );
}