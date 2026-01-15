'use client';

import { SortAscIcon } from '@/components/ui/icons/SortAscIcon';
import { SortDescIcon } from '@/components/ui/icons/SortDescIcon';
import { InputSearch } from '@/components/ui/InputSearch/InputSearch';
import styles from './BrandSortHeader.module.css';
import { useCustomizer } from '@/hooks/useCustomizer';

type SortField = 'title' | 'country';

interface BrandSortHeaderProps {
  sortField: SortField;
  sortOrder: 'asc' | 'desc';
  searchQuery: string;
  onSortChange: (field: SortField) => void;
  onSearch: (query: string) => void;
  onClearSearch: () => void;
}

export const BrandSortHeader = ({
  sortField,
  sortOrder,
  searchQuery,
  onSortChange,
  onSearch,
  onClearSearch,
}: BrandSortHeaderProps) => {
  const custom = useCustomizer();
  const handleSortClick = (field: SortField) => {
    onSortChange(field);
  };

  return (
    <div className={styles.header}>
      <div className={styles.sorting} style={{"--color-custom": `var(--color-${custom.theme}-800)`} as React.CSSProperties}>
        <div className={styles.sortContainer}>
          <div className={styles.sortGroup}>
            <span className={styles.sortLabel} style={{"--color-custom": `var(--color-${custom.theme}-700)`} as React.CSSProperties}>Названию</span>
            <button
              className={`${styles.sortButton} ${
                sortField === 'title' && sortOrder === 'asc' ? styles.active : ''
              }`}
              onClick={() => handleSortClick('title')}
              title="По названию (А-Я)"
              style={{"--color-custom": `var(--color-${custom.theme}-300)`} as React.CSSProperties}
            >
              <SortAscIcon />
            </button>
            <button
              className={`${styles.sortButton} ${
                sortField === 'title' && sortOrder === 'desc' ? styles.active : ''
              }`}
              onClick={() => handleSortClick('title')}
              title="По названию (Я-А)"
              style={{"--color-custom": `var(--color-${custom.theme}-300)`} as React.CSSProperties}
            >
              <SortDescIcon />
            </button>
          </div>

          <div className={styles.sortGroup}>
            <span className={styles.sortLabel} style={{"--color-custom": `var(--color-${custom.theme}-700)`} as React.CSSProperties}>Стране</span>
            <button
              className={`${styles.sortButton} ${
                sortField === 'country' && sortOrder === 'asc' ? styles.active : ''
              }`}
              onClick={() => handleSortClick('country')}
              title="По стране (А-Я)"
              style={{"--color-custom": `var(--color-${custom.theme}-300)`} as React.CSSProperties}
            >
              <SortAscIcon />
            </button>
            <button
              className={`${styles.sortButton} ${
                sortField === 'country' && sortOrder === 'desc' ? styles.active : ''
              }`}
              onClick={() => handleSortClick('country')}
              title="По стране (Я-А)"
              style={{"--color-custom": `var(--color-${custom.theme}-300)`,
                "--color-custom-active": `var(--color-${custom.theme}-600)`} as React.CSSProperties}
            >
              <SortDescIcon />
            </button>
          </div>
        </div>
      </div>

      <div className={styles.search}>
        <InputSearch
          initialValue={searchQuery}
          onSearch={onSearch}
          onClear={onClearSearch}
          placeholder="Поиск по названию бренда..."
          className={styles.searchInput}
        />
      </div>
    </div>
  );
};