'use client';

import { AdminProductSortBy } from '@/types/catalog';
import { SortAscIcon } from '@/components/ui/icons/SortAscIcon';
import { SortDescIcon } from '@/components/ui/icons/SortDescIcon';
import { InputSearch } from '@/components/ui/InputSearch/InputSearch';
import styles from './AdminSortHeader.module.css';

interface AdminSortHeaderProps {
  sortBy: AdminProductSortBy;
  sortOrder: 'asc' | 'desc';
  searchQuery: string;
  onSortChange: (field: AdminProductSortBy) => void;
  onSearch: (searchQuery: string) => void;
  onClearSearch: () => void;
}

export const AdminSortHeader = ({
  sortBy: currentSortBy,
  sortOrder,
  searchQuery,
  onSortChange,
  onSearch,
  onClearSearch,
}: AdminSortHeaderProps) => {
  const handleSortClick = (field: AdminProductSortBy) => {
    onSortChange(field);
  };

  return (
    <div className={styles.header}>
      <div className={styles.sorting}>
        <div className={styles.sortGroup}>
          <span className={styles.sortLabel}>Названию</span>
          <button
            className={`${styles.sortButton} ${
              currentSortBy === 'name' && sortOrder === 'asc' ? styles.active : ''
            }`}
            onClick={() => handleSortClick('name')}
            title="По названию (А-Я)"
          >
            <SortAscIcon />
          </button>
          <button
            className={`${styles.sortButton} ${
              currentSortBy === 'name' && sortOrder === 'desc' ? styles.active : ''
            }`}
            onClick={() => handleSortClick('name')}
            title="По названию (Я-А)"
          >
            <SortDescIcon />
          </button>
        </div>

        <div className={styles.sortGroup}>
          <span className={styles.sortLabel}>Бренду</span>
          <button
            className={`${styles.sortButton} ${
              currentSortBy === 'brand' && sortOrder === 'asc' ? styles.active : ''
            }`}
            onClick={() => handleSortClick('brand')}
            title="По бренду (А-Я)"
          >
            <SortAscIcon />
          </button>
          <button
            className={`${styles.sortButton} ${
              currentSortBy === 'brand' && sortOrder === 'desc' ? styles.active : ''
            }`}
            onClick={() => handleSortClick('brand')}
            title="По бренду (Я-А)"
          >
            <SortDescIcon />
          </button>
        </div>

        <div className={styles.sortGroup}>
          <span className={styles.sortLabel}>Категории</span>
          <button
            className={`${styles.sortButton} ${
              currentSortBy === 'category' && sortOrder === 'asc' ? styles.active : ''
            }`}
            onClick={() => handleSortClick('category')}
            title="По категории (А-Я)"
          >
            <SortAscIcon />
          </button>
          <button
            className={`${styles.sortButton} ${
              currentSortBy === 'category' && sortOrder === 'desc' ? styles.active : ''
            }`}
            onClick={() => handleSortClick('category')}
            title="По категории (Я-А)"
          >
            <SortDescIcon />
          </button>
        </div>

        <div className={styles.sortGroup}>
          <span className={styles.sortLabel}>Цене</span>
          <button
            className={`${styles.sortButton} ${
              currentSortBy === 'price' && sortOrder === 'asc' ? styles.active : ''
            }`}
            onClick={() => handleSortClick('price')}
            title="По возрастанию цены"
          >
            <SortAscIcon />
          </button>
          <button
            className={`${styles.sortButton} ${
              currentSortBy === 'price' && sortOrder === 'desc' ? styles.active : ''
            }`}
            onClick={() => handleSortClick('price')}
            title="По убыванию цены"
          >
            <SortDescIcon />
          </button>
        </div>
      </div>

      <div className={styles.search}>
        <InputSearch
          initialValue={searchQuery}
          onSearch={onSearch}
          onClear={onClearSearch}
          placeholder="Поиск по названию..."
          className={styles.searchInput}
        />
      </div>
    </div>
  );
};