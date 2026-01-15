'use client';

import Image from 'next/image';
import { Product } from '@/types/catalog';
import { CartIcon } from '@/components/ui/icons/CartIcon';
import { PlusIcon } from '@/components/ui/icons/PlusIcon';
import { MinusIcon } from '@/components/ui/icons/MinusIcon';
import styles from './ProductCard.module.css';
import { useCustomizer } from '@/hooks/useCustomizer';

interface ProductCardProps {
  product: Product;
  onAddToCart: (id: string) => void;
  onRemoveFromCart: (id: string) => void;
  onIncrementQuantity: (id: string) => void;
  onDecrementQuantity: (id: string) => void;
}

export const ProductCard = ({ 
  product, 
  onAddToCart, 
  onRemoveFromCart,
  onIncrementQuantity,
  onDecrementQuantity
}: ProductCardProps) => {
  const custom = useCustomizer();
  const handleAddToCart = () => {
    onAddToCart(product.id);
  };

  const handleIncrement = () => {
    onIncrementQuantity(product.id);
  };

  const handleDecrement = () => {
    if (product.cartQuantity === 1) {
      onRemoveFromCart(product.id);
    } else {
      onDecrementQuantity(product.id);
    }
  };

  return (
    <div className={styles.card} style={{"--color-custom": `var(--color-${custom.theme}-100)`} as React.CSSProperties}>
      <div className={styles.imageContainer}>
        <Image
          src={product.images?.[0] || ''}
          alt='Растение'
          fill
          sizes='(max-width: 490px) 100vw, 1200px'
          priority
          className={styles.image}
        />
      </div>
      
      <div className={styles.content} style={{"--color-custom": `var(--color-${custom.theme}-700)`} as React.CSSProperties}>
        <div className={styles.header}>
          <h3 className={styles.name}>{product.title}</h3>
          <p className={styles.description}>{product.description}</p>
        </div>
        
        <div className={styles.footer} style={{"--color-custom": `var(--color-${custom.theme}-100)`} as React.CSSProperties}>
          <div className={styles.price}>{product.price} ₽</div>
          {product.inCart ? (
            <div className={styles.quantityControls}>
              <button 
                className={styles.quantityButton}
                onClick={handleDecrement}
                aria-label="Уменьшить количество"
              >
                <MinusIcon className={styles.icon} />
              </button>
              
              <span className={styles.quantity}>
                {product.cartQuantity || 1}
              </span>
              
              <button 
                className={styles.quantityButton}
                onClick={handleIncrement}
                aria-label="Увеличить количество"
              >
                <PlusIcon className={styles.icon} />
              </button>
            </div>
          ) : (
            <button
              className={styles.cartButton}
              onClick={handleAddToCart}
              aria-label="Добавить в корзину"
            >
              <CartIcon className={styles.icon} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};