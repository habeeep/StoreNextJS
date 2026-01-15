'use client';

import { useState } from 'react';
import { Brand } from '@/types/brand';
import { DotsIcon } from '@/components/ui/icons/DotsIcon';
import { EditIcon } from '@/components/ui/icons/EditIcon';
import { TrashIcon } from '@/components/ui/icons/TrashIcon';
import { EyeIcon } from '@/components/ui/icons/EyeIcon';
import styles from './BrandTableRow.module.css';
import { useCustomizer } from '@/hooks/useCustomizer';

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
  const custom = useCustomizer();
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <tr className={styles.row} style={{"--color-custom": `var(--color-${custom.theme}-300)`} as React.CSSProperties}>
      <td className={styles.td} style={{"--color-custom": `var(--color-${custom.theme}-300)`} as React.CSSProperties}>
        <div className={styles.brandName} style={{"--color-custom": `var(--color-${custom.theme}-800)`} as React.CSSProperties}>
          {brand.title}
        </div>
        <div className={styles.brandDescription}>
          {brand.description}
        </div>
      </td>
      
      <td className={styles.td} style={{"--color-custom": `var(--color-${custom.theme}-300)`} as React.CSSProperties}>
        <div className={styles.country} style={{"--color-custom": `var(--color-${custom.theme}-800)`} as React.CSSProperties}>
          {brand.country}
        </div>
      </td>
      
      <td className={styles.td} style={{"--color-custom": `var(--color-${custom.theme}-300)`} as React.CSSProperties}>
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
              <div className={styles.menu} style={{"--color-custom": `var(--color-${custom.theme}-100)`} as React.CSSProperties}>
                
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