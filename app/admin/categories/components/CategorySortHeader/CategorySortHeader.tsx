'use client';

import { CategorySortOrder } from '@/types/category';
import { SortAscIcon } from '@/components/ui/icons/SortAscIcon';
import { SortDescIcon } from '@/components/ui/icons/SortDescIcon';
import styles from './CategorySortHeader.module.css';
import { useCustomizer } from '@/hooks/useCustomizer';

interface CategorySortHeaderProps {
  sortOrder: CategorySortOrder;
  onSortChange: (order: CategorySortOrder) => void;
}

export const CategorySortHeader = ({
  sortOrder,
  onSortChange,
}: CategorySortHeaderProps) => {
  const custom = useCustomizer();
  const handleSortAsc = () => {
    onSortChange(sortOrder === 'asc' ? 'none' : 'asc');
  };

  const handleSortDesc = () => {
    onSortChange(sortOrder === 'desc' ? 'none' : 'desc');
  };

  return (
    <div className={styles.sorting} style={{"--color-custom": `var(--color-${custom.theme}-800)`} as React.CSSProperties}>
      <div className={styles.sortButtons}>
        <span className={styles.filtersText}>Название категории</span>
        <button
          className={`${styles.sortButton} ${sortOrder === 'asc' ? styles.active : ''}`}
          onClick={handleSortAsc}
          title="По возрастанию"
          style={{"--color-custom": `var(--color-${custom.theme}-300)`,
          "--color-custom-act": `var(--color-${custom.theme}-600)`} as React.CSSProperties}
        >
          <SortAscIcon />
        </button>
        <button
          className={`${styles.sortButton} ${sortOrder === 'desc' ? styles.active : ''}`}
          onClick={handleSortDesc}
          title="По убыванию"
          style={{"--color-custom": `var(--color-${custom.theme}-300)`,
          "--color-custom-act": `var(--color-${custom.theme}-600)`} as React.CSSProperties}
        >
          <SortDescIcon />
        </button>
      </div>
    </div>
  );
};