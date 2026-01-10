'use client';

import { useState, useEffect, useRef } from 'react';
import { Product, Brand, Category } from '@/types/catalog';
import { DotsIcon } from '@/components/ui/icons/Dots';
import styles from './ProductTableRow.module.css';

interface ProductTableRowProps {
  product: Product;
  brands: Brand[];
  categories: Category[];
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

  const getBrandName = (brandId: string) => {
    const brand = brands.find(b => b.name === product.brand);
    return brand?.name || product.brand;
  };

  const getCategoryNames = () => {
    const category = categories.find(c => c.id === product.categoryId);
    const subCategory = category?.subCategories.find(s => s.id === product.subCategoryId);
    
    const names: string[] = [];
    if (category) names.push(category.name);
    if (subCategory) names.push(subCategory.name);
    
    return names.join(' / ');
  };

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
          {product.name}
        </div>
      </td>
      
      <td className={styles.td}>
        <div className={styles.brand}>
          {getBrandName(product.brand)}
        </div>
      </td>
      
      <td className={styles.td}>
        <div className={styles.categories}>
          {getCategoryNames()}
        </div>
      </td>

      <td className={styles.td}>
        <div className={styles.productPrice}>
          {product.price} ₽
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
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};