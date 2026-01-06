'use client';

import { useAppSelector } from '@/hooks/useAppSelector';
import { CatalogUserPage } from './components/CatalogUserPage/CatalogUserPage';
import { Container } from '@/components/layout/Container/Container';

// Компонент для админа пока не создан
const CatalogAdminPage = () => (
  <div>Админская страница товаров (скоро)</div>
);

export default function CatalogPage() {
  const { user } = useAppSelector((state) => state.auth);
  
  const isAdmin = user?.role === 'admin';

  return (
    <Container>
      {isAdmin ? <CatalogAdminPage /> : <CatalogUserPage />}
    </Container>
  );
}