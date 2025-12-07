'use client';

import { SortOption, NewsFilters as FiltersType } from '@/types/news';
import { SortAscIcon } from '@/components/ui/icons/SortAscIcon';
import { SortDescIcon } from '@/components/ui/icons/SortDescIcon';
import { ToggleSwitch } from '@/components/ui/ToggleSwitch/ToggleSwitch'
import styles from './NewsFilters.module.css';

interface NewsFiltersProps {
  filters: FiltersType;
  onFiltersChange: (filters: FiltersType) => void;
}

export const NewsFilters = ({ filters, onFiltersChange }: NewsFiltersProps) => {
  const handleSortChange = (sortBy: SortOption) => {
    onFiltersChange({ ...filters, sortBy });
  };

  const handleFavoritesToggle = () => {
    onFiltersChange({ 
      ...filters, 
      showFavoritesOnly: !filters.showFavoritesOnly 
    });
  };

  return (
    <div className={styles.filters}>
      <div className={styles.sortButtons}>
        <div className={styles.sortLeft}>
          <span className={styles.filtersText}>По дате</span>
          <button
            className={`${styles.sortButton} ${
              filters.sortBy === 'date-asc' ? styles.active : ''
            }`}
            onClick={() => handleSortChange('date-asc')}
          >
            <SortAscIcon/>
          </button>
          <button
            className={`${styles.sortButton} ${
              filters.sortBy === 'date-desc' ? styles.active : ''
            }`}
            onClick={() => handleSortChange('date-desc')}
          >
            <SortDescIcon/>
          </button>
        </div>
        <div className={styles.sortRight}>
          <span className={styles.filtersText}>По популярности</span>
          <button
            className={`${styles.sortButton} ${
              filters.sortBy === 'popularity-asc' ? styles.active : ''
            }`}
            onClick={() => handleSortChange('popularity-asc')}
          >
            <SortAscIcon/>
          </button>
          <button
            className={`${styles.sortButton} ${
              filters.sortBy === 'popularity-desc' ? styles.active : ''
            }`}
            onClick={() => handleSortChange('popularity-desc')}
          >
            <SortDescIcon/>
          </button>
        </div>
      </div>

      <div className={styles.favoritesFilter}>
        <ToggleSwitch
          checked={filters.showFavoritesOnly}
          onChange={handleFavoritesToggle}
          label='Избранное'
          labelClassName={styles.checkboxLabel}
        />
      </div>
    </div>
  );
};