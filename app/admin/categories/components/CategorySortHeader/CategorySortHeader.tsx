'use client';

import { CategorySortOrder } from '@/types/catalog';
import { SortAscIcon } from '@/components/ui/icons/SortAscIcon';
import { SortDescIcon } from '@/components/ui/icons/SortDescIcon';
import styles from './CategorySortHeader.module.css';

interface CategorySortHeaderProps {
  sortOrder: CategorySortOrder;
  onSortChange: (order: CategorySortOrder) => void;
}

export const CategorySortHeader = ({
  sortOrder,
  onSortChange,
}: CategorySortHeaderProps) => {
  const handleSortAsc = () => {
    onSortChange(sortOrder === 'asc' ? 'none' : 'asc');
  };

  const handleSortDesc = () => {
    onSortChange(sortOrder === 'desc' ? 'none' : 'desc');
  };

  return (
    <div className={styles.sorting}>
      <div className={styles.sortButtons}>
        <span className={styles.filtersText}>Название категории</span>
        <button
          className={`${styles.sortButton} ${sortOrder === 'asc' ? styles.active : ''}`}
          onClick={handleSortAsc}
          title="По возрастанию"
        >
          <SortAscIcon />
        </button>
        <button
          className={`${styles.sortButton} ${sortOrder === 'desc' ? styles.active : ''}`}
          onClick={handleSortDesc}
          title="По убыванию"
        >
          <SortDescIcon />
        </button>
      </div>
    </div>
  );
};