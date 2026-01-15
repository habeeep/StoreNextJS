'use client';

import { AdminProductSortBy } from '@/types/catalog';
import { SortAscIcon } from '@/components/ui/icons/SortAscIcon';
import { SortDescIcon } from '@/components/ui/icons/SortDescIcon';
import { InputSearch } from '@/components/ui/InputSearch/InputSearch';
import styles from './AdminSortHeader.module.css';
import { useCustomizer } from '@/hooks/useCustomizer';

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
  const custom = useCustomizer();
  const handleSortClick = (field: AdminProductSortBy) => {
    onSortChange(field);
  };

  return (
    <div className={styles.header}>
      <div className={styles.sorting} style={{"--color-custom": `var(--color-${custom.theme}-800)`} as React.CSSProperties}>
        <div className={styles.sortGroup}>
          <span className={styles.sortLabel}>Названию</span>
          <button
            className={`${styles.sortButton} ${
              currentSortBy === 'title' && sortOrder === 'asc' ? styles.active : ''
            }`}
            onClick={() => handleSortClick('title')}
            title="По названию (А-Я)"
            style={{"--color-custom": `var(--color-${custom.theme}-300)`,
          "--color-custom-act": `var(--color-${custom.theme}-600)`} as React.CSSProperties}
          >
            <SortAscIcon />
          </button>
          <button
            className={`${styles.sortButton} ${
              currentSortBy === 'title' && sortOrder === 'desc' ? styles.active : ''
            }`}
            onClick={() => handleSortClick('title')}
            title="По названию (Я-А)"
            style={{"--color-custom": `var(--color-${custom.theme}-300)`,
          "--color-custom-act": `var(--color-${custom.theme}-600)`} as React.CSSProperties}
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
            style={{"--color-custom": `var(--color-${custom.theme}-300)`,
          "--color-custom-act": `var(--color-${custom.theme}-600)`} as React.CSSProperties}
          >
            <SortAscIcon />
          </button>
          <button
            className={`${styles.sortButton} ${
              currentSortBy === 'brand' && sortOrder === 'desc' ? styles.active : ''
            }`}
            onClick={() => handleSortClick('brand')}
            title="По бренду (Я-А)"
            style={{"--color-custom": `var(--color-${custom.theme}-300)`,
          "--color-custom-act": `var(--color-${custom.theme}-600)`} as React.CSSProperties}
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
            style={{"--color-custom": `var(--color-${custom.theme}-300)`,
          "--color-custom-act": `var(--color-${custom.theme}-600)`} as React.CSSProperties}
          >
            <SortAscIcon />
          </button>
          <button
            className={`${styles.sortButton} ${
              currentSortBy === 'category' && sortOrder === 'desc' ? styles.active : ''
            }`}
            onClick={() => handleSortClick('category')}
            title="По категории (Я-А)"
            style={{"--color-custom": `var(--color-${custom.theme}-300)`,
          "--color-custom-act": `var(--color-${custom.theme}-600)`} as React.CSSProperties}
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
            style={{"--color-custom": `var(--color-${custom.theme}-300)`,
          "--color-custom-act": `var(--color-${custom.theme}-600)`} as React.CSSProperties}
          >
            <SortAscIcon />
          </button>
          <button
            className={`${styles.sortButton} ${
              currentSortBy === 'price' && sortOrder === 'desc' ? styles.active : ''
            }`}
            onClick={() => handleSortClick('price')}
            title="По убыванию цены"
            style={{"--color-custom": `var(--color-${custom.theme}-300)`,
          "--color-custom-act": `var(--color-${custom.theme}-600)`} as React.CSSProperties}
          >
            <SortDescIcon />
          </button>
        </div>

        <div className={styles.sortGroup}>
          <span className={styles.sortLabel}>Количеству</span>
          <button
            className={`${styles.sortButton} ${
              currentSortBy === 'amount' && sortOrder === 'asc' ? styles.active : ''
            }`}
            onClick={() => handleSortClick('amount')}
            title="По возрастанию количества"
            style={{"--color-custom": `var(--color-${custom.theme}-300)`,
          "--color-custom-act": `var(--color-${custom.theme}-600)`} as React.CSSProperties}
          >
            <SortAscIcon />
          </button>
          <button
            className={`${styles.sortButton} ${
              currentSortBy === 'amount' && sortOrder === 'desc' ? styles.active : ''
            }`}
            onClick={() => handleSortClick('amount')}
            title="По убыванию количества"
            style={{"--color-custom": `var(--color-${custom.theme}-300)`,
          "--color-custom-act": `var(--color-${custom.theme}-600)`} as React.CSSProperties}
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