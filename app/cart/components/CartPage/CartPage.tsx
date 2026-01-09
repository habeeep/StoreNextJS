'use client';

import { useState } from 'react';
import { CartSidebar } from '../CartSidebar/CartSidebar';
import { CartItem } from '../CartItem/CartItem';
import { CartItem as CartItemType } from '@/types/cart';
import styles from './CartPage.module.css';

export const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItemType[]>([
    {
      id: '1',
      productId: 'p1',
      name: 'Монстера',
      price: 2500,
      quantity: 2,
      isSelected: true,
      imageUrl: '/images/catalog/plants1.png'
    },
    {
      id: '2',
      productId: 'p2',
      name: 'Фикус',
      price: 1800,
      quantity: 1,
      isSelected: true,
      imageUrl: '/images/catalog/plants1.png'
    },
    {
      id: '3',
      productId: 'p3',
      name: 'Сансевиерия',
      price: 1200,
      quantity: 3,
      isSelected: false,
      imageUrl: '/images/catalog/plants1.png'
    }
  ]);

  const [orderInfo, setOrderInfo] = useState({
    totalItems: 6,
    totalPrice: 2500 * 2 + 1800 * 1 + 1200 * 3,
    address: 'Москва, ул. Примерная, д. 1'
  });

  const selectedItems = cartItems.filter(item => item.isSelected);

  const updateOrderInfo = (items: CartItemType[]) => {
    const selectedItems = items.filter(item => item.isSelected);
    const totalItems = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    setOrderInfo(prev => ({
      ...prev,
      totalItems,
      totalPrice
    }));
    
    return selectedItems;
  };

  const handleToggleSelect = (itemId: string) => {
    const updatedItems = cartItems.map(item => 
      item.id === itemId 
        ? { ...item, isSelected: !item.isSelected }
        : item
    );
    
    setCartItems(updatedItems);
    updateOrderInfo(updatedItems);
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedItems = cartItems.map(item => 
      item.id === itemId 
        ? { ...item, quantity: newQuantity }
        : item
    );
    
    setCartItems(updatedItems);
    updateOrderInfo(updatedItems);
  };

  const handleRemoveItem = (itemId: string) => {
    const updatedItems = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedItems);
    updateOrderInfo(updatedItems);
  };

  const handleCheckout = () => {
    const selectedItems = cartItems.filter(item => item.isSelected);
    if (selectedItems.length === 0) {
      alert('Выберите хотя бы один товар');
      return;
    }
    
    alert(`Заказ оформлен! Сумма: ${orderInfo.totalPrice} ₽`);
  };

  return (
    <div className={styles.page}>      
      <div className={styles.content}>
        <aside className={styles.sidebar}>
          <CartSidebar 
            orderInfo={orderInfo}
            selectedItems={selectedItems}
            onCheckout={handleCheckout}
          />
        </aside>

        <main className={styles.main}>
          {cartItems.length > 0 ? (
            <div className={styles.itemsList}>
              {cartItems.map(item => (
                <CartItem
                  key={item.id}
                  item={item}
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