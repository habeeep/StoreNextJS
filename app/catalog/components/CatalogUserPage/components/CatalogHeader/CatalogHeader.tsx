'use client';

import { SortOption, CatalogFilters } from '@/types/catalog';
import { SortAscIcon } from '@/components/ui/icons/SortAscIcon';
import { SortDescIcon } from '@/components/ui/icons/SortDescIcon';
import { InputSearch } from '@/components/ui/InputSearch/InputSearch';
import styles from './CatalogHeader.module.css';

interface CatalogHeaderProps {
  filters: CatalogFilters;
  onFiltersChange: (filters: CatalogFilters) => void;
}

export const CatalogHeader = ({ filters, onFiltersChange }: CatalogHeaderProps) => {
  const handleSortChange = (sortBy: SortOption) => {
    onFiltersChange({ ...filters, sortBy });
  };

  const handleSearch = (searchQuery: string) => {
    onFiltersChange({ ...filters, searchQuery });
  };

  const handleClearSearch = () => {
    onFiltersChange({ ...filters, searchQuery: '' });
  };

  return (
    <div className={styles.header}>
      <div className={styles.sorting}>        
        <div className={styles.sortButtons}>
          <div className={styles.sortLeft}>
            <span className={styles.filtersText}>Цена</span>
            <button
              className={`${styles.sortButton} ${filters.sortBy === 'price-asc' ? styles.active : ''}`}
              onClick={() => handleSortChange('price-asc')}
              title="По возрастанию цены"
            >
              <SortAscIcon />
            </button>
            <button
              className={`${styles.sortButton} ${filters.sortBy === 'price-desc' ? styles.active : ''}`}
              onClick={() => handleSortChange('price-desc')}
              title="По убыванию цены"
            >
              <SortDescIcon />
            </button>
          </div>
          <div className={styles.sortRight}>
            <span className={styles.filtersText}>Популярность</span>
            <button
              className={`${styles.sortButton} ${filters.sortBy === 'popularity-asc' ? styles.active : ''}`}
              onClick={() => handleSortChange('popularity-asc')}
              title="По возрастанию популярности"
            >
              <SortAscIcon />
            </button>
            <button
              className={`${styles.sortButton} ${filters.sortBy === 'popularity-desc' ? styles.active : ''}`}
              onClick={() => handleSortChange('popularity-desc')}
              title="По убыванию популярности"
            >
              <SortDescIcon />
            </button>
          </div>
        </div>
      </div>

      <div className={styles.search}>
        <InputSearch
          initialValue={filters.searchQuery}
          onSearch={handleSearch}
          onClear={handleClearSearch}
          placeholder="Поиск..."
          className={styles.searchInput}
        />
      </div>
    </div>
  );
};