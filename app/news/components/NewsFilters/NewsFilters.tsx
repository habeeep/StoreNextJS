'use client';

import { SortOption, NewsFilters as FiltersType } from '@/types/news';
import { SortAscIcon } from '@/components/ui/icons/SortAscIcon';
import { SortDescIcon } from '@/components/ui/icons/SortDescIcon';
import { ToggleSwitch } from '@/components/ui/ToggleSwitch/ToggleSwitch';
import styles from './NewsFilters.module.css';
import { useCustomizer } from '@/hooks/useCustomizer';

interface NewsFiltersProps {
  filters: FiltersType;
  onFiltersChange: (filters: FiltersType) => void;
  isLoggedIn?: boolean;
}

export const NewsFilters = ({ 
  filters, 
  onFiltersChange, 
  isLoggedIn = false 
}: NewsFiltersProps) => {
  const custom = useCustomizer();
  const handleSortChange = (sortBy: SortOption) => {
    onFiltersChange({ ...filters, sortBy });
  };

  const handleFavoritesToggle = () => {
    if (!isLoggedIn) {
      alert('Для работы с избранным нужно войти в систему');
      return;
    }
    
    onFiltersChange({ 
      ...filters, 
      showFavoritesOnly: !filters.showFavoritesOnly 
    });
  };

  return (
    <div className={styles.filters} style={{"--color-custom": `var(--color-${custom.theme}-800)`} as React.CSSProperties}>
      <div className={styles.sortButtons}>
        <div className={styles.sortLeft}>
          <span className={styles.filtersText}>По дате</span>
          <button
            className={`${styles.sortButton} ${
              filters.sortBy === 'date-asc' ? styles.active : ''
            }`}
            onClick={() => handleSortChange('date-asc')}
            style={{"--color-custom": `var(--color-${custom.theme}-300)`,
          "--color-custom-act": `var(--color-${custom.theme}-600)`} as React.CSSProperties}
          >
            <SortAscIcon/>
          </button>
          <button
            className={`${styles.sortButton} ${
              filters.sortBy === 'date-desc' ? styles.active : ''
            }`}
            onClick={() => handleSortChange('date-desc')}
            style={{"--color-custom": `var(--color-${custom.theme}-300)`,
          "--color-custom-act": `var(--color-${custom.theme}-600)`} as React.CSSProperties}
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
            style={{"--color-custom": `var(--color-${custom.theme}-300)`,
          "--color-custom-act": `var(--color-${custom.theme}-600)`} as React.CSSProperties}
          >
            <SortAscIcon/>
          </button>
          <button
            className={`${styles.sortButton} ${
              filters.sortBy === 'popularity-desc' ? styles.active : ''
            }`}
            onClick={() => handleSortChange('popularity-desc')}
            style={{"--color-custom": `var(--color-${custom.theme}-300)`,
          "--color-custom-act": `var(--color-${custom.theme}-600)`} as React.CSSProperties}
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
          disabled={!isLoggedIn}
        />
        {!isLoggedIn && (
          <span className={styles.loginHint}>(требуется вход)</span>
        )}
      </div>
    </div>
  );
};