'use client';

import { useState, useEffect, useRef } from 'react';
import { Product } from '@/types/catalog';
import { Brand } from '@/types/brand';
import { CategoryNode } from '@/types/category';
import { DotsIcon } from '@/components/ui/icons/DotsIcon';
import { getBrandNameForProduct, getCategoryNameForProduct } from '@/lib/utils/catalogUtils';
import styles from './ProductTableRow.module.css';

interface ProductTableRowProps {
  product: Product;
  brands: Brand[];
  categories: CategoryNode[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onView: (productId: string) => void;
}

export const ProductTableRow = ({
  product,
  brands,
  categories,
  onEdit,
  onDelete,
  onView,
}: ProductTableRowProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const brandName = getBrandNameForProduct(product, brands);
  const categoryName = getCategoryNameForProduct(product, categories);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showMenu &&
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  return (
    <tr className={styles.row}>
      <td className={styles.td}>
        <div className={styles.productName}>
          {product.title}
        </div>
        <div className={styles.productDescription}>
          {product.description}
        </div>
      </td>
      
      <td className={styles.td}>
        <div className={styles.brand}>
          {brandName}
        </div>
      </td>
      
      <td className={styles.td}>
        <div className={styles.categories}>
          {categoryName}
        </div>
      </td>

      <td className={styles.td}>
        <div className={styles.productPrice}>
          {product.price} ₽
        </div>
        <div className={styles.productAmount}>
          В наличии: {product.amount} шт.
        </div>
      </td>
      
      <td className={styles.td}>
        <div className={styles.actions}>
          <button 
            ref={buttonRef}
            className={styles.menuButton}
            onClick={toggleMenu}
            aria-label="Действия"
          >
            <DotsIcon size={20} />
          </button>
          
          {showMenu && (
            <div 
              ref={menuRef}
              className={styles.menu}
            >            
              <button 
                className={styles.menuItem}
                onClick={() => {
                  onEdit(product);
                  setShowMenu(false);
                }}
              >
                Редактировать
              </button>
              
              <button 
                className={styles.menuItem}
                onClick={() => {
                  onDelete(product.id);
                  setShowMenu(false);
                }}
              >
                Удалить
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};