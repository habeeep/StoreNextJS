'use client';

import { CartItem as CartItemType } from '@/types/cart';
import Image from 'next/image';
import { CheckIcon } from '@/components/ui/icons/CheckIcon';
import { MinusIcon } from '@/components/ui/icons/MinusIcon';
import { PlusIcon } from '@/components/ui/icons/PlusIcon';
import { TrashIcon } from '@/components/ui/icons/TrashIcon';
import styles from './CartItem.module.css';
import { useCustomizer } from '@/hooks/useCustomizer';

interface CartItemProps {
  item: CartItemType;
  onToggleSelect: () => void;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}

export const CartItem = ({ 
  item, 
  onToggleSelect, 
  onQuantityChange,
  onRemove 
}: CartItemProps) => {
  const custom = useCustomizer();
  
  const handleIncrement = () => {
    onQuantityChange(item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      onQuantityChange(item.quantity - 1);
    }
  };

  return (
    <div className={`${styles.item} ${item.isSelected ? styles.selected : ''}`} style={{"--color-custom": `var(--color-${custom.theme}-100)`} as React.CSSProperties}>
      <label className={styles.checkboxWrapper}>
        <input
          type="checkbox"
          checked={item.isSelected}
          onChange={onToggleSelect}
          className={styles.checkbox}
          aria-label={`Выбрать ${item.name}`}
          style={{"--color-custom": `var(--color-${custom.theme}-600)`} as React.CSSProperties}
        />
        {item.isSelected && (
          <CheckIcon
            size={24}
            strokeWidth={5}
            className={styles.checkboxIcon}
            style={{"--color-custom": `var(--color-${custom.theme}-100)`} as React.CSSProperties}
          />
        )}
      </label>
      
      <div className={styles.imageWrapper} style={{"--color-custom": `var(--color-${custom.theme}-600)`} as React.CSSProperties}>
        <div className={styles.imageContainer}>
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="(max-width: 490px) 100vw, 1200px"
            priority
            className={styles.image}
          />
        </div>
      </div>
      
      <div className={styles.info}>
        <h3 className={styles.name}>{item.name}</h3>
        <div className={styles.price}>{item.price} ₽</div>
      </div>
      
      <div className={styles.quantityControls}>
        <button 
          className={styles.quantityButton}
          onClick={handleDecrement}
          aria-label="Уменьшить количество"
          style={{"--color-custom": `var(--color-${custom.theme}-600)`} as React.CSSProperties}
        >
          <MinusIcon size={24} />
        </button>
        
        <span className={styles.quantity}>{item.quantity}</span>
        
        <button 
          className={styles.quantityButton}
          onClick={handleIncrement}
          aria-label="Увеличить количество"
          style={{"--color-custom": `var(--color-${custom.theme}-600)`} as React.CSSProperties}
        >
          <PlusIcon size={24} />
        </button>
      </div>
      
      <button 
        className={styles.removeButton}
        onClick={onRemove}
        aria-label="Удалить товар"
        style={{"--color-custom": `var(--color-${custom.theme}-600)`} as React.CSSProperties}
      >
        <TrashIcon size={24} />
      </button>
    </div>
  );
};