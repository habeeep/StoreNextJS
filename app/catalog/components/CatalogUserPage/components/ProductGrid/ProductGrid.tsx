'use client';

import { Product } from '@/types/catalog';
import { ProductCard } from '../ProductCard/ProductCard';
import styles from './ProductGrid.module.css';

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
  if (products.length === 0) {
    return <div className={styles.noProducts}>Товары не найдены</div>;
  }

  return (
    <div className={styles.grid}>
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