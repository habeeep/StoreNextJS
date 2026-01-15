'use client';

import { CartItem, OrderInfo } from '@/types/cart';
import { Button } from '@/components/ui/Button/Button';
import styles from './CartSidebar.module.css';
import { useCustomizer } from '@/hooks/useCustomizer';

interface CartSidebarProps {
  orderInfo: OrderInfo;
  selectedItems: CartItem[];
  onCheckout: () => void;
  isAuth?: boolean;
}

export const CartSidebar = ({ 
  orderInfo, 
  selectedItems, 
  onCheckout 
  , isAuth = false
}: CartSidebarProps) => {
  const custom = useCustomizer();
  return (
    <div className={styles.sidebar} style={{"--color-custom": `var(--color-${custom.theme}-200)`} as React.CSSProperties}>
      <h2 className={styles.sidebarTitle}>Оформить заказ</h2>
      
      <div className={styles.orderDetails}>
        <div className={styles.selectedItems}>          
          {selectedItems.length > 0 ? (
            <ul className={styles.itemsList}>
              {selectedItems.map(item => (
                <li key={item.id} className={styles.itemRow}>
                  <div className={styles.itemInfo}>
                    <span className={styles.itemName}>{item.name}</span>
                    <span className={styles.itemQuantity}> × {item.quantity}</span>
                  </div>
                  <div className={styles.dots} style={{"--color-custom": `var(--color-${custom.theme}-800)`} as React.CSSProperties}></div>
                  <span className={styles.itemPrice}>
                    {item.price * item.quantity} ₽
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.noItems}>Нет выбранных товаров</div>
          )}
        </div>

        <div className={styles.totalSection}>
          <span>Сумма заказа:</span>
          <span className={styles.totalPrice}>{orderInfo.totalPrice} ₽</span>
        </div>

        <div className={styles.addressSection}>
          <span className={styles.addressTitle}>Адрес доставки:</span>
          <div className={styles.address}>
            {orderInfo.address}
          </div>
        </div>
      </div>
      
      <Button
        className={styles.checkoutButton}
        onClick={onCheckout}
        disabled={selectedItems.length === 0 || !isAuth}
      >
        Оформить заказ
      </Button>
    </div>
  );
};