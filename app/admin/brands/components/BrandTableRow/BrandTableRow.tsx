'use client';

import { useState } from 'react';
import { Brand } from '@/types/brand';
import { DotsIcon } from '@/components/ui/icons/DotsIcon';
import { EditIcon } from '@/components/ui/icons/EditIcon';
import { TrashIcon } from '@/components/ui/icons/TrashIcon';
import { EyeIcon } from '@/components/ui/icons/EyeIcon';
import styles from './BrandTableRow.module.css';

interface BrandTableRowProps {
  brand: Brand;
  onEdit: (brand: Brand) => void;
  onDelete: (brandId: string) => void;
  onView: (brandId: string) => void;
}

export const BrandTableRow = ({
  brand,
  onEdit,
  onDelete,
  onView,
}: BrandTableRowProps) => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <tr className={styles.row}>
      <td className={styles.td}>
        <div className={styles.brandName}>
          {brand.title}
        </div>
        <div className={styles.brandDescription}>
          {brand.description}
        </div>
      </td>
      
      <td className={styles.td}>
        <div className={styles.country}>
          {brand.country}
        </div>
      </td>
      
      <td className={styles.td}>
        <div className={styles.actions}>          
          <div className={styles.menuContainer}>
            <button 
              className={styles.menuButton}
              onClick={toggleMenu}
              aria-label="Действия"
            >
              <DotsIcon size={20} />
            </button>
            
            {showMenu && (
              <div className={styles.menu}>
                
                <button 
                  className={styles.menuItem}
                  onClick={() => {
                    onEdit(brand);
                    setShowMenu(false);
                  }}
                >
                  <EditIcon size={16} />
                  Редактировать
                </button>
                
                <button 
                  className={styles.menuItem}
                  onClick={() => {
                    onDelete(brand.id);
                    setShowMenu(false);
                  }}
                >
                  <TrashIcon size={16} />
                  Удалить
                </button>
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
};