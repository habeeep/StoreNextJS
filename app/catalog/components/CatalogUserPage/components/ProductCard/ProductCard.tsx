'use client';

import { Product } from '@/types/catalog';
import { CartIcon } from '@/components/ui/icons/CartIcon';
import { PlusIcon } from '@/components/ui/icons/PlusIcon';
import { MinusIcon } from '@/components/ui/icons/MinusIcon';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
  onAddToCart: (id: string) => void;
  onRemoveFromCart: (id: string) => void;
}

export const ProductCard = ({ product, onAddToCart, onRemoveFromCart }: ProductCardProps) => {
  const handleCartAction = () => {
    if (product.inCart) {
      onRemoveFromCart(product.id);
    } else {
      onAddToCart(product.id);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <div className={styles.imagePlaceholder}>
          <span>Фото товара</span>
        </div>
      </div>

      <h3 className={styles.name}>{product.name}</h3>

      <p className={styles.description}>{product.description}</p>
      <div className={styles.footer}>
        <div className={styles.price}>{product.price} ₽</div>
        
        <button
          className={`${styles.cartButton} ${product.inCart ? styles.inCart : ''}`}
          onClick={handleCartAction}
        >
          {product.inCart ? (
            <>
              <MinusIcon className={styles.cartIcon} />
              <span className={styles.quantity}>{product.cartQuantity}</span>
              <PlusIcon className={styles.cartIcon} />
            </>
          ) : (
            <>
              <CartIcon className={styles.cartIcon} />
              <span>В корзину</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};