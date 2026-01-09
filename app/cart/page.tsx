'use client';

import { useAppSelector } from '@/hooks/useAppSelector';
import { CartPage } from './components/CartPage/CartPage';
import { Container } from '@/components/layout/Container/Container';

export default function CatalogPage() {
  const { user } = useAppSelector((state) => state.auth);
  
  const isAdmin = user?.role === 'admin';

  return (
    <Container>
      {isAdmin ? <></> : <CartPage />}
    </Container>
  );
}