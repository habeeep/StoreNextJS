'use client';

import { InputHTMLAttributes, useState, KeyboardEvent, useEffect } from 'react';
import { CrossIcon } from '@/components/ui/icons/CrossIcon';
import { SearchIcon } from '@/components/ui/icons/SearchIcon';
import styles from './InputSearch.module.css';
import { useCustomizer } from '@/hooks/useCustomizer';

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  initialValue?: string;
  debounceMs?: number;
  onSearch: (value: string) => void;
  onClear?: () => void;
}

export const InputSearch = ({
  initialValue = '',
  debounceMs = 300,
  onSearch,
  onClear,
  className = '',
  placeholder = 'Поиск...',
  ...props
}: SearchInputProps) => {
  const custom = useCustomizer();
  const [value, setValue] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (value === initialValue) return;

    const timer = setTimeout(() => {
      onSearch(value);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [value, debounceMs, onSearch, initialValue]);

  const handleClear = () => {
    setValue('');
    if (onClear) {
      onClear();
    } else {
      onSearch('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(value);
      e.currentTarget.blur();
    }
    
    if (e.key === 'Escape') {
      handleClear();
      e.currentTarget.blur();
    }
  };

  const handleSearchClick = () => {
    onSearch(value);
  };

  return (
    <div className={`${styles.searchContainer} ${className}`}>
      <div className={`${styles.inputWrapper} ${isFocused ? styles.focused : ''}`}>
        <button
          type="button"
          className={styles.searchButton}
          onClick={handleSearchClick}
          aria-label="Найти"
          title="Найти"
          style={{"--color-custom": `var(--color-${custom.theme}-500)`} as React.CSSProperties}
        >
          <SearchIcon size={20} />
        </button>

        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={styles.input}
          aria-label="Поиск товаров"
          style={{"--color-custom": `var(--color-${custom.theme}-200)`} as React.CSSProperties}
          {...props}
        />

        {value && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={handleClear}
            aria-label="Очистить поиск"
            title="Очистить"
            style={{"--color-custom": `var(--color-${custom.theme}-500)`} as React.CSSProperties}
          >
            <CrossIcon size={20} />
          </button>
        )}
      </div>
    </div>
  );
};