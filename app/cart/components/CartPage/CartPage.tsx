'use client';

import { useEffect } from 'react';
import { CartSidebar } from '../CartSidebar/CartSidebar';
import { CartItem } from '../CartItem/CartItem';
import { CartItem as CartItemType } from '@/types/cart';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { initCart, updateItem, removeItem } from '@/store/slices/cartSlice';
import styles from './CartPage.module.css';
import { useCustomizer } from '@/hooks/useCustomizer';

export const CartPage = () => {
  const custom = useCustomizer();
  const dispatch = useAppDispatch();
  const { items } = useAppSelector(s => s.cart);
  const { user } = useAppSelector(s => s.auth);

  useEffect(() => {
    dispatch(initCart());
  }, [dispatch]);

  const selectedItems = items.filter(i => i.status !== 'NOT_SELECTED');

  const orderInfo = {
    totalItems: selectedItems.reduce((sum, it) => sum + it.quantity, 0),
    totalPrice: selectedItems.reduce((sum, it) => sum + ((it.price || 0) * it.quantity), 0),
    address: 'Не указан',
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    dispatch(updateItem({ id: itemId, quantity: newQuantity }));
  };

  const handleToggleSelect = (itemId: string) => {
    const it = items.find(x => x.id === itemId || x.productId === itemId);
    const newStatus = it?.status === 'SELECTED' ? 'NOT_SELECTED' : 'SELECTED';
    dispatch(updateItem({ id: itemId, status: newStatus }));
  };

  const handleRemoveItem = (itemId: string) => {
    dispatch(removeItem({ id: itemId }));
  };

  const handleCheckout = () => {
    if (!user) {
      alert('Требуется авторизация для оформления заказа');
      return;
    }
    alert(`Оформление заказа — сумма: ${orderInfo.totalPrice} ₽`);
  };

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <aside className={styles.sidebar}>
          <CartSidebar 
            orderInfo={orderInfo}
            selectedItems={selectedItems as unknown as CartItemType[]}
            onCheckout={handleCheckout}
            isAuth={!!user}
          />
        </aside>

        <main className={styles.main} style={{"--color-custom": `var(--color-${custom.theme}-200)`} as React.CSSProperties}>
          {items.length > 0 ? (
            <div className={styles.itemsList}>
              {items.map(item => (
                <CartItem
                  key={item.id}
                  item={{
                    id: item.id,
                    productId: item.productId,
                    name: item.name || '',
                    price: item.price || 0,
                    quantity: item.quantity,
                    isSelected: item.status !== 'NOT_SELECTED',
                    imageUrl: '/images/catalog/plants1.png'
                  }}
                  onToggleSelect={() => handleToggleSelect(item.id)}
                  onQuantityChange={(quantity) => handleQuantityChange(item.id, quantity)}
                  onRemove={() => handleRemoveItem(item.id)}
                />
              ))}
            </div>
          ) : (
            <div className={styles.emptyCart}>
              Корзина пуста
            </div>
          )}
        </main>
      </div>
    </div>
  );
}