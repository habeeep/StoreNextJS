'use client';

import { useAppSelector } from '@/hooks/useAppSelector';
import { CartPage } from './components/CartPage/CartPage';
import { Container } from '@/components/layout/Container/Container';

export default function CatalogPage() {

  return (
    <Container>
      <CartPage />
    </Container>
  );
}