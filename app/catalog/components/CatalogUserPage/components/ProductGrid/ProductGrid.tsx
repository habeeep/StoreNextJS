'use client';

import { Product } from '@/types/catalog';
import { ProductCard } from '../ProductCard/ProductCard';
import styles from './ProductGrid.module.css';
import { useCustomizer } from '@/hooks/useCustomizer';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (id: string) => void;
  onRemoveFromCart: (id: string) => void;
  onIncrementQuantity: (id: string) => void;
  onDecrementQuantity: (id: string) => void;
}

export const ProductGrid = ({
  products, 
  onAddToCart, 
  onRemoveFromCart, 
  onIncrementQuantity, 
  onDecrementQuantity 
}: ProductGridProps) => {
  const custom = useCustomizer();
  if (products.length === 0) {
    return <div className={styles.noProducts}>Товары не найдены</div>;
  }

  return (
    <div className={styles.grid} style={{"--color-custom": `var(--color-${custom.theme}-200)`} as React.CSSProperties}>
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onRemoveFromCart={onRemoveFromCart}
          onIncrementQuantity={onIncrementQuantity}
          onDecrementQuantity={onDecrementQuantity}
        />
      ))}
    </div>
  );
};